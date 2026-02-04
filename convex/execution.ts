import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { LIMITS } from "./lib/limits";
import { parseRunnerResponse } from "./lib/runnerSchema";
import { Id } from "./_generated/dataModel";

/**
 * Validates that a test suite belongs to the specified language.
 * Throws an error if validation fails.
 * Used when creating/updating projects or curriculum items with test suites.
 */
export async function validateTestSuiteLanguage(
  ctx: { runQuery: (func: any, args: any) => Promise<any> }, // eslint-disable-line @typescript-eslint/no-explicit-any
  testSuiteId: Id<"testSuites">,
  expectedLanguageId: string
): Promise<void> {
  const testSuite = await ctx.runQuery(internal.execution.getTestSuiteById, {
    testSuiteId,
  });

  if (!testSuite) {
    throw new Error("Test suite not found");
  }

  if (testSuite.languageId !== expectedLanguageId) {
    throw new Error(
      "Test suite does not belong to the specified language. " +
      `Expected language ID: ${expectedLanguageId}, ` +
      `Test suite language ID: ${testSuite.languageId}`
    );
  }
}

export const runSubmission = internalAction({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    const runnerUrl = process.env.RUNNER_URL;
    if (!runnerUrl) {
      throw new Error("Runner not configured: RUNNER_URL environment variable is not set");
    }

    const submission = await ctx.runQuery(internal.execution.getSubmissionById, {
      submissionId: args.submissionId,
    });

    if (!submission) {
      throw new Error("Submission not found");
    }

    // Handle both challenge and project submissions
    let testSuite: { definition: unknown } | null = null;
    let response: Response;

    const limits = {
      cpu: LIMITS.defaultCpu,
      memoryMb: LIMITS.defaultMemoryMb,
      timeoutMs: LIMITS.defaultTimeoutMs,
      outputLimitBytes: LIMITS.outputLimitBytes,
    };

    if (submission.kind === "project") {
      // Project submission
      if (!submission.projectId) {
        throw new Error("Project submission missing projectId");
      }

      const project = await ctx.runQuery(internal.execution.getProjectById, {
        projectId: submission.projectId,
      });

      if (!project) {
        throw new Error("Project not found");
      }

      testSuite = await ctx.runQuery(internal.execution.getTestSuiteById, {
        testSuiteId: project.testSuiteId,
      });

      if (!testSuite) {
        throw new Error("Test suite not found");
      }

      // Get the language for this project
      const language = await ctx.runQuery(internal.execution.getLanguageForProject, {
        projectId: submission.projectId,
      });

      if (!language) {
        throw new Error("Language not found for project");
      }

      if (!submission.files) {
        throw new Error("Project submission missing files");
      }

      // Route to appropriate runner based on language slug
      const endpoint =
        language.slug === "python" ? "/run/python-project" : "/run/java-project";
      response = await fetch(`${runnerUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: submission.files,
          testSuite: testSuite.definition,
          limits,
        }),
      });
    } else {
      // Challenge submission (default)
      if (!submission.itemId) {
        throw new Error("Submission missing itemId");
      }
      const item = await ctx.runQuery(internal.execution.getItemById, {
        itemId: submission.itemId,
      });

      if (!item) {
        throw new Error("Item not found");
      }

      if (item.kind !== "challenge") {
        throw new Error("Item is not a challenge");
      }

      if (!item.testSuiteId) {
        throw new Error("Item does not have a test suite");
      }

      testSuite = await ctx.runQuery(internal.execution.getTestSuiteById, {
        testSuiteId: item.testSuiteId,
      });

      if (!testSuite) {
        throw new Error("Test suite not found");
      }

      // Get the language for this test suite
      const language = await ctx.runQuery(internal.execution.getLanguageForTestSuite, {
        testSuiteId: item.testSuiteId,
      });

      if (!language) {
        throw new Error("Language not found for item");
      }

      // Route to appropriate runner based on language slug
      const endpoint = language.slug === "python" ? "/run/python" : "/run/java";
      response = await fetch(`${runnerUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: submission.code,
          testSuite: testSuite.definition,
          limits,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Runner error: ${response.status} ${errorText}`);
    }

    const result = await parseRunnerResponse(response);

    // Determine status
    let status: "passed" | "failed" | "error";
    if (result.passed && result.compile.ok) {
      status = "passed";
    } else if (result.compile.ok) {
      status = "failed";
    } else {
      status = "error";
    }

    // Enhance result with limits info
    const enhancedResult = {
      ...result,
      limits,
    };

    // Update submission with result
    await ctx.runMutation(internal.execution.patchSubmissionResult, {
      submissionId: args.submissionId,
      status,
      result: enhancedResult,
    });

    return status;
  },
});

export const runProjectSubmission = internalAction({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args): Promise<"passed" | "failed" | "error"> => {
    return await ctx.runAction(internal.execution.runSubmission, { submissionId: args.submissionId });
  },
});

export const getSubmissionById = internalQuery({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.submissionId);
  },
});

export const getItemById = internalQuery({
  args: { itemId: v.id("curriculumItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.itemId);
  },
});

export const getTestSuiteById = internalQuery({
  args: { testSuiteId: v.id("testSuites") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.testSuiteId);
  },
});

export const getProjectById = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

export const getLanguageForTestSuite = internalQuery({
  args: { testSuiteId: v.id("testSuites") },
  handler: async (ctx, args) => {
    const testSuite = await ctx.db.get(args.testSuiteId);
    if (!testSuite) {
      return null;
    }
    const language = await ctx.db.get(testSuite.languageId);
    return language;
  },
});

export const getLanguageForProject = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }
    const language = await ctx.db.get(project.languageId);
    return language;
  },
});

export const patchSubmissionResult = internalMutation({
  args: {
    submissionId: v.id("submissions"),
    status: v.union(v.literal("passed"), v.literal("failed"), v.literal("error")),
    result: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, {
      status: args.status,
      result: args.result,
    });
  },
});

export const patchSubmissionStatus = internalMutation({
  args: {
    submissionId: v.id("submissions"),
    status: v.union(v.literal("queued"), v.literal("running"), v.literal("passed"), v.literal("failed"), v.literal("error")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, {
      status: args.status,
    });
  },
});
