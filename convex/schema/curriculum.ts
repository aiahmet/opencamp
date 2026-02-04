import { defineTable, v } from "convex/server";

export const curriculumTables = {
  languages: defineTable({
    slug: v.string(),
    name: v.string(),
    editorConfig: v.object({
      monacoLanguageId: v.string(),
    }),
    runtimeConfig: v.optional(v.any()),
  }).index("by_slug", ["slug"]),

  tracks: defineTable({
    languageId: v.id("languages"),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    level: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_language_slug", ["languageId", "slug"])
    .index("by_language_order", ["languageId", "order"]),

  modules: defineTable({
    trackId: v.id("tracks"),
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_track_slug", ["trackId", "slug"])
    .index("by_track_order", ["trackId", "order"]),

  curriculumItems: defineTable({
    moduleId: v.id("modules"),
    languageId: v.id("languages"),
    kind: v.union(v.literal("lesson"), v.literal("challenge")),
    slug: v.string(),
    title: v.string(),
    order: v.number(),
    content: v.optional(v.string()),
    prompt: v.optional(v.string()),
    starterCode: v.optional(v.string()),
    // IMPORTANT: testSuiteId must belong to the same language as languageId
    // Use validateTestSuiteLanguage() from lib/validation.ts when inserting/updating
    testSuiteId: v.optional(v.id("testSuites")),
  })
    .index("by_module_order", ["moduleId", "order"])
    .index("by_slug", ["slug"])
    .index("by_language_slug", ["languageId", "slug"]),

  testSuites: defineTable({
    languageId: v.id("languages"),
    slug: v.string(),
    title: v.string(),
    definition: v.any(),
  }).index("by_language_slug", ["languageId", "slug"]),
};
