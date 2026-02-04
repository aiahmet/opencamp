import { v } from "convex/values";

// Schema for validating runner API responses
export const runnerResponseSchema = v.object({
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
});

// Type for validated runner response
export type RunnerResponse = {
  passed: boolean;
  compile: {
    ok: boolean;
    stderr?: string;
  };
  tests?: Array<{
    name: string;
    passed: boolean;
    expected: unknown;
    actual: unknown;
    stderr?: string;
  }>;
  stdout?: string;
  stderr?: string;
  timingMs?: number;
  outputTruncated?: boolean;
};

/**
 * Validates a runner response against the expected schema.
 * Throws an error if the response is invalid.
 */
export function validateRunnerResponse(data: unknown): RunnerResponse {
  try {
    // For runtime validation, manually check structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid runner response: not an object");
    }

    const response = data as Record<string, unknown>;

    // Check required fields
    if (typeof response.passed !== "boolean") {
      throw new Error("Invalid runner response: missing or invalid 'passed' field");
    }

    if (!response.compile || typeof response.compile !== "object") {
      throw new Error("Invalid runner response: missing or invalid 'compile' field");
    }

    const compile = response.compile as Record<string, unknown>;
    if (typeof compile.ok !== "boolean") {
      throw new Error("Invalid runner response: missing or invalid 'compile.ok' field");
    }

    // Validate tests array if present
    if (response.tests !== undefined) {
      if (!Array.isArray(response.tests)) {
        throw new Error("Invalid runner response: 'tests' must be an array");
      }
      for (const test of response.tests) {
        if (!test || typeof test !== "object") {
          throw new Error("Invalid runner response: test must be an object");
        }
        const t = test as Record<string, unknown>;
        if (typeof t.name !== "string") {
          throw new Error("Invalid runner response: test missing 'name' field");
        }
        if (typeof t.passed !== "boolean") {
          throw new Error("Invalid runner response: test missing 'passed' field");
        }
      }
    }

    return response as RunnerResponse;
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw new Error("Invalid runner response: schema validation failed");
  }
}

/**
 * Parse and validate JSON response from runner.
 * Returns validated response or throws error.
 */
export async function parseRunnerResponse(response: Response): Promise<RunnerResponse> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Runner error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return validateRunnerResponse(data);
}
