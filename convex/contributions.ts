import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { requireIdentity, hasRole, requireRole } from "./lib/auth";

export const listMyContributions = query({
  args: {
    status: v.optional(v.string()),
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

    requireRole(user, "reviewer");

    const statuses = args.status || ["submitted", "changes_requested"];

    const allContributions = await ctx.db
      .query("contributions")
      .withIndex("by_status_updated", (q) =>
        q.eq("status", "submitted")
      )
      .collect();

    const filteredContributions = allContributions.filter(c =>
      statuses.includes(c.status)
    );

    const contributionsWithDetails = await Promise.all(
      filteredContributions.map(async (contribution) => {
        const item = await ctx.db.get(contribution.itemId);
        const itemModule = item ? await ctx.db.get(item.moduleId) : null;
        const track = itemModule ? await ctx.db.get(itemModule.trackId) : null;
        const language = item ? await ctx.db.get(item.languageId) : null;
        const author = await ctx.db.get(contribution.authorId);
        return {
          ...contribution,
          item: item ? {
            ...item,
            moduleTitle: itemModule?.title,
            trackSlug: track?.slug,
            languageSlug: language?.slug,
            languageName: language?.name,
          } : null,
          author,
        };
      })
    );

    return contributionsWithDetails.sort((a, b) => {
      if (a.submittedAt && b.submittedAt) {
        return b.submittedAt - a.submittedAt;
      }
      return b.updatedAt - a.updatedAt;
    });
  },
});

export const createContribution = mutation({
  args: {
    itemId: v.id("curriculumItems"),
    changelog: v.string(),
    fields: v.optional(v.object({
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      prompt: v.optional(v.string()),
      starterCode: v.optional(v.string()),
      testSuiteDefinition: v.optional(v.any()),
    })),
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
      throw new Error("Not authorized to create contributions");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const now = Date.now();
    let testSuiteDefinition = undefined;
    if (item.testSuiteId) {
      const testSuite = await ctx.db.get(item.testSuiteId);
      if (testSuite) {
        testSuiteDefinition = testSuite.definition;
      }
    }

    const contributionId = await ctx.db.insert("contributions", {
      authorId: user._id,
      itemId: args.itemId,
      status: "draft",
      title: args.fields?.title ?? item.title,
      content: args.fields?.content ?? item.content,
      prompt: args.fields?.prompt ?? item.prompt,
      starterCode: args.fields?.starterCode ?? item.starterCode,
      testSuiteDefinition: args.fields?.testSuiteDefinition ?? testSuiteDefinition,
      changelog: args.changelog,
      createdAt: now,
      updatedAt: now,
    });

    return contributionId;
  },
});

export const updateContribution = mutation({
  args: {
    contributionId: v.id("contributions"),
    changelog: v.optional(v.string()),
    fields: v.object({
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      prompt: v.optional(v.string()),
      starterCode: v.optional(v.string()),
      testSuiteDefinition: v.optional(v.any()),
    }),
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

    const contribution = await ctx.db.get(args.contributionId);
    if (!contribution) {
      throw new Error("Contribution not found");
    }

    const isAuthor = contribution.authorId === user._id;
    const isReviewer = hasRole(user, "reviewer") || hasRole(user, "maintainer");

    if (!isAuthor && !isReviewer) {
      throw new Error("Not authorized to update this contribution");
    }

    if (contribution.status !== "draft" && contribution.status !== "changes_requested") {
      throw new Error("Cannot update contribution in current status");
    }

    await ctx.db.patch(args.contributionId, {
      title: args.fields.title ?? contribution.title,
      content: args.fields.content ?? contribution.content,
      prompt: args.fields.prompt ?? contribution.prompt,
      starterCode: args.fields.starterCode ?? contribution.starterCode,
      testSuiteDefinition: args.fields.testSuiteDefinition ?? contribution.testSuiteDefinition,
      changelog: args.changelog ?? contribution.changelog,
      updatedAt: Date.now(),
    });
  },
});

