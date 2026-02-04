import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { checkAndIncrement } from "./lib/rateLimit";

export const listComments = query({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkUserId = identity.subject;
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_discussion_created", (q) => q.eq("discussionId", args.discussionId))
      .order("asc")
      .take(200);

    const enriched = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        const votes = await ctx.db
          .query("votes")
          .withIndex("by_comment", (q) => q.eq("commentId", comment._id))
          .collect();

         const voteSum = votes.reduce((sum, vote) => sum + vote.value, 0);
         const currentUserVote = currentUser
           ? votes.find((v) => v.userId === currentUser._id)?.value || 0
           : 0;

        return {
          ...comment,
          authorUsername: author?.username || `user-${comment.authorId.slice(-8)}`,
          voteSum,
          currentUserVote,
        };
      })
    );

    return enriched;
  },
});

export const createComment = mutation({
  args: {
    discussionId: v.id("discussions"),
    parentCommentId: v.optional(v.id("comments")),
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

    await checkAndIncrement(ctx, user._id, "create_comment", 20, 10 * 60 * 1000);

    const discussion = await ctx.db.get(args.discussionId);
    if (!discussion) {
      throw new Error("Discussion not found");
    }

    if (discussion.locked) {
      throw new Error("This thread is locked and cannot accept new comments");
    }

    if (args.parentCommentId) {
      const parentComment = await ctx.db.get(args.parentCommentId);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }

      if (parentComment.discussionId !== args.discussionId) {
        throw new Error("Parent comment does not belong to this discussion");
      }

      if (parentComment.parentCommentId) {
        throw new Error("Nested replies are limited to one level");
      }
    }

    if (args.body.length < 1 || args.body.length > 5000) {
      throw new Error("Comment must be between 1 and 5000 characters");
    }

    const now = Date.now();
    await ctx.db.insert("comments", {
      discussionId: args.discussionId,
      authorId: user._id,
      ...(args.parentCommentId !== undefined ? { parentCommentId: args.parentCommentId } : {}),
      body: args.body,
      removed: false,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(args.discussionId, {
      updatedAt: now,
    });

    return { success: true };
  },
});

export const removeComment = mutation({
  args: {
    commentId: v.id("comments"),
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

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    await ctx.db.patch(args.commentId, {
      removed: true,
      body: "(removed)",
      updatedAt: Date.now(),
    });

    await ctx.db.insert("moderationEvents", {
      actorId: user._id,
      action: "remove_comment",
      discussionId: comment.discussionId,
      commentId: args.commentId,
      ...(args.reason !== undefined ? { reason: args.reason } : {}),
      createdAt: Date.now(),
    });
  },
});

export const restoreComment = mutation({
  args: {
    commentId: v.id("comments"),
    body: v.string(),
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

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (args.body.length < 1 || args.body.length > 5000) {
      throw new Error("Comment must be between 1 and 5000 characters");
    }

    await ctx.db.patch(args.commentId, {
      removed: false,
      body: args.body,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("moderationEvents", {
      actorId: user._id,
      action: "restore_comment",
      discussionId: comment.discussionId,
      commentId: args.commentId,
      ...(args.reason !== undefined ? { reason: args.reason } : {}),
      createdAt: Date.now(),
    });
  },
});
