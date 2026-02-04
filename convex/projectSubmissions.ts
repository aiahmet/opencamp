import { v } from "convex/values";
import { action, internalMutation, query } from "./_generated/server";
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

export const listProjectSubmissions = query({
  args: {
    projectId: v.id("projects"),
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

    // Get all submissions for this user
    const allSubmissions = await ctx.db
      .query("submissions")
      .withIndex("by_user_item_created", (q) =>
        q.eq("userId", user._id)
      )
      .order("desc")
      .take(100); // Get more to filter

    // Filter by project kind and projectId
    const projectSubmissions = allSubmissions
      .filter((s) => s.kind === "project" && s.projectId === args.projectId)
      .slice(0, limit);

    return projectSubmissions;
  },
});

export const createAndRunProjectSubmission = action({
  args: {
    projectId: v.id("projects"),
    files: v.array(
      v.object({
        path: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args): Promise<{ submissionId?: string; status?: string; quotaInfo?: { runsUsed: number; runsLimit: number; resetsAtMs: number }; blocked?: boolean; code?: string; retryAfterMs?: number; resetsAtMs?: number; message?: string }> => {
    const identity = await requireIdentity(ctx);
    const clerkUserId = identity.subject;

    // Get user first for limit checks
    const user = await ctx.runQuery(internal.users.getUserByClerkUserId, {
      clerkUserId,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();

    // Validate project exists
    const project = await ctx.runQuery(internal.execution.getProjectById, {
      projectId: args.projectId,
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // 1) Check rate limit using shared helper
    const rateLimitResult = await checkRateLimit(ctx, user._id);
    if (!rateLimitResult.success) {
      await logRateLimitedAttempt(ctx, user._id, "project", undefined, args.projectId, rateLimitResult.error);
      return createRateLimitedResponse(rateLimitResult.error);
    }

    // 2) Check daily quota using shared helper
    const quotaResult = await checkDailyQuota(ctx, user._id);
    if (!quotaResult.success) {
      await logQuotaExceededAttempt(ctx, user._id, "project", undefined, args.projectId, quotaResult.error);
      return createQuotaExceededResponse(quotaResult.error);
    }

    const submissionId: Id<"submissions"> = await ctx.runMutation(internal.projectSubmissions.insertProjectSubmission, {
      userId: user._id,
      projectId: args.projectId,
      files: args.files,
      createdAt: now,
    });

    // Update status to running
    await ctx.runMutation(internal.execution.patchSubmissionStatus, {
      submissionId,
      status: "running",
    });

    const runStartTime = Date.now();

    // Run submission via runner
    try {
      const status: "passed" | "failed" | "error" = await ctx.runAction(internal.execution.runProjectSubmission, {
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
          kind: "project",
          itemId: undefined,
          projectId: args.projectId,
          submissionId,
          startedAt: runStartTime,
          finishedAt: Date.now(),
          status,
          timingMs: submission.result.timingMs || 0,
          compileOk: submission.result.compile.ok,
          testsPassed: status === "passed",
          testsFailedCount: testsFailedCount > 0 ? testsFailedCount : undefined,
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
        kind: "project",
        itemId: undefined,
        projectId: args.projectId,
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

export const insertProjectSubmission = internalMutation({
  args: {
    userId: v.id("users"),
    projectId: v.id("projects"),
    files: v.array(
      v.object({
        path: v.string(),
        content: v.string(),
      })
    ),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("submissions", {
      userId: args.userId,
      kind: "project",
      projectId: args.projectId,
      code: "", // Empty for projects
      files: args.files,
      status: "queued",
      createdAt: args.createdAt,
    });
  },
});