export const submitContribution = mutation({
  args: {
    contributionId: v.id("contributions"),
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

    const contribution = await ctx.db.get(args.contributionId);
    if (!contribution) {
      throw new Error("Contribution not found");
    }

    const isAuthor = contribution.authorId === user._id;
    const isReviewer = hasRole(user, "reviewer") || hasRole(user, "maintainer");

    if (!isAuthor && !isReviewer) {
      throw new Error("Not authorized to submit this contribution");
    }

    if (contribution.status !== "draft" && contribution.status !== "changes_requested") {
      throw new Error("Cannot submit contribution in current status");
    }

    if (!contribution.changelog || contribution.changelog.trim() === "") {
      throw new Error("Changelog is required to submit");
    }

    const now = Date.now();
    await ctx.db.patch(args.contributionId, {
      status: "submitted",
      submittedAt: now,
      updatedAt: now,
    });
  },
});

export const requestChanges = mutation({
  args: {
    contributionId: v.id("contributions"),
    reviewerNote: v.string(),
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

    requireRole(user, "reviewer");

    const contribution = await ctx.db.get(args.contributionId);
    if (!contribution) {
      throw new Error("Contribution not found");
    }

    if (contribution.status !== "submitted") {
      throw new Error("Can only request changes for submitted contributions");
    }

    const now = Date.now();
    await ctx.db.patch(args.contributionId, {
      status: "changes_requested",
      reviewerNote: args.reviewerNote,
      reviewedAt: now,
      updatedAt: now,
    });
  },
});

export const rejectContribution = mutation({
  args: {
    contributionId: v.id("contributions"),
    reviewerNote: v.string(),
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

    requireRole(user, "reviewer");

    const contribution = await ctx.db.get(args.contributionId);
    if (!contribution) {
      throw new Error("Contribution not found");
    }

    if (contribution.status !== "submitted" && contribution.status !== "changes_requested") {
      throw new Error("Can only reject submitted or changes_requested contributions");
    }

    const now = Date.now();
    await ctx.db.patch(args.contributionId, {
      status: "rejected",
      reviewerNote: args.reviewerNote,
      reviewedAt: now,
      updatedAt: now,
    });
  },
});

export const finalizePublishContribution = mutation({
  args: {
    contributionId: v.id("contributions"),
    nextVersion: v.number(),
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

    requireRole(user, "reviewer");

    const contribution = await ctx.db.get(args.contributionId);
    if (!contribution) {
      throw new Error("Contribution not found");
    }

    if (contribution.status !== "submitted") {
      throw new Error("Can only publish submitted contributions");
    }

    const item = await ctx.db.get(contribution.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    const now = Date.now();

    const versionId = await ctx.db.insert("contentVersions", {
      itemId: item._id,
      version: args.nextVersion,
      snapshot: {
        title: contribution.title,
        content: contribution.content,
        prompt: contribution.prompt,
        starterCode: contribution.starterCode,
        testSuiteDefinition: contribution.testSuiteDefinition,
      },
      changelog: contribution.changelog,
      createdAt: now,
      createdById: user._id,
      sourceContributionId: contribution._id,
    });

    await ctx.db.patch(item._id, {
      title: contribution.title,
      content: contribution.content,
      prompt: contribution.prompt,
      starterCode: contribution.starterCode,
    });

    if (contribution.testSuiteDefinition && item.testSuiteId) {
      await ctx.db.patch(item.testSuiteId, {
        definition: contribution.testSuiteDefinition,
      });
    }

    await ctx.db.patch(contribution._id, {
      status: "published",
      publishedAt: now,
      publishedVersionId: versionId,
      updatedAt: now,
    });

    return { versionId, itemId: item._id, version: args.nextVersion };
  },
});

export const publishContribution = action({
  args: {
    contributionId: v.id("contributions"),
  },
  handler: async (ctx, args): Promise<{ versionId: string; itemId: string; version: number }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const user = await ctx.runQuery(api.users.currentUser, {});

    if (!user) {
      throw new Error("User not found");
    }

    if (!hasRole(user, "reviewer") && !hasRole(user, "maintainer")) {
      throw new Error("Not authorized to publish contributions");
    }

    const contribution = await ctx.runQuery(api.contributions.getContribution, {
      contributionId: args.contributionId,
    });

    if (!contribution.contribution) {
      throw new Error("Contribution not found");
    }

    if (contribution.contribution.status !== "submitted") {
      throw new Error("Can only publish submitted contributions");
    }

    const existingVersions = await ctx.runQuery(api.versions.listVersionsForItem, {
      itemId: contribution.contribution.itemId,
    });

    const nextVersion = existingVersions.length > 0
      ? Math.max(...existingVersions.map((v: { version: number }) => v.version)) + 1
      : 1;

    const result: { versionId: string; itemId: string; version: number } = await ctx.runMutation(api.contributions.finalizePublishContribution, {
      contributionId: args.contributionId,
      nextVersion,
    });

    return result;
  },
});

