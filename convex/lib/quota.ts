import { LIMITS, getTodayBerlin, getNextMidnightBerlinMs, throwFriendly } from "./limits";
import { GenericId } from "convex/values";
import { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";

export async function checkAndIncrementDailyRuns(
  ctx: GenericMutationCtx<DataModel>,
  userId: string
): Promise<{ runsUsed: number; runsLimit: number; resetsAtMs: number }> {
  const day = getTodayBerlin();
  const now = Date.now();

  const existing = await ctx.db
    .query("usageCounters")
    .withIndex("by_user_day", (q) => q.eq("userId", userId as GenericId<"users">).eq("day", day))
    .first();

  if (existing) {
    if (existing.runs >= LIMITS.dailyRunLimit) {
      // Quota exceeded
      throwFriendly({
        code: "QUOTA_EXCEEDED",
        resetsAtMs: getNextMidnightBerlinMs()
      });
    }

    await ctx.db.patch(existing._id, {
      runs: existing.runs + 1,
      updatedAt: now,
    });

    return {
      runsUsed: existing.runs + 1,
      runsLimit: LIMITS.dailyRunLimit,
      resetsAtMs: getNextMidnightBerlinMs(),
    };
  } else {
    // First run of the day
    await ctx.db.insert("usageCounters", {
      userId: userId as GenericId<"users">,
      day,
      runs: 1,
      updatedAt: now,
    });

    return {
      runsUsed: 1,
      runsLimit: LIMITS.dailyRunLimit,
      resetsAtMs: getNextMidnightBerlinMs(),
    };
  }
}

// Export a query-safe version that doesn't require mutation context
// Query-compatible version of getDailyUsage
export async function getDailyUsageFromQuery(
  ctx: GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>,
  userId: string
): Promise<{ runsUsed: number; runsLimit: number; resetsAtMs: number }> {
  const day = getTodayBerlin();

  const existing = await ctx.db
    .query("usageCounters")
    .withIndex("by_user_day", (q) => q.eq("userId", userId as GenericId<"users">).eq("day", day))
    .first();

  return {
    runsUsed: existing?.runs || 0,
    runsLimit: LIMITS.dailyRunLimit,
    resetsAtMs: getNextMidnightBerlinMs(),
  };
}

// Mutation-only version of getDailyUsage
export async function getDailyUsage(
  ctx: GenericMutationCtx<DataModel>,
  userId: string
): Promise<{ runsUsed: number; runsLimit: number; resetsAtMs: number }> {
  return getDailyUsageFromQuery(ctx, userId);
}
