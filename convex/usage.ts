import { query } from "./_generated/server";
import { requireIdentity } from "./lib/auth";
import { getDailyUsageFromQuery } from "./lib/quota";
import { LIMITS, getTodayBerlin } from "./lib/limits";

export const getMyUsage = query({
  args: {},
  handler: async (ctx) => {
    await requireIdentity(ctx);

    const clerkUserId = (await ctx.auth.getUserIdentity())!.subject;
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
