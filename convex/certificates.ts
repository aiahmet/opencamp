import { v } from "convex/values";
import { query, action, mutation } from "./_generated/server";
import { requireIdentity } from "./lib/auth";
import { generateCertificateCode } from "./lib/identifiers";
import { api } from "./_generated/api";

export const listMyCertificates = query({
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

    const certificates = await ctx.db
      .query("certificates")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const result = await Promise.all(
      certificates.map(async (cert) => {
        const track = await ctx.db.get(cert.trackId);
        const language = track ? await ctx.db.get(track.languageId) : null;
        return {
          _id: cert._id,
          code: cert.code,
          trackId: cert.trackId,
          trackTitle: track?.title || "Unknown",
          trackSlug: track?.slug || "",
          languageName: language?.name || "Unknown",
          languageSlug: language?.slug || "",
          issuedAt: cert.issuedAt,
        };
      })
    );

    return result.sort((a, b) => b.issuedAt - a.issuedAt);
  },
});

export const verifyCertificate = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const certificate = await ctx.db
      .query("certificates")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (!certificate || certificate.revokedAt) {
      return { valid: false };
    }

    const track = await ctx.db.get(certificate.trackId);
    const language = track ? await ctx.db.get(track.languageId) : null;
    const user = await ctx.db.get(certificate.userId);

    return {
      valid: true,
      code: certificate.code,
      issuedAt: certificate.issuedAt,
      track: {
        title: track?.title || "Unknown",
        slug: track?.slug || "",
      },
      language: {
        name: language?.name || "Unknown",
        slug: language?.slug || "",
      },
      holder: {
        username: user?.username,
      },
    };
  },
});

export const issueCertificateForTrack = action({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const user = await ctx.runQuery(api.users.currentUser);

    if (!user) {
      throw new Error("User not found");
    }

    const progress = await ctx.runQuery(api.completion.getTrackProgress, {
      trackId: args.trackId,
    });

    if (!progress || !progress.isCompleted) {
      throw new Error("Track is not completed yet");
    }

    const existingCertificate = await ctx.runQuery(api.certificates.getCertificateForUserTrack, {
      trackId: args.trackId,
    });

    if (existingCertificate) {
      throw new Error("Certificate already issued for this track");
    }

    const code = await generateCertificateCode();

    await ctx.runMutation(api.certificates.finalizeIssueCertificate, {
      trackId: args.trackId,
      code,
    });

    return code;
  },
});

export const getCertificateForUserTrack = query({
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

    const certificate = await ctx.db
      .query("certificates")
      .withIndex("by_user_track", (q) =>
        q.eq("userId", user._id).eq("trackId", args.trackId)
      )
      .first();

    return certificate;
  },
});

export const finalizeIssueCertificate = mutation({
  args: { trackId: v.id("tracks"), code: v.string() },
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

    const isCompleted = totalItems > 0 && completedItems === totalItems;

    if (!isCompleted) {
      throw new Error("Track is not completed yet");
    }

    const existingCertificate = await ctx.db
      .query("certificates")
      .withIndex("by_user_track", (q) =>
        q.eq("userId", user._id).eq("trackId", args.trackId)
      )
      .first();

    if (existingCertificate) {
      throw new Error("Certificate already issued for this track");
    }

    await ctx.db.insert("certificates", {
      userId: user._id,
      trackId: args.trackId,
      code: args.code,
      issuedAt: Date.now(),
    });

    return { success: true };
  },
});
