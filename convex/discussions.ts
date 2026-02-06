import { v } from "convex/values";
import { query, mutation, internalQuery } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { checkAndIncrement } from "./lib/rateLimit";

export const getItemIdBySlug = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("curriculumItems")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    return item?._id ?? null;
  },
});

export const listDiscussionsByItemSlug = query({
  args: {
    itemSlug: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const item = await ctx.db
      .query("curriculumItems")
      .withIndex("by_slug", (q) => q.eq("slug", args.itemSlug))
      .first();

    if (!item) {
      return null;
    }

    const discussions = ctx.db
      .query("discussions")
      .withIndex("by_scope_updated", (q) =>
        q.eq("scopeType", "item").eq("scopeId", item._id)
      )
      .order("desc");

    const results = args.limit
      ? await discussions.take(args.limit)
      : await discussions.collect();

    const enriched = await Promise.all(
      results.map(async (discussion: Doc<"discussions">) => {
        const author = await ctx.db.get(discussion.authorId);
        return {
          ...discussion,
          authorUsername: author?.username || `user-${discussion.authorId.slice(-8)}`,
        };
      })
    );

    return {
      itemId: item._id,
      discussions: enriched,
    };
  },
});

export const createDiscussionForItemSlug = mutation({
  args: {
    itemSlug: v.string(),
    type: v.union(v.literal("help"), v.literal("showcase"), v.literal("general")),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkUserId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const item = await ctx.db
      .query("curriculumItems")
      .withIndex("by_slug", (q) => q.eq("slug", args.itemSlug))
      .first();

    if (!item) {
      throw new Error("Item not found");
    }

    await checkAndIncrement(ctx, user._id, "create_thread", 5, 10 * 60 * 1000);

    if (args.title.length < 3 || args.title.length > 200) {
      throw new Error("Title must be between 3 and 200 characters");
    }

    if (args.body.length < 10 || args.body.length > 10000) {
      throw new Error("Body must be between 10 and 10000 characters");
    }

    const now = Date.now();
    const discussionId = await ctx.db.insert("discussions", {
      authorId: user._id,
      scopeType: "item",
      scopeId: item._id,
      type: args.type,
      title: args.title,
      body: args.body,
      locked: false,
      pinned: false,
      createdAt: now,
      updatedAt: now,
    });

    return discussionId;
  },
});

export const listDiscussionsByScope = query({
  args: {
    scopeType: v.union(v.literal("global"), v.literal("track"), v.literal("module"), v.literal("item")),
    scopeId: v.union(v.id("tracks"), v.id("modules"), v.id("curriculumItems"), v.null()),
    type: v.optional(v.union(v.literal("help"), v.literal("showcase"), v.literal("general"))),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

     const baseDiscussions = ctx.db
       .query("discussions")
       .withIndex("by_scope_updated", (q) =>
         q.eq("scopeType", args.scopeType).eq("scopeId", args.scopeId)
       )
       .order("desc");

     const results = args.limit
       ? await baseDiscussions.take(args.limit)
       : await baseDiscussions.collect();

    const enriched = await Promise.all(
      results.map(async (discussion: Doc<"discussions">) => {
        const author = await ctx.db.get(discussion.authorId);
        return {
          ...discussion,
          authorUsername: author?.username || `user-${discussion.authorId.slice(-8)}`,
        };
      })
    );

    return enriched;
  },
});

export const getDiscussion = query({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    const author = await ctx.db.get(discussion.authorId);

    return {
      ...discussion,
      authorUsername: author?.username || `user-${discussion.authorId.slice(-8)}`,
    };
  },
});

export const createDiscussion = mutation({
  args: {
    scopeType: v.union(v.literal("global"), v.literal("track"), v.literal("module"), v.literal("item")),
    scopeId: v.union(v.id("tracks"), v.id("modules"), v.id("curriculumItems"), v.null()),
    type: v.union(v.literal("help"), v.literal("showcase"), v.literal("general")),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkUserId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await checkAndIncrement(ctx, user._id, "create_thread", 5, 10 * 60 * 1000);

    if (args.title.length < 3 || args.title.length > 200) {
      throw new Error("Title must be between 3 and 200 characters");
    }

    if (args.body.length < 10 || args.body.length > 10000) {
      throw new Error("Body must be between 10 and 10000 characters");
    }

    const now = Date.now();
    const discussionId = await ctx.db.insert("discussions", {
      authorId: user._id,
      scopeType: args.scopeType,
      scopeId: args.scopeId,
      type: args.type,
      title: args.title,
      body: args.body,
      locked: false,
      pinned: false,
      createdAt: now,
      updatedAt: now,
    });

    return discussionId;
  },
});

export const setThreadLocked = mutation({
  args: {
    discussionId: v.id("discussions"),
    locked: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkUserId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.roles.includes("reviewer") && !user.roles.includes("maintainer")) {
      throw new Error("Insufficient permissions");
    }

    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    await ctx.db.patch(args.discussionId, {
      locked: args.locked,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("moderationEvents", {
      actorId: user._id,
      action: args.locked ? "lock_thread" : "unlock_thread",
      discussionId: args.discussionId,
      ...(args.reason !== undefined ? { reason: args.reason } : {}),
      createdAt: Date.now(),
    });
  },
});

export const setAcceptedAnswer = mutation({
  args: {
    discussionId: v.id("discussions"),
    commentId: v.union(v.id("comments"), v.null()),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkUserId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    if (discussion.type !== "help") {
      throw new Error("Only help threads can have accepted answers");
    }

    const isAuthor = user._id === discussion.authorId;
    const isModerator = user.roles.includes("reviewer") || user.roles.includes("maintainer");

    if (!isAuthor && !isModerator) {
      throw new Error("Only the thread author or moderators can set accepted answers");
    }

    if (args.commentId) {
      const comment = await ctx.db.get(args.commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }

      if (comment.discussionId !== args.discussionId) {
        throw new Error("Comment does not belong to this discussion");
      }

      if (comment.removed) {
        throw new Error("Cannot accept a removed comment");
      }
    }

    await ctx.db.patch(args.discussionId, {
      acceptedCommentId: args.commentId === null ? undefined : args.commentId,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("moderationEvents", {
      actorId: user._id,
      action: args.commentId ? "set_accepted" : "unset_accepted",
      discussionId: args.discussionId,
      ...(args.commentId !== null && args.commentId !== undefined ? { commentId: args.commentId } : {}),
      ...(args.reason !== undefined ? { reason: args.reason } : {}),
      createdAt: Date.now(),
    });
  },
});