export const getContribution = query({
  args: { contributionId: v.id("contributions") },
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

    const contribution = await ctx.db.get(args.contributionId);
    if (!contribution) {
      return { contribution: null, item: null, language: null, module: null, track: null };
    }

    const isAuthor = contribution.authorId === user._id;
    const isReviewer = hasRole(user, "reviewer") || hasRole(user, "maintainer");
    if (!isAuthor && !isReviewer) {
      throw new Error("Not authorized");
    }

    const item = await ctx.db.get(contribution.itemId);
    if (!item) {
      return { contribution, item: null, language: null, module: null, track: null };
    }

    const moduleDoc = await ctx.db.get(item.moduleId);
    const track = moduleDoc ? await ctx.db.get(moduleDoc.trackId) : null;
    const language = track ? await ctx.db.get(track.languageId) : null;

    return {
      contribution,
      item,
      language: language ?? null,
      module: moduleDoc ?? null,
      track: track ?? null,
    };
  },
});

export const listReviewQueue = query({
  args: {
    status: v.array(v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("changes_requested"),
      v.literal("rejected"),
      v.literal("published")
    )),
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
    const isReviewer = user.roles.includes("reviewer") || user.roles.includes("maintainer");
    if (!isReviewer) {
      throw new Error("Not authorized");
    }

    const statusList = args.status;
    const contributionsArrays = await Promise.all(
      statusList.map(async (status) => {
        return await ctx.db
          .query("contributions")
          .withIndex("by_status_updated", (q) => q.eq("status", status))
          .collect();
      })
    );
    let contributions = contributionsArrays.flat();
    contributions.sort((a, b) => b.updatedAt - a.updatedAt);
    contributions = contributions.slice(0, 100);

    const enriched = await Promise.all(
      contributions.map(async (c) => {
        const item = await ctx.db.get(c.itemId);
        let languageName: string | undefined;
        let trackSlug: string | undefined;
        let kind: string | undefined;
        if (item) {
          kind = item.kind;
          const language = await ctx.db.get(item.languageId);
          languageName = language?.name;
          const moduleDoc = await ctx.db.get(item.moduleId);
          if (moduleDoc) {
            const track = await ctx.db.get(moduleDoc.trackId);
            trackSlug = track?.slug;
          }
        }
        const author = await ctx.db.get(c.authorId);
        return {
          _id: c._id,
          item: item
            ? { title: item.title, languageName, trackSlug, kind }
            : null,
          author: author
            ? { username: author.username, email: author.email }
            : null,
          status: c.status,
          submittedAt: c.submittedAt,
          updatedAt: c.updatedAt,
        };
      })
    );

    return enriched;
  },
});
