import { v } from "convex/values";
import { query, internalQuery, QueryCtx } from "./_generated/server";

export const listLanguages = query({
  handler: async (ctx: QueryCtx) => {
    const languages = await ctx.db.query("languages").collect();
    return languages;
  },
});

export const listTracksByLanguageSlug = query({
  args: { languageSlug: v.string() },
  handler: async (ctx, args) => {
    const language = await ctx.db
      .query("languages")
      .withIndex("by_slug", (q) => q.eq("slug", args.languageSlug))
      .first();

    if (!language) {
      return null;
    }

    const tracks = await ctx.db
      .query("tracks")
      .withIndex("by_language_order", (q) => q.eq("languageId", language._id))
      .collect();

    return tracks;
  },
});

export const getTrackTree = query({
  args: {
    languageSlug: v.string(),
    trackSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const language = await ctx.db
      .query("languages")
      .withIndex("by_slug", (q) => q.eq("slug", args.languageSlug))
      .first();

    if (!language) {
      return null;
    }

    const track = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", language._id).eq("slug", args.trackSlug)
      )
      .first();

    if (!track) {
      return null;
    }

    const modules = await ctx.db
      .query("modules")
      .withIndex("by_track_order", (q) => q.eq("trackId", track._id))
      .collect();

    const modulesWithItems = await Promise.all(
      modules.map(async (module) => {
        const items = await ctx.db
          .query("curriculumItems")
          .withIndex("by_module_order", (q) => q.eq("moduleId", module._id))
          .collect();

        return {
          ...module,
          items: items.sort((a, b) => a.order - b.order),
        };
      })
    );

    return {
      language,
      track,
      modules: modulesWithItems.sort((a, b) => a.order - b.order),
    };
  },
});

export const getItemBySlugs = query({
  args: {
    languageSlug: v.string(),
    itemSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const language = await ctx.db
      .query("languages")
      .withIndex("by_slug", (q) => q.eq("slug", args.languageSlug))
      .first();

    if (!language) {
      return null;
    }

    const item = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", language._id).eq("slug", args.itemSlug)
      )
      .first();

    if (!item) {
      return null;
    }

    const itemModule = await ctx.db.get(item.moduleId);
    const track = itemModule ? await ctx.db.get(itemModule.trackId) : null;

    return {
      item,
      module: itemModule,
      track,
      language,
    };
  },
});

export const getFirstItemId = internalQuery({
  handler: async (ctx) => {
    const firstItem = await ctx.db
      .query("curriculumItems")
      .first();

    return firstItem?._id || null;
  },
});
