import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const vote = mutation({
  args: {
    commentId: v.id("comments"),
    value: v.union(v.literal(-1), v.literal(1)),
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

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_comment", (q) =>
        q.eq("userId", user._id).eq("commentId", args.commentId)
      )
      .first();

    if (existingVote) {
      if (existingVote.value === args.value) {
        await ctx.db.delete(existingVote._id);
        return { value: 0 };
      } else {
        await ctx.db.patch(existingVote._id, { value: args.value });
        return { value: args.value };
      }
    }

    await ctx.db.insert("votes", {
      userId: user._id,
      commentId: args.commentId,
      value: args.value,
      createdAt: Date.now(),
    });

    return { value: args.value };
  },
});

export const getMyVote = query({
  args: {
    commentId: v.id("comments"),
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
      return null;
    }

    const vote = await ctx.db
      .query("votes")
      .withIndex("by_user_comment", (q) =>
        q.eq("userId", user._id).eq("commentId", args.commentId)
      )
      .first();

    return vote ? vote.value : 0;
  },
});
