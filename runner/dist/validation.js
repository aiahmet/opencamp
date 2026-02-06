"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunGoProjectRequestSchema = exports.GoFileSchema = exports.RunGoRequestSchema = exports.GoTestSuiteSchema = exports.GoTestSchema = exports.RunPythonProjectRequestSchema = exports.PythonFileSchema = exports.RunPythonRequestSchema = exports.PythonTestSuiteSchema = exports.PythonTestSchema = exports.RunJavaProjectRequestSchema = exports.JavaFileSchema = exports.RunJavaRequestSchema = exports.JavaTestSuiteSchema = exports.JavaTestSchema = void 0;
const zod_1 = require("zod");
exports.JavaTestSchema = zod_1.z.object({
    input: zod_1.z.array(zod_1.z.any()),
    output: zod_1.z.any(),
});
exports.JavaTestSuiteSchema = zod_1.z.object({
    type: zod_1.z.literal("java"),
    entrypoint: zod_1.z.string(),
    method: zod_1.z.string(),
    signature: zod_1.z.string(),
    tests: zod_1.z.array(exports.JavaTestSchema),
});
exports.RunJavaRequestSchema = zod_1.z.object({
    code: zod_1.z.string().max(10000),
    testSuite: exports.JavaTestSuiteSchema,
    limits: zod_1.z.object({
        cpu: zod_1.z.number().positive().max(4).optional(),
        memoryMb: zod_1.z.number().positive().max(2048).optional(),
        timeoutMs: zod_1.z.number().positive().max(60000).optional(),
        outputLimitBytes: zod_1.z.number().positive().max(1048576).optional(),
    }).optional(),
});
exports.JavaFileSchema = zod_1.z.object({
    path: zod_1.z.string().max(200).regex(/^[a-zA-Z0-9_\-/]+\.java$/),
    content: zod_1.z.string().max(50000),
});
exports.RunJavaProjectRequestSchema = zod_1.z.object({
    files: zod_1.z.array(exports.JavaFileSchema).max(30),
    testSuite: exports.JavaTestSuiteSchema,
    limits: zod_1.z.object({
        cpu: zod_1.z.number().positive().max(4).optional(),
        memoryMb: zod_1.z.number().positive().max(2048).optional(),
        timeoutMs: zod_1.z.number().positive().max(60000).optional(),
        outputLimitBytes: zod_1.z.number().positive().max(1048576).optional(),
    }).optional(),
});
exports.PythonTestSchema = zod_1.z.object({
    input: zod_1.z.array(zod_1.z.any()),
    output: zod_1.z.any(),
});
exports.PythonTestSuiteSchema = zod_1.z.object({
    type: zod_1.z.literal("python"),
    entrypoint: zod_1.z.string(),
    function: zod_1.z.string(),
    tests: zod_1.z.array(exports.PythonTestSchema),
});
exports.RunPythonRequestSchema = zod_1.z.object({
    code: zod_1.z.string().max(10000),
    testSuite: exports.PythonTestSuiteSchema,
    limits: zod_1.z.object({
        cpu: zod_1.z.number().positive().max(4).optional(),
        memoryMb: zod_1.z.number().positive().max(2048).optional(),
        timeoutMs: zod_1.z.number().positive().max(60000).optional(),
        outputLimitBytes: zod_1.z.number().positive().max(1048576).optional(),
    }).optional(),
});
exports.PythonFileSchema = zod_1.z.object({
    path: zod_1.z.string().max(200).regex(/^[a-zA-Z0-9_\-/]+\.py$/),
    content: zod_1.z.string().max(50000),
});
exports.RunPythonProjectRequestSchema = zod_1.z.object({
    files: zod_1.z.array(exports.PythonFileSchema).max(30),
    testSuite: exports.PythonTestSuiteSchema,
    limits: zod_1.z.object({
        cpu: zod_1.z.number().positive().max(4).optional(),
        memoryMb: zod_1.z.number().positive().max(2048).optional(),
        timeoutMs: zod_1.z.number().positive().max(60000).optional(),
        outputLimitBytes: zod_1.z.number().positive().max(1048576).optional(),
    }).optional(),
});
exports.GoTestSchema = zod_1.z.object({
    name: zod_1.z.string(),
    input: zod_1.z.any(),
    expected: zod_1.z.any(),
});
exports.GoTestSuiteSchema = zod_1.z.object({
    type: zod_1.z.literal("go"),
    entrypoint: zod_1.z.string(),
    function: zod_1.z.string(),
    tests: zod_1.z.array(exports.GoTestSchema),
});
exports.RunGoRequestSchema = zod_1.z.object({
    code: zod_1.z.string().max(10000),
    testSuite: exports.GoTestSuiteSchema,
    limits: zod_1.z.object({
        cpu: zod_1.z.number().positive().max(4).optional(),
        memoryMb: zod_1.z.number().positive().max(2048).optional(),
        timeoutMs: zod_1.z.number().positive().max(60000).optional(),
        outputLimitBytes: zod_1.z.number().positive().max(1048576).optional(),
    }).optional(),
});
exports.GoFileSchema = zod_1.z.object({
    path: zod_1.z.string().max(200).regex(/^[a-zA-Z0-9_\-/]+\.go$/),
    content: zod_1.z.string().max(50000),
});
exports.RunGoProjectRequestSchema = zod_1.z.object({
    files: zod_1.z.array(exports.GoFileSchema).max(30),
    testSuite: exports.GoTestSuiteSchema,
    limits: zod_1.z.object({
        cpu: zod_1.z.number().positive().max(4).optional(),
        memoryMb: zod_1.z.number().positive().max(2048).optional(),
        timeoutMs: zod_1.z.number().positive().max(60000).optional(),
        outputLimitBytes: zod_1.z.number().positive().max(1048576).optional(),
    }).optional(),
});
