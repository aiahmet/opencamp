import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireIdentity } from "./lib/auth";
import { internal } from "./_generated/api";

export const getProgressForItems = query({
  args: { itemIds: v.array(v.id("curriculumItems")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return args.itemIds.map((itemId) => ({
        itemId,
        status: "not_started" as const,
        updatedAt: null as number | null,
      }));
    }

    const clerkUserId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      return args.itemIds.map((itemId) => ({
        itemId,
        status: "not_started" as const,
        updatedAt: null as number | null,
      }));
    }

    const progressMap = new Map<
      string,
      { status: string; updatedAt: number }
    >();

    // Batch fetch all progress records for this user
    // Note: This is more efficient but may fetch extra records
    // If the number of items is small, this is acceptable
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_item", (q) => q.eq("userId", user._id))
      .collect();

    // Create a map of itemId to progress for quick lookup
    const progressByItemId = new Map(
      allProgress.map((p) => [p.itemId.toString(), p])
    );

    // Build the result using the map
    for (const itemId of args.itemIds) {
      const progress = progressByItemId.get(itemId.toString());
      if (progress) {
        progressMap.set(itemId, {
          status: progress.status,
          updatedAt: progress.updatedAt,
        });
      }
    }

    return args.itemIds.map((itemId) => {
      const progress = progressMap.get(itemId);
      return {
        itemId,
        status: (progress?.status as "not_started" | "in_progress" | "completed") || "not_started",
        updatedAt: progress?.updatedAt ?? null,
      };
    });
  },
});

export const markCompleted = mutation({
  args: { itemId: v.id("curriculumItems") },
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
      .query("progress")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (existingProgress) {
      await ctx.db.patch(existingProgress._id, {
        status: "completed",
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("progress", {
        userId: user._id,
        itemId: args.itemId,
        status: "completed",
        updatedAt: now,
      });
    }

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      return;
    }

    const itemModule = await ctx.db.get(item.moduleId);
    if (!itemModule) {
      return;
    }

    await ctx.runMutation(internal.completion.recomputeTrackCompletion, {
      trackId: itemModule.trackId,
      userId: user._id,
    });
  },
});

export const markInProgress = mutation({
  args: { itemId: v.id("curriculumItems") },
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
      .query("progress")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (!existingProgress) {
      await ctx.db.insert("progress", {
        userId: user._id,
        itemId: args.itemId,
        status: "in_progress",
        updatedAt: now,
      });
    } else if (existingProgress.status === "not_started") {
      await ctx.db.patch(existingProgress._id, {
        status: "in_progress",
        updatedAt: now,
      });
    }
  },
});
