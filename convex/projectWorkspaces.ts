import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireIdentity } from "./lib/auth";
import { getFileExtension } from "./lib/language";

const MAX_FILES = 30;
const MAX_FILE_SIZE = 200 * 1024; // 200KB
const MAX_FILE_NAME_LENGTH = 100;

function validateFilePath(path: string, allowedExtensions: string[]): { valid: boolean; error?: string } {
  if (!path || path.length === 0) {
    return { valid: false, error: "File path cannot be empty" };
  }
  if (path.length > MAX_FILE_NAME_LENGTH) {
    return { valid: false, error: `File path too long (max ${MAX_FILE_NAME_LENGTH} characters)` };
  }
  if (path.startsWith("/") || path.includes("..")) {
    return { valid: false, error: "File paths cannot be absolute or contain '..'" };
  }
  const escapedExtensions = allowedExtensions
    .filter(Boolean)
    .map((ext) => ext.replace(".", "\\."));
  const extensionPattern = escapedExtensions.length > 0 ? escapedExtensions.join("|") : "\\.txt";
  const allowedPattern = new RegExp(`^[a-zA-Z0-9_\\-/]+(${extensionPattern})$`, "i");
  if (!allowedPattern.test(path)) {
    const allowedList = allowedExtensions.length > 0 ? allowedExtensions.join(", ") : ".txt";
    return {
      valid: false,
      error: `Only ${allowedList} files with alphanumeric names are allowed`,
    };
  }
  return { valid: true };
}

export const getWorkspace = query({
  args: { projectId: v.id("projects") },
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

    const workspace = await ctx.db
      .query("projectWorkspaces")
      .withIndex("by_user_project", (q) =>
        q.eq("userId", user._id).eq("projectId", args.projectId)
      )
      .first();

    if (!workspace) {
      return null;
    }

    return {
      id: workspace._id,
      files: workspace.files,
      updatedAt: workspace.updatedAt,
    };
  },
});

export const upsertWorkspace = mutation({
  args: {
    projectId: v.id("projects"),
    files: v.array(
      v.object({
        path: v.string(),
        content: v.string(),
      })
    ),
  },
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

    // Validate project exists
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    const language = await ctx.db.get(project.languageId);
    const allowedExtensions = [getFileExtension(language?.editorConfig?.monacoLanguageId ?? "plaintext")];

    // Validate files
    if (args.files.length > MAX_FILES) {
      throw new Error(`Too many files (max ${MAX_FILES})`);
    }

    let totalSize = 0;
    const seenPaths = new Set<string>();

    for (const file of args.files) {
      const pathValidation = validateFilePath(file.path, allowedExtensions);
      if (!pathValidation.valid) {
        throw new Error(`Invalid file path "${file.path}": ${pathValidation.error}`);
      }

      if (seenPaths.has(file.path)) {
        throw new Error(`Duplicate file path: "${file.path}"`);
      }
      seenPaths.add(file.path);

      totalSize += file.content.length;
      if (totalSize > MAX_FILE_SIZE) {
        throw new Error(`Total file size exceeds ${MAX_FILE_SIZE} bytes`);
      }
    }

    const now = Date.now();

    // Find existing workspace
    const existingWorkspace = await ctx.db
      .query("projectWorkspaces")
      .withIndex("by_user_project", (q) =>
        q.eq("userId", user._id).eq("projectId", args.projectId)
      )
      .first();

    if (existingWorkspace) {
      await ctx.db.patch(existingWorkspace._id, {
        files: args.files,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("projectWorkspaces", {
        userId: user._id,
        projectId: args.projectId,
        files: args.files,
        updatedAt: now,
      });
    }

    // Set project progress to in_progress if not already
    const existingProgress = await ctx.db
      .query("projectProgress")
      .withIndex("by_user_project", (q) =>
        q.eq("userId", user._id).eq("projectId", args.projectId)
      )
      .first();

    if (!existingProgress || existingProgress.status === "not_started") {
      if (existingProgress) {
        await ctx.db.patch(existingProgress._id, {
          status: "in_progress",
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("projectProgress", {
          userId: user._id,
          projectId: args.projectId,
          status: "in_progress",
          updatedAt: now,
        });
      }
    }

    return { success: true };
  },
});

export const resetWorkspace = mutation({
  args: { projectId: v.id("projects") },
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

    // Find and delete existing workspace
    const existingWorkspace = await ctx.db
      .query("projectWorkspaces")
      .withIndex("by_user_project", (q) =>
        q.eq("userId", user._id).eq("projectId", args.projectId)
      )
      .first();

    if (existingWorkspace) {
      await ctx.db.delete(existingWorkspace._id);
    }

    return { success: true };
  },
});
