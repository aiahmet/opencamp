import { defineTable } from "convex/server";
import { v } from "convex/values";

export const executionTables = {
  submissions: defineTable({
    userId: v.id("users"),
    itemId: v.optional(v.id("curriculumItems")),
    kind: v.union(v.literal("challenge"), v.literal("project")),
    projectId: v.optional(v.id("projects")),
    code: v.string(),
    files: v.optional(
      v.array(
        v.object({
          path: v.string(),
          content: v.string(),
        })
      )
    ),
    status: v.union(
      v.literal("queued"),
      v.literal("running"),
      v.literal("passed"),
      v.literal("failed"),
      v.literal("error")
    ),
    result: v.optional(
      v.object({
        passed: v.boolean(),
        compile: v.object({
          ok: v.boolean(),
          stderr: v.optional(v.string()),
        }),
        tests: v.optional(
          v.array(
            v.object({
              name: v.string(),
              passed: v.boolean(),
              expected: v.any(),
              actual: v.any(),
              stderr: v.optional(v.string()),
            })
          )
        ),
        stdout: v.optional(v.string()),
        stderr: v.optional(v.string()),
        timingMs: v.optional(v.number()),
        outputTruncated: v.optional(v.boolean()),
        limits: v.optional(
          v.object({
            cpu: v.number(),
            memoryMb: v.number(),
            timeoutMs: v.number(),
            outputLimitBytes: v.number(),
          })
        ),
      })
    ),
    createdAt: v.number(),
  }).index("by_user_item_created", ["userId", "itemId", "createdAt"]),

  progress: defineTable({
    userId: v.id("users"),
    itemId: v.id("curriculumItems"),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    updatedAt: v.number(),
  }).index("by_user_item", ["userId", "itemId"]),

  drafts: defineTable({
    userId: v.id("users"),
    itemId: v.id("curriculumItems"),
    code: v.string(),
    updatedAt: v.number(),
  }).index("by_user_item", ["userId", "itemId"]),

  trackCompletions: defineTable({
    userId: v.id("users"),
    trackId: v.id("tracks"),
    completedAt: v.number(),
  })
    .index("by_user_track", ["userId", "trackId"])
    .index("by_user", ["userId"]),

  certificates: defineTable({
    userId: v.id("users"),
    trackId: v.id("tracks"),
    code: v.string(),
    issuedAt: v.number(),
    revokedAt: v.optional(v.number()),
  })
    .index("by_code", ["code"])
    .index("by_user_track", ["userId", "trackId"])
    .index("by_user", ["userId"]),

  contributions: defineTable({
    authorId: v.id("users"),
    itemId: v.id("curriculumItems"),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("changes_requested"),
      v.literal("rejected"),
      v.literal("published")
    ),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    prompt: v.optional(v.string()),
    starterCode: v.optional(v.string()),
    testSuiteDefinition: v.optional(v.any()),
    changelog: v.string(),
    reviewerNote: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    submittedAt: v.optional(v.number()),
    reviewedAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    publishedVersionId: v.optional(v.id("contentVersions")),
  })
    .index("by_item_status", ["itemId", "status"])
    .index("by_author_status", ["authorId", "status"])
    .index("by_status_updated", ["status", "updatedAt"])
    .index("by_item_author", ["itemId", "authorId"]),

  contentVersions: defineTable({
    itemId: v.id("curriculumItems"),
    version: v.number(),
    snapshot: v.object({
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      prompt: v.optional(v.string()),
      starterCode: v.optional(v.string()),
      testSuiteDefinition: v.optional(v.any()),
    }),
    changelog: v.string(),
    createdAt: v.number(),
    createdById: v.id("users"),
    sourceContributionId: v.optional(v.id("contributions")),
  })
    .index("by_item_version", ["itemId", "version"])
    .index("by_item_createdAt", ["itemId", "createdAt"]),

  rateLimits: defineTable({
    userId: v.id("users"),
    key: v.string(),
    windowStart: v.number(),
    count: v.number(),
  })
    .index("by_user_key", ["userId", "key"])
    .index("by_window_start", ["windowStart"]),

  executionLogs: defineTable({
    userId: v.id("users"),
    kind: v.union(v.literal("challenge"), v.literal("project")),
    itemId: v.optional(v.id("curriculumItems")),
    projectId: v.optional(v.id("projects")),
    submissionId: v.optional(v.id("submissions")),
    startedAt: v.number(),
    finishedAt: v.number(),
    status: v.union(
      v.literal("passed"),
      v.literal("failed"),
      v.literal("error"),
      v.literal("rate_limited"),
      v.literal("quota_exceeded")
    ),
    timingMs: v.number(),
    compileOk: v.boolean(),
    testsPassed: v.optional(v.boolean()),
    testsFailedCount: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  })
    .index("by_startedAt", ["startedAt"])
    .index("by_user_startedAt", ["userId", "startedAt"])
    .index("by_submission", ["submissionId"]),

  usageCounters: defineTable({
    userId: v.id("users"),
    day: v.string(),
    runs: v.number(),
    updatedAt: v.number(),
  }).index("by_user_day", ["userId", "day"]),

  limitsConfig: defineTable({
    dailyRunLimit: v.number(),
    perMinuteRunLimit: v.number(),
    outputLimitBytes: v.number(),
    defaultTimeoutMs: v.number(),
    defaultCpu: v.number(),
    defaultMemoryMb: v.number(),
  }),
};
