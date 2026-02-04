import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { ExecutionLimitError } from "./limits";
import { Id } from "../_generated/dataModel";

// Shared execution log arguments value type
export type ExecutionLogArgs = {
  userId: Id<"users">;
  kind: "challenge" | "project";
  itemId?: Id<"curriculumItems">;
  projectId?: Id<"projects">;
  submissionId?: Id<"submissions">;
  startedAt: number;
  finishedAt: number;
  status: "passed" | "failed" | "error" | "rate_limited" | "quota_exceeded";
  timingMs: number;
  compileOk: boolean;
  testsPassed?: boolean;
  testsFailedCount?: number;
  errorMessage?: string;
};

// Shared execution log arguments validator
export const executionLogArgs = {
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
};

// Result type for submission execution
export type SubmissionExecutionResult =
  | { submissionId: Id<"submissions">; status: string; quotaInfo: { runsUsed: number; runsLimit: number; resetsAtMs: number } }
  | { blocked: true; code: string; retryAfterMs?: number; resetsAtMs?: number; message: string };

// Rate limit check result
export interface RateLimitCheckResult {
  success: true;
}
export interface RateLimitBlockedResult {
  success: false;
  error: ExecutionLimitError;
}

// Check rate limit and return structured result
export async function checkRateLimit(
  ctx: { runMutation: (func: any, args: any) => Promise<any> },
  userId: Id<"users">
): Promise<RateLimitCheckResult | RateLimitBlockedResult> {
  try {
    const { internal } = await import("../_generated/api");
    await ctx.runMutation(internal.submissions.checkRunTestsRateLimitInternal, { userId });
    return { success: true };
  } catch (e) {
    if (e instanceof ExecutionLimitError) {
      return { success: false, error: e };
    }
    throw e;
  }
}

// Check daily quota and return structured result
export async function checkDailyQuota(
  ctx: { runMutation: (func: any, args: any) => Promise<any> },
  userId: Id<"users">
): Promise<{ success: true; quotaInfo: { runsUsed: number; runsLimit: number; resetsAtMs: number } } | RateLimitBlockedResult> {
  try {
    const { internal } = await import("../_generated/api");
    const quotaInfo = await ctx.runMutation(internal.submissions.checkAndIncrementDailyRunsInternal, { userId });
    return { success: true, quotaInfo };
  } catch (e) {
    if (e instanceof ExecutionLimitError) {
      return { success: false, error: e };
    }
    throw e;
  }
}

// Log execution - shared function
export async function logExecution(
  ctx: { runMutation: (func: any, args: any) => Promise<any> },
  logArgs: ExecutionLogArgs
): Promise<void> {
  const { internal } = await import("../_generated/api");
  await ctx.runMutation(internal.submissions.createExecutionLog, logArgs);
}

// Create rate limited response
export function createRateLimitedResponse(
  error: ExecutionLimitError
): { blocked: true; code: string; retryAfterMs: number; message: string } {
  return {
    blocked: true,
    code: error.code,
    retryAfterMs: error.details.retryAfterMs,
    message: error.message,
  };
}

// Create quota exceeded response
export function createQuotaExceededResponse(
  error: ExecutionLimitError
): { blocked: true; code: string; resetsAtMs: number; message: string } {
  return {
    blocked: true,
    code: error.code,
    resetsAtMs: error.details.resetsAtMs,
    message: error.message,
  };
}

// Calculate failed tests count from result
export function calculateFailedTestsCount(result: { tests?: Array<{ passed: boolean }> }): number {
  return result.tests ? result.tests.filter((t) => !t.passed).length : 0;
}

// Log rate limited attempt
export async function logRateLimitedAttempt(
  ctx: { runMutation: (func: any, args: any) => Promise<any> },
  userId: Id<"users">,
  kind: "challenge" | "project",
  itemId: Id<"curriculumItems"> | undefined,
  projectId: Id<"projects"> | undefined,
  error: ExecutionLimitError
): Promise<void> {
  await logExecution(ctx, {
    userId,
    kind,
    itemId,
    projectId,
    submissionId: undefined,
    startedAt: Date.now(),
    finishedAt: Date.now(),
    status: "rate_limited",
    timingMs: 0,
    compileOk: false,
    errorMessage: error.message,
  });
}

// Log quota exceeded attempt
export async function logQuotaExceededAttempt(
  ctx: { runMutation: (func: any, args: any) => Promise<any> },
  userId: Id<"users">,
  kind: "challenge" | "project",
  itemId: Id<"curriculumItems"> | undefined,
  projectId: Id<"projects"> | undefined,
  error: ExecutionLimitError
): Promise<void> {
  await logExecution(ctx, {
    userId,
    kind,
    itemId,
    projectId,
    submissionId: undefined,
    startedAt: Date.now(),
    finishedAt: Date.now(),
    status: "quota_exceeded",
    timingMs: 0,
    compileOk: false,
    errorMessage: error.message,
  });
}
