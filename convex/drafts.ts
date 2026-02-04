import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireIdentity } from "./lib/auth";

export const getDraft = query({
  args: { itemId: v.id("curriculumItems") },
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

    const draft = await ctx.db
      .query("drafts")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    return draft;
  },
});

export const upsertDraft = mutation({
  args: { itemId: v.id("curriculumItems"), code: v.string() },
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

    const existingDraft = await ctx.db
      .query("drafts")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    const now = Date.now();

    if (existingDraft) {
      await ctx.db.patch(existingDraft._id, {
        code: args.code,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("drafts", {
        userId: user._id,
        itemId: args.itemId,
        code: args.code,
        updatedAt: now,
      });
    }

    const existingProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (!existingProgress || existingProgress.status === "not_started") {
      if (existingProgress) {
        await ctx.db.patch(existingProgress._id, {
          status: "in_progress",
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("progress", {
          userId: user._id,
          itemId: args.itemId,
          status: "in_progress",
          updatedAt: now,
        });
      }
    }
  },
});

export const deleteDraft = mutation({
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

    const draft = await ctx.db
      .query("drafts")
      .withIndex("by_user_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (draft) {
      await ctx.db.delete(draft._id);
    }
  },
});
