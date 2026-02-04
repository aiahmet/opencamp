import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";

export const currentUser = query({
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

    return user;
  },
});

export const ensureUser = internalMutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const clerkUserId = identity.subject;
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      const newUserId = await ctx.db.insert("users", {
        clerkUserId,
        email: identity.email,
        username: identity.email?.split("@")[0],
        name: identity.name,
        imageUrl: identity.pictureUrl,
        roles: ["learner"],
        createdAt: Date.now(),
      });
      user = await ctx.db.get(newUserId);
    }

    return user;
  },
});

export const syncUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
      });
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      username: args.email?.split("@")[0],
      roles: ["learner"],
      createdAt: Date.now(),
    });
    return userId;
  },
});

export const getUserByClerkUserId = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();
  },
});

export const deleteUser = mutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
      .first();

    if (!user) {
      return; // User already deleted or doesn't exist
    }

    // Delete all related data in order of dependencies
    // 1. Delete votes (references comments)
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_user_comment", (q) => q.eq("userId", user._id))
      .collect();
    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    // 2. Delete comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_author_updated", (q) => q.eq("authorId", user._id))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // 3. Delete discussions and related moderation events
    const discussions = await ctx.db
      .query("discussions")
      .withIndex("by_author_updated", (q) => q.eq("authorId", user._id))
      .collect();
    for (const discussion of discussions) {
      // Delete moderation events for this discussion
      const moderationEvents = await ctx.db
        .query("moderationEvents")
        .withIndex("by_discussion_created", (q) => q.eq("discussionId", discussion._id))
        .collect();
      for (const event of moderationEvents) {
        await ctx.db.delete(event._id);
      }
      await ctx.db.delete(discussion._id);
    }

    // 4. Delete moderation events where user is actor
    const userModerationEvents = await ctx.db
      .query("moderationEvents")
      .collect();
    for (const event of userModerationEvents) {
      if (event.actorId === user._id) {
        await ctx.db.delete(event._id);
      }
    }

    // 5. Delete submissions
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_user_item_created", (q) => q.eq("userId", user._id))
      .collect();
    for (const submission of submissions) {
      await ctx.db.delete(submission._id);
    }

    // 6. Delete execution logs
    const executionLogs = await ctx.db
      .query("executionLogs")
      .withIndex("by_user_startedAt", (q) => q.eq("userId", user._id))
      .collect();
    for (const log of executionLogs) {
      await ctx.db.delete(log._id);
    }

    // 7. Delete progress
    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user_item", (q) => q.eq("userId", user._id))
      .collect();
    for (const p of progress) {
      await ctx.db.delete(p._id);
    }

    // 8. Delete drafts
    const drafts = await ctx.db
      .query("drafts")
      .withIndex("by_user_item", (q) => q.eq("userId", user._id))
      .collect();
    for (const draft of drafts) {
      await ctx.db.delete(draft._id);
    }

    // 9. Delete project workspaces
    const projectWorkspaces = await ctx.db
      .query("projectWorkspaces")
      .withIndex("by_user_project", (q) => q.eq("userId", user._id))
      .collect();
    for (const workspace of projectWorkspaces) {
      await ctx.db.delete(workspace._id);
    }

    // 10. Delete project progress
    const projectProgress = await ctx.db
      .query("projectProgress")
      .withIndex("by_user_project", (q) => q.eq("userId", user._id))
      .collect();
    for (const pp of projectProgress) {
      await ctx.db.delete(pp._id);
    }

    // 11. Delete track completions
    const trackCompletions = await ctx.db
      .query("trackCompletions")
      .withIndex("by_user_track", (q) => q.eq("userId", user._id))
      .collect();
    for (const completion of trackCompletions) {
      await ctx.db.delete(completion._id);
    }

    // 12. Delete certificates
    const certificates = await ctx.db
      .query("certificates")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    for (const certificate of certificates) {
      await ctx.db.delete(certificate._id);
    }

    // 13. Delete contributions
    const contributions = await ctx.db
      .query("contributions")
      .withIndex("by_author_status", (q) => q.eq("authorId", user._id))
      .collect();
    for (const contribution of contributions) {
      await ctx.db.delete(contribution._id);
    }

    // 14. Delete usage counters
    const usageCounters = await ctx.db
      .query("usageCounters")
      .withIndex("by_user_day", (q) => q.eq("userId", user._id))
      .collect();
    for (const counter of usageCounters) {
      await ctx.db.delete(counter._id);
    }

    // 15. Delete rate limits
    const rateLimits = await ctx.db
      .query("rateLimits")
      .withIndex("by_user_key", (q) => q.eq("userId", user._id))
      .collect();
    for (const rateLimit of rateLimits) {
      await ctx.db.delete(rateLimit._id);
    }

    // Finally delete the user
    await ctx.db.delete(user._id);
  },
});

