import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireRole } from "./lib/auth";

export const listRecentExecutionLogs = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("passed"),
      v.literal("failed"),
      v.literal("error"),
      v.literal("rate_limited"),
      v.literal("quota_exceeded")
    )),
    kind: v.optional(v.union(v.literal("challenge"), v.literal("project"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const clerkUserId = identity?.subject ?? "";
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Require maintainer role
    requireRole(user, "maintainer");

    const limit = args.limit ?? 100;

    let logs;
    if (args.status) {
      // Filter by status using a filter - Convex doesn't support index range queries on multiple fields easily
      logs = await ctx.db
        .query("executionLogs")
        .withIndex("by_startedAt")
        .order("desc")
        .take(limit * 2); // Fetch more to filter
      
      logs = logs.filter((log) => log.status === args.status);
      logs = logs.slice(0, limit);
    } else if (args.kind) {
      logs = await ctx.db
        .query("executionLogs")
        .withIndex("by_startedAt")
        .order("desc")
        .take(limit * 2);
      
      logs = logs.filter((log) => log.kind === args.kind);
      logs = logs.slice(0, limit);
    } else {
      logs = await ctx.db
        .query("executionLogs")
        .withIndex("by_startedAt")
        .order("desc")
        .take(limit);
    }

    // Enrich with user and item/project info
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
         const user = await ctx.db.get(log.userId);
        
        let itemTitle: string | undefined;
        let projectTitle: string | undefined;

        if (log.itemId) {
          const item = await ctx.db.get(log.itemId);
          itemTitle = item?.title;
        }

        if (log.projectId) {
          const project = await ctx.db.get(log.projectId);
          projectTitle = project?.title;
        }

        return {
          ...log,
          userHandle: user?.username ?? "unknown",
          itemTitle,
          projectTitle,
        };
      })
    );

    return enrichedLogs;
  },
});

export const getDailyUsageStats = query({
  args: {
    day: v.optional(v.string()), // YYYY-MM-DD, defaults to today
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const clerkUserId = identity?.subject ?? "";
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("Not authenticated");
    }

    requireRole(user, "maintainer");

    const targetDay = args.day ?? new Date().toISOString().split("T")[0];

    const counters = await ctx.db
      .query("usageCounters")
      .filter((q) => q.eq(q.field("day"), targetDay))
      .collect();

    const totalRuns = counters.reduce((sum, c) => sum + c.runs, 0);
    const activeUsers = counters.length;

    // Find users who hit the limit
    const limitHitters = counters
      .filter((c) => c.runs >= 50) // Using default limit
      .map((c) => ({ userId: c.userId, runs: c.runs }));

    return {
      day: targetDay,
      totalRuns,
      activeUsers,
      limitHitters,
    };
  },
});
