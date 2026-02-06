import { defineTable } from "convex/server";
import { v } from "convex/values";

export const contentTables = {
  projects: defineTable({
    languageId: v.id("languages"),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    instructions: v.string(),
    initialFiles: v.array(
      v.object({
        path: v.string(),
        content: v.string(),
      })
    ),
    rubric: v.array(
      v.object({
        id: v.string(),
        text: v.string(),
        points: v.optional(v.number()),
      })
    ),
    incrementalBuild: v.optional(v.object({
      seriesId: v.string(),
      stepNumber: v.number(),
      previousStepId: v.optional(v.id("projects")),
      totalSteps: v.number(),
    })),
    isPortfolioWorthy: v.optional(v.boolean()),
    skillTags: v.optional(v.array(v.string())),
    estimatedHours: v.optional(v.number()),
    realWorldExample: v.optional(v.string()),
    // IMPORTANT: testSuiteId must belong to the same language as languageId
    // Use validateTestSuiteLanguage() from lib/validation.ts when inserting/updating
    testSuiteId: v.id("testSuites"),
    order: v.number(),
  })
    .index("by_language_slug", ["languageId", "slug"])
    .index("by_language_order", ["languageId", "order"])
    .index("by_incremental_series", ["incrementalBuild.seriesId", "order"]),

  projectWorkspaces: defineTable({
    userId: v.id("users"),
    projectId: v.id("projects"),
    files: v.array(
      v.object({
        path: v.string(),
        content: v.string(),
      })
    ),
    updatedAt: v.number(),
  }).index("by_user_project", ["userId", "projectId"]),

  projectProgress: defineTable({
    userId: v.id("users"),
    projectId: v.id("projects"),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    updatedAt: v.number(),
  }).index("by_user_project", ["userId", "projectId"]),
};
