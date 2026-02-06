import { query } from "./_generated/server";
import { getDailyUsageFromQuery } from "./lib/quota";
import { LIMITS, getTodayBerlin } from "./lib/limits";

export const getMyUsage = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const clerkUserId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Import and use the internal quota function that handles both query and mutation contexts
    const usage = await getDailyUsageFromQuery(ctx, user._id);

    return {
      day: getTodayBerlin(),
      runsUsed: usage.runsUsed,
      runsLimit: usage.runsLimit,
      resetsAtMs: usage.resetsAtMs,
      perMinuteLimit: LIMITS.perMinuteRunLimit,
    };
  },
});
