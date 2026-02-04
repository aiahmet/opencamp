import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

export const getTrackProgress = query({
  args: { trackId: v.id("tracks") },
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

    const modules = await ctx.db
      .query("modules")
      .withIndex("by_track_order", (q) => q.eq("trackId", args.trackId))
      .collect();

    let totalItems = 0;
    const itemIds: string[] = [];

    for (const moduleData of modules) {
      const items = await ctx.db
        .query("curriculumItems")
        .withIndex("by_module_order", (q) => q.eq("moduleId", moduleData._id))
        .collect();
      totalItems += items.length;
      itemIds.push(...items.map((item) => item._id));
    }

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user_item", (q) => q.eq("userId", user._id))
      .collect();

    const completedItems = progress.filter(
      (p) => itemIds.includes(p.itemId) && p.status === "completed"
    ).length;

    const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const isCompleted = totalItems > 0 && completedItems === totalItems;

    return {
      total: totalItems,
      completed: completedItems,
      percent,
      isCompleted,
    };
  },
});

export const recomputeTrackCompletion = internalMutation({
  args: { trackId: v.id("tracks"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const modules = await ctx.db
      .query("modules")
      .withIndex("by_track_order", (q) => q.eq("trackId", args.trackId))
      .collect();

    let totalItems = 0;
    const itemIds: string[] = [];

    for (const moduleData of modules) {
      const items = await ctx.db
        .query("curriculumItems")
        .withIndex("by_module_order", (q) => q.eq("moduleId", moduleData._id))
        .collect();
      totalItems += items.length;
      itemIds.push(...items.map((item) => item._id));
    }

    if (totalItems === 0) {
      return { total: 0, completed: 0, percent: 0, isCompleted: false };
    }

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user_item", (q) => q.eq("userId", args.userId))
      .collect();

    const completedItems = progress.filter(
      (p) => itemIds.includes(p.itemId) && p.status === "completed"
    ).length;

    const percent = Math.round((completedItems / totalItems) * 100);
    const isCompleted = completedItems === totalItems;

    const existingCompletion = await ctx.db
      .query("trackCompletions")
      .withIndex("by_user_track", (q) =>
        q.eq("userId", args.userId).eq("trackId", args.trackId)
      )
      .first();

    if (isCompleted) {
      if (!existingCompletion) {
        await ctx.db.insert("trackCompletions", {
          userId: args.userId,
          trackId: args.trackId,
          completedAt: Date.now(),
        });
      }
    } else {
      if (existingCompletion) {
        await ctx.db.delete(existingCompletion._id);
      }
    }

    return {
      total: totalItems,
      completed: completedItems,
      percent,
      isCompleted,
    };
  },
});

export const listMyCompletedTracks = query({
  handler: async (ctx) => {
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

    const completions = await ctx.db
      .query("trackCompletions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const tracks = await Promise.all(
      completions.map(async (completion) => {
        const track = await ctx.db.get(completion.trackId);
        const language = track ? await ctx.db.get(track.languageId) : null;
        return {
          trackId: completion.trackId,
          trackTitle: track?.title || "Unknown",
          trackSlug: track?.slug || "",
          languageSlug: language?.slug || "",
          languageName: language?.name || "Unknown",
          completedAt: completion.completedAt,
        };
      })
    );

    return tracks.sort((a, b) => b.completedAt - a.completedAt);
  },
});
