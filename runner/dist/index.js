"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dockerExecutor_1 = require("./dockerExecutor");
const pythonExecutor_1 = require("./pythonExecutor");
const validation_1 = require("./validation");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4001;
app.use(express_1.default.json({ limit: "10mb" }));
app.get("/health", (_req, res) => {
    const response = { ok: true };
    res.json(response);
});
app.post("/health", (_req, res) => {
    const response = { ok: true };
    res.json(response);
});
app.post("/run/java", async (req, res) => {
    try {
        const validationResult = validation_1.RunJavaRequestSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                passed: false,
                compile: { ok: false, stderr: "Invalid request: " + validationResult.error.issues[0].message },
                tests: [],
                timingMs: 0,
            });
            return;
        }
        const { code, testSuite, limits } = validationResult.data;
        const result = await (0, dockerExecutor_1.runJavaInDocker)(code, testSuite, limits);
        res.json(result);
    }
    catch (error) {
        console.error("Error running Java code:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({
            passed: false,
            compile: { ok: false, stderr: errorMessage },
            tests: [],
            timingMs: 0,
        });
    }
});
app.post("/run/java-project", async (req, res) => {
    try {
        const validationResult = validation_1.RunJavaProjectRequestSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                passed: false,
                compile: { ok: false, stderr: "Invalid request: " + validationResult.error.issues[0].message },
                tests: [],
                timingMs: 0,
            });
            return;
        }
        const { files, testSuite, limits } = validationResult.data;
        const result = await (0, dockerExecutor_1.runJavaProjectInDocker)(files, testSuite, limits);
        res.json(result);
    }
    catch (error) {
        console.error("Error running Java project:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({
            passed: false,
            compile: { ok: false, stderr: errorMessage },
            tests: [],
            timingMs: 0,
        });
    }
});
app.post("/run/python", async (req, res) => {
    try {
        const validationResult = validation_1.RunPythonRequestSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                passed: false,
                compile: { ok: false, stderr: "Invalid request: " + validationResult.error.issues[0].message },
                tests: [],
                timingMs: 0,
            });
            return;
        }
        const { code, testSuite, limits } = validationResult.data;
        const result = await (0, pythonExecutor_1.runPythonInDocker)(code, testSuite, limits);
        res.json(result);
    }
    catch (error) {
        console.error("Error running Python code:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({
            passed: false,
            compile: { ok: false, stderr: errorMessage },
            tests: [],
            timingMs: 0,
        });
    }
});
app.post("/run/python-project", async (req, res) => {
    try {
        const validationResult = validation_1.RunPythonProjectRequestSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                passed: false,
                compile: { ok: false, stderr: "Invalid request: " + validationResult.error.issues[0].message },
                tests: [],
                timingMs: 0,
            });
            return;
        }
        const { files, testSuite, limits } = validationResult.data;
        const result = await (0, pythonExecutor_1.runPythonProjectInDocker)(files, testSuite, limits);
        res.json(result);
    }
    catch (error) {
        console.error("Error running Python project:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal server error";
        res.status(500).json({
            passed: false,
            compile: { ok: false, stderr: errorMessage },
            tests: [],
            timingMs: 0,
        });
    }
});
app.listen(PORT, () => {
    console.log(`OpenCamp Runner listening on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Java execution: http://localhost:${PORT}/run/java`);
    console.log(`Python execution: http://localhost:${PORT}/run/python`);
});
