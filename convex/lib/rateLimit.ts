import { LIMITS, throwFriendly } from "./limits";
import { GenericId } from "convex/values";
import { GenericMutationCtx } from "convex/server";
import { DataModel } from "../_generated/dataModel";

// Rate limiting context - only works in mutations
export async function checkAndIncrement(
  ctx: GenericMutationCtx<DataModel>,
  userId: string,
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: true }> {
  const now = Date.now();
  const windowStart = now - windowMs;

  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_user_key", (q) => q.eq("userId", userId as GenericId<"users">).eq("key", key))
    .first();

  if (existing) {
    if (existing.windowStart < windowStart) {
      // Window expired, reset
      await ctx.db.patch(existing._id, {
        windowStart: now,
        count: 1,
      });
      return { ok: true };
    }

    if (existing.count >= limit) {
      // Rate limit exceeded
      const retryAfterMs = existing.windowStart + windowMs - now;
      throwFriendly("RATE_LIMITED", { retryAfterMs });
    }

    await ctx.db.patch(existing._id, {
      count: existing.count + 1,
    });
    return { ok: true };
  } else {
    await ctx.db.insert("rateLimits", {
      userId: userId as GenericId<"users">,
      key,
      windowStart: now,
      count: 1,
    });
    return { ok: true };
  }
}

// Convenience function for run tests rate limiting
export async function checkRunTestsRateLimit(
  ctx: GenericMutationCtx<DataModel>,
  userId: string
): Promise<{ ok: true }> {
  return checkAndIncrement(ctx, userId, "run_tests", LIMITS.perMinuteRunLimit, 60000);
}
