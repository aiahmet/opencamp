import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireIdentity } from "./lib/auth";

export const getMyProjectProgress = query({
  args: { projectIds: v.array(v.id("projects")) },
  handler: async (ctx, args) => {
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
      return null;
    }

    const progress = await Promise.all(
      args.projectIds.map(async (projectId) => {
        const progressEntry = await ctx.db
          .query("projectProgress")
          .withIndex("by_user_project", (q) =>
            q.eq("userId", user._id).eq("projectId", projectId)
          )
          .first();

        return {
          projectId,
          status: progressEntry?.status || "not_started",
          updatedAt: progressEntry?.updatedAt,
        };
      })
    );

    return progress;
  },
});

export const markProjectCompleted = mutation({
  args: { projectId: v.id("projects") },
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

    const now = Date.now();

    const existingProgress = await ctx.db
      .query("projectProgress")
      .withIndex("by_user_project", (q) =>
        q.eq("userId", user._id).eq("projectId", args.projectId)
      )
      .first();

    if (existingProgress) {
      await ctx.db.patch(existingProgress._id, {
        status: "completed",
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("projectProgress", {
        userId: user._id,
        projectId: args.projectId,
        status: "completed",
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

export const markProjectInProgress = mutation({
  args: { projectId: v.id("projects") },
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

    const now = Date.now();

    const existingProgress = await ctx.db
      .query("projectProgress")
      .withIndex("by_user_project", (q) =>
        q.eq("userId", user._id).eq("projectId", args.projectId)
      )
      .first();

    if (existingProgress) {
      await ctx.db.patch(existingProgress._id, {
        status: "in_progress",
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("projectProgress", {
        userId: user._id,
        projectId: args.projectId,
        status: "in_progress",
        updatedAt: now,
      });
    }

    return { success: true };
  },
});
