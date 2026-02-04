import { defineTable } from "convex/server";
import { v } from "convex/values";

export const socialTables = {
  discussions: defineTable({
    authorId: v.id("users"),
    scopeType: v.union(v.literal("global"), v.literal("track"), v.literal("module"), v.literal("item")),
    scopeId: v.union(v.id("tracks"), v.id("modules"), v.id("curriculumItems"), v.null()),
    type: v.union(v.literal("help"), v.literal("showcase"), v.literal("general")),
    title: v.string(),
    body: v.string(),
    locked: v.boolean(),
    pinned: v.boolean(),
    acceptedCommentId: v.optional(v.id("comments")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_scope_created", ["scopeType", "scopeId", "createdAt"])
    .index("by_scope_updated", ["scopeType", "scopeId", "updatedAt"])
    .index("by_author_updated", ["authorId", "updatedAt"]),

  comments: defineTable({
    discussionId: v.id("discussions"),
    authorId: v.id("users"),
    parentCommentId: v.optional(v.id("comments")),
    body: v.string(),
    removed: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_discussion_created", ["discussionId", "createdAt"])
    .index("by_parent_created", ["parentCommentId", "createdAt"])
    .index("by_author_updated", ["authorId", "updatedAt"]),

  votes: defineTable({
    userId: v.id("users"),
    commentId: v.id("comments"),
    value: v.union(v.literal(-1), v.literal(1)),
    createdAt: v.number(),
  })
    .index("by_user_comment", ["userId", "commentId"])
    .index("by_comment", ["commentId"]),

  moderationEvents: defineTable({
    actorId: v.id("users"),
    action: v.union(
      v.literal("lock_thread"),
      v.literal("unlock_thread"),
      v.literal("remove_comment"),
      v.literal("restore_comment"),
      v.literal("set_accepted"),
      v.literal("unset_accepted")
    ),
    discussionId: v.optional(v.id("discussions")),
    commentId: v.optional(v.id("comments")),
    reason: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_discussion_created", ["discussionId", "createdAt"]),
};
