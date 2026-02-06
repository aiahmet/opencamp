import { defineTable } from "convex/server";
import { v } from "convex/values";

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
    prerequisiteTrackId: v.optional(v.id("tracks")),
    totalEstimatedHours: v.optional(v.number()),
    certificationRequired: v.optional(v.boolean()),
    capstoneProjectId: v.optional(v.id("projects")),
  })
    .index("by_language_slug", ["languageId", "slug"])
    .index("by_language_order", ["languageId", "order"])
    .index("by_prerequisite", ["prerequisiteTrackId"]),

  modules: defineTable({
    trackId: v.id("tracks"),
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    estimatedHours: v.optional(v.number()),
    skillTags: v.optional(v.array(v.string())),
    isReviewSection: v.optional(v.boolean()),
    isCheckpoint: v.optional(v.boolean()),
    masteryRequiredPercent: v.optional(v.number()),
    cumulativeSkills: v.optional(v.array(v.string())),
  })
    .index("by_track_slug", ["trackId", "slug"])
    .index("by_track_order", ["trackId", "order"]),

  curriculumItems: defineTable({
    moduleId: v.id("modules"),
    languageId: v.id("languages"),
    kind: v.union(v.literal("lesson"), v.literal("challenge"), v.literal("debug"), v.literal("project")),
    slug: v.string(),
    title: v.string(),
    order: v.number(),
    content: v.optional(v.string()),
    prompt: v.optional(v.string()),
    starterCode: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
    skillTags: v.optional(v.array(v.string())),
    estimatedMinutes: v.optional(v.number()),
    hasBonus: v.optional(v.boolean()),
    realWorldContext: v.optional(v.string()),
    commonPitfalls: v.optional(v.string()),
    // Debug-specific fields
    hints: v.optional(v.array(v.object({
      level: v.number(),
      text: v.string(),
    }))),
    errorType: v.optional(v.union(v.literal("syntax"), v.literal("logic"), v.literal("design"))),
    brokenCode: v.optional(v.string()),
    // Project-specific fields
    projectId: v.optional(v.id("projects")),
    incrementalStep: v.optional(v.number()),
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
