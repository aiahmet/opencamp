"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dockerExecutor_1 = require("./dockerExecutor");
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
        const { code, testSuite, limits } = req.body;
        if (!code || !testSuite) {
            res.status(400).json({
                passed: false,
                compile: { ok: false, stderr: "Missing code or testSuite" },
                tests: [],
                timingMs: 0,
            });
            return;
        }
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
        const { files, testSuite, limits } = req.body;
        if (!files || !testSuite) {
            res.status(400).json({
                passed: false,
                compile: { ok: false, stderr: "Missing files or testSuite" },
                tests: [],
                timingMs: 0,
            });
            return;
        }
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
app.listen(PORT, () => {
    console.log(`OpenCamp Runner listening on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Java execution: http://localhost:${PORT}/run/java`);
});
