import { v } from "convex/values";
import { query } from "./_generated/server";

export const listProjectsByLanguageSlug = query({
  args: { languageSlug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const language = await ctx.db
      .query("languages")
      .withIndex("by_slug", (q) => q.eq("slug", args.languageSlug))
      .first();

    if (!language) {
      return null;
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_language_order", (q) => q.eq("languageId", language._id))
      .collect();

    return projects.map((project) => ({
      id: project._id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      order: project.order,
    }));
  },
});

export const getProjectBySlugs = query({
  args: { languageSlug: v.string(), projectSlug: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const language = await ctx.db
      .query("languages")
      .withIndex("by_slug", (q) => q.eq("slug", args.languageSlug))
      .first();

    if (!language) {
      return null;
    }

    const project = await ctx.db
      .query("projects")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", language._id).eq("slug", args.projectSlug)
      )
      .first();

    if (!project) {
      return null;
    }

    const testSuite = await ctx.db.get(project.testSuiteId);

    return {
      id: project._id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      instructions: project.instructions,
      initialFiles: project.initialFiles,
      rubric: project.rubric,
      testSuite: testSuite ? {
        id: testSuite._id,
        slug: testSuite.slug,
        title: testSuite.title,
        definition: testSuite.definition,
      } : null,
      language: {
        id: language._id,
        slug: language.slug,
        name: language.name,
        monacoLanguageId: language.editorConfig.monacoLanguageId,
      },
    };
  },
});
