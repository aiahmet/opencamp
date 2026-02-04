import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireIdentity, hasRole } from "./lib/auth";

export const listVersionsForItem = query({
  args: {
    itemId: v.id("curriculumItems"),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const clerkUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const hasContributorRole = hasRole(user, "contributor") ||
                               hasRole(user, "reviewer") ||
                               hasRole(user, "maintainer");

    if (!hasContributorRole) {
      throw new Error("Not authorized to view version history");
    }

    const versions = await ctx.db
      .query("contentVersions")
      .withIndex("by_item_createdAt", (q) => q.eq("itemId", args.itemId))
      .collect();

    const versionsWithDetails = await Promise.all(
      versions.map(async (version) => {
        const createdBy = await ctx.db.get(version.createdById);
        const sourceContribution = version.sourceContributionId
          ? await ctx.db.get(version.sourceContributionId)
          : null;
        return {
          ...version,
          createdBy,
          sourceContribution,
        };
      })
    );

    return versionsWithDetails.sort((a, b) => b.version - a.version);
  },
});

export const getVersion = query({
  args: {
    itemId: v.id("curriculumItems"),
    version: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const clerkUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const hasContributorRole = hasRole(user, "contributor") ||
                               hasRole(user, "reviewer") ||
                               hasRole(user, "maintainer");

    if (!hasContributorRole) {
      throw new Error("Not authorized to view version history");
    }

    const version = await ctx.db
      .query("contentVersions")
      .withIndex("by_item_version", (q) =>
        q.eq("itemId", args.itemId).eq("version", args.version)
      )
      .first();

    if (!version) {
      throw new Error("Version not found");
    }

    const createdBy = await ctx.db.get(version.createdById);
    const sourceContribution = version.sourceContributionId
      ? await ctx.db.get(version.sourceContributionId)
      : null;

    return {
      ...version,
      createdBy,
      sourceContribution,
    };
  },
});
