import { z } from "zod";

export const JavaTestSchema = z.object({
  input: z.array(z.any()),
  output: z.any(),
});

export const JavaTestSuiteSchema = z.object({
  type: z.literal("java"),
  entrypoint: z.string(),
  method: z.string(),
  signature: z.string(),
  tests: z.array(JavaTestSchema),
});

export const RunJavaRequestSchema = z.object({
  code: z.string().max(10000),
  testSuite: JavaTestSuiteSchema,
  limits: z.object({
    cpu: z.number().positive().max(4).optional(),
    memoryMb: z.number().positive().max(2048).optional(),
    timeoutMs: z.number().positive().max(60000).optional(),
    outputLimitBytes: z.number().positive().max(1048576).optional(),
  }).optional(),
});

export const JavaFileSchema = z.object({
  path: z.string().max(200).regex(/^[a-zA-Z0-9_\-/]+\.java$/),
  content: z.string().max(50000),
});

export const RunJavaProjectRequestSchema = z.object({
  files: z.array(JavaFileSchema).max(30),
  testSuite: JavaTestSuiteSchema,
  limits: z.object({
    cpu: z.number().positive().max(4).optional(),
    memoryMb: z.number().positive().max(2048).optional(),
    timeoutMs: z.number().positive().max(60000).optional(),
    outputLimitBytes: z.number().positive().max(1048576).optional(),
  }).optional(),
});

export const PythonTestSchema = z.object({
  input: z.array(z.any()),
  output: z.any(),
});

export const PythonTestSuiteSchema = z.object({
  type: z.literal("python"),
  entrypoint: z.string(),
  function: z.string(),
  tests: z.array(PythonTestSchema),
});

export const RunPythonRequestSchema = z.object({
  code: z.string().max(10000),
  testSuite: PythonTestSuiteSchema,
  limits: z.object({
    cpu: z.number().positive().max(4).optional(),
    memoryMb: z.number().positive().max(2048).optional(),
    timeoutMs: z.number().positive().max(60000).optional(),
    outputLimitBytes: z.number().positive().max(1048576).optional(),
  }).optional(),
});

export const PythonFileSchema = z.object({
  path: z.string().max(200).regex(/^[a-zA-Z0-9_\-/]+\.py$/),
  content: z.string().max(50000),
});

export const RunPythonProjectRequestSchema = z.object({
  files: z.array(PythonFileSchema).max(30),
  testSuite: PythonTestSuiteSchema,
  limits: z.object({
    cpu: z.number().positive().max(4).optional(),
    memoryMb: z.number().positive().max(2048).optional(),
    timeoutMs: z.number().positive().max(60000).optional(),
    outputLimitBytes: z.number().positive().max(1048576).optional(),
  }).optional(),
});

export const GoTestSchema = z.object({
  name: z.string(),
  input: z.any(),
  expected: z.any(),
});

export const GoTestSuiteSchema = z.object({
  type: z.literal("go"),
  entrypoint: z.string(),
  function: z.string(),
  tests: z.array(GoTestSchema),
});

export const RunGoRequestSchema = z.object({
  code: z.string().max(10000),
  testSuite: GoTestSuiteSchema,
  limits: z.object({
    cpu: z.number().positive().max(4).optional(),
    memoryMb: z.number().positive().max(2048).optional(),
    timeoutMs: z.number().positive().max(60000).optional(),
    outputLimitBytes: z.number().positive().max(1048576).optional(),
  }).optional(),
});

export const GoFileSchema = z.object({
  path: z.string().max(200).regex(/^[a-zA-Z0-9_\-/]+\.go$/),
  content: z.string().max(50000),
});

export const RunGoProjectRequestSchema = z.object({
  files: z.array(GoFileSchema).max(30),
  testSuite: GoTestSuiteSchema,
  limits: z.object({
    cpu: z.number().positive().max(4).optional(),
    memoryMb: z.number().positive().max(2048).optional(),
    timeoutMs: z.number().positive().max(60000).optional(),
    outputLimitBytes: z.number().positive().max(1048576).optional(),
  }).optional(),
});
