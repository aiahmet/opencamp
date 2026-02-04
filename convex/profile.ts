import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireIdentity } from "./lib/auth";
import { normalizeHandle, validateHandle } from "./lib/identifiers";
import { checkHandleUnique } from "./lib/validation";

export const myProfile = query({
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

    if (!user) {
      return null;
    }

    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_user_item", (q) => q.eq("userId", user._id))
      .collect();

    const completedItemsCount = allProgress.filter((p) => p.status === "completed").length;
    const inProgressItemsCount = allProgress.filter((p) => p.status === "in_progress").length;

    return {
      user: {
        _id: user._id,
        clerkUserId: user.clerkUserId,
        username: user.username,
      },
      stats: {
        completedItemsCount,
        inProgressItemsCount,
      },
    };
  },
});

export const setMyHandle = mutation({
  args: { handle: v.string() },
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

    const normalized = normalizeHandle(args.handle);
    validateHandle(normalized);

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", normalized))
      .first();

    checkHandleUnique(normalized, user._id, existingUser);

    await ctx.db.patch(user._id, {
      username: normalized,
    });

    return { success: true, handle: normalized };
  },
});

export const getPublicProfile = query({
  args: { handle: v.string() },
  handler: async (ctx, args) => {
    const normalized = normalizeHandle(args.handle);

    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", normalized))
      .first();

    if (!user) {
      return null;
    }

    const trackCompletions = await ctx.db
      .query("trackCompletions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completedTracks = await Promise.all(
      trackCompletions.map(async (completion) => {
        const track = await ctx.db.get(completion.trackId);
        return {
          trackId: completion.trackId,
          trackTitle: track?.title || "Unknown",
          trackSlug: track?.slug || "",
          languageSlug: track?.languageId,
          completedAt: completion.completedAt,
        };
      })
    );

    const certificates = await ctx.db
      .query("certificates")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const certificatesWithDetails = await Promise.all(
      certificates.map(async (cert) => {
        const track = await ctx.db.get(cert.trackId);
        return {
          code: cert.code,
          trackTitle: track?.title || "Unknown",
          trackSlug: track?.slug || "",
          issuedAt: cert.issuedAt,
        };
      })
    );

    return {
      user: {
        username: user.username,
      },
      completedTracks: completedTracks.sort((a, b) => b.completedAt - a.completedAt),
      certificates: certificatesWithDetails.sort((a, b) => b.issuedAt - a.issuedAt),
    };
  },
});
