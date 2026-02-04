import { v } from "convex/values";
import { query, mutation, action, internalMutation } from "./_generated/server";
import { requireIdentity } from "./lib/auth";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  checkRateLimit,
  checkDailyQuota,
  logExecution,
  createRateLimitedResponse,
  createQuotaExceededResponse,
  calculateFailedTestsCount,
  logRateLimitedAttempt,
  logQuotaExceededAttempt,
} from "./lib/submissionExecution";

export const listSubmissionsForItem = query({
  args: {
    itemId: v.id("curriculumItems"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const clerkUserId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      return [];
    }

    const limit = args.limit ?? 20;

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_user_item_created", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .order("desc")
      .take(limit);

    return submissions;
  },
});

export const createSubmission = mutation({
  args: { itemId: v.id("curriculumItems"), code: v.string() },
  handler: async (ctx, args) => {
    await requireIdentity(ctx);

    const clerkUserId = (await ctx.auth.getUserIdentity())!.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    if (item.kind !== "challenge") {
      throw new Error("Item is not a challenge");
    }

    const now = Date.now();

    const submissionId = await ctx.db.insert("submissions", {
      userId: user._id,
      itemId: args.itemId,
      kind: "challenge",
      code: args.code,
      status: "queued",
      createdAt: now,
    });

    // Update progress to in_progress if needed
    const existingProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (!existingProgress || existingProgress.status === "not_started") {
      if (existingProgress) {
        await ctx.db.patch(existingProgress._id, {
          status: "in_progress",
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("progress", {
          userId: user._id,
          itemId: args.itemId,
          status: "in_progress",
          updatedAt: now,
        });
      }
    }

    return submissionId;
  },
});

export const createAndRunSubmission = action({
  args: { itemId: v.id("curriculumItems"), code: v.string() },
  handler: async (ctx, args): Promise<{ submissionId?: string; status?: string; quotaInfo?: { runsUsed: number; runsLimit: number; resetsAtMs: number }; blocked?: boolean; code?: string; retryAfterMs?: number; resetsAtMs?: number; message?: string }> => {
    const identity = await requireIdentity(ctx);
    const clerkUserId = identity.subject;
    const user = await ctx.runQuery(internal.users.getUserByClerkUserId, {
      clerkUserId,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 1) Check rate limit using shared helper
    const rateLimitResult = await checkRateLimit(ctx, user._id);
    if (!rateLimitResult.success) {
      await logRateLimitedAttempt(ctx, user._id, "challenge", args.itemId, undefined, rateLimitResult.error);
      return createRateLimitedResponse(rateLimitResult.error);
    }

    // 2) Check daily quota using shared helper
    const quotaResult = await checkDailyQuota(ctx, user._id);
    if (!quotaResult.success) {
      await logQuotaExceededAttempt(ctx, user._id, "challenge", args.itemId, undefined, quotaResult.error);
      return createQuotaExceededResponse(quotaResult.error);
    }

    // 3) Create submission with mutation
    const submissionId: Id<"submissions"> = await ctx.runMutation(internal.submissions.createSubmissionInternal, {
      itemId: args.itemId,
      code: args.code,
    });

    // Update status to running before execution
    await ctx.runMutation(internal.execution.patchSubmissionStatus, {
      submissionId,
      status: "running",
    });

    const runStartTime = Date.now();

    // 4) Run submission via action
    try {
      const status: "passed" | "failed" | "error" = await ctx.runAction(internal.execution.runSubmission, {
        submissionId,
      });

      // Log successful execution
      const submission = await ctx.runQuery(internal.execution.getSubmissionById, {
        submissionId,
      });

      if (submission?.result) {
        const testsFailedCount = calculateFailedTestsCount(submission.result);

        await logExecution(ctx, {
          userId: user._id,
          kind: "challenge",
          itemId: args.itemId,
          submissionId,
          startedAt: runStartTime,
          finishedAt: Date.now(),
          status,
          timingMs: submission.result.timingMs || 0,
          compileOk: submission.result.compile.ok,
          testsPassed: status === "passed",
          ...(testsFailedCount > 0 ? { testsFailedCount } : {}),
        });
      }

      return { submissionId, status, quotaInfo: quotaResult.quotaInfo };
    } catch (error) {
      // If runner fails, mark as error with error message
      const errorMessage = error instanceof Error ? error.message : "Runner error";
      await ctx.runMutation(internal.execution.patchSubmissionResult, {
        submissionId,
        status: "error",
        result: {
          passed: false,
          compile: { ok: false, stderr: errorMessage },
          tests: [],
          stderr: errorMessage,
          timingMs: 0,
        },
      });

      // Log error execution
      await logExecution(ctx, {
        userId: user._id,
        kind: "challenge",
        itemId: args.itemId,
        submissionId,
        startedAt: runStartTime,
        finishedAt: Date.now(),
        status: "error",
        timingMs: 0,
        compileOk: false,
        errorMessage,
      });

      return { submissionId, status: "error" };
    }
  },
});

export const createSubmissionInternal = internalMutation({
  args: { itemId: v.id("curriculumItems"), code: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkUserId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    if (item.kind !== "challenge") {
      throw new Error("Item is not a challenge");
    }

    const now = Date.now();

    const submissionId = await ctx.db.insert("submissions", {
      userId: user._id,
      itemId: args.itemId,
      kind: "challenge",
      code: args.code,
      status: "queued",
      createdAt: now,
    });

    // Update progress to in_progress if needed
    const existingProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (!existingProgress || existingProgress.status === "not_started") {
      if (existingProgress) {
        await ctx.db.patch(existingProgress._id, {
          status: "in_progress",
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("progress", {
          userId: user._id,
          itemId: args.itemId,
          status: "in_progress",
          updatedAt: now,
        });
      }
    }

    return submissionId;
  },
});

// Internal mutation to create execution log entry
export const createExecutionLog = internalMutation({
  args: {
    userId: v.id("users"),
    kind: v.union(v.literal("challenge"), v.literal("project")),
    itemId: v.optional(v.id("curriculumItems")),
    projectId: v.optional(v.id("projects")),
    submissionId: v.optional(v.id("submissions")),
    startedAt: v.number(),
    finishedAt: v.number(),
    status: v.union(
      v.literal("passed"),
      v.literal("failed"),
      v.literal("error"),
      v.literal("rate_limited"),
      v.literal("quota_exceeded")
    ),
    timingMs: v.number(),
    compileOk: v.boolean(),
    testsPassed: v.optional(v.boolean()),
    testsFailedCount: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("executionLogs", args);
  },
});

// Internal mutation for checking run tests rate limit from actions
export const checkRunTestsRateLimitInternal = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { checkRunTestsRateLimit } = await import("./lib/rateLimit");
    return await checkRunTestsRateLimit(ctx, args.userId);
  },
});

// Internal mutation for checking and incrementing daily runs from actions
export const checkAndIncrementDailyRunsInternal = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { checkAndIncrementDailyRuns } = await import("./lib/quota");
    return await checkAndIncrementDailyRuns(ctx, args.userId);
  },
});
