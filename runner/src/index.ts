import express from "express";
import { runJavaInDocker, runJavaProjectInDocker } from "./dockerExecutor";
import { runPythonInDocker, runPythonProjectInDocker } from "./pythonExecutor";
import {
  RunJavaRequest,
  RunJavaProjectRequest,
  RunJavaResponse,
  HealthResponse,
  RunPythonRequest,
  RunPythonProjectRequest,
} from "./types";
import {
  RunJavaRequestSchema,
  RunJavaProjectRequestSchema,
  RunPythonRequestSchema,
  RunPythonProjectRequestSchema,
} from "./validation";

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  const response: HealthResponse = { ok: true };
  res.json(response);
});

app.post("/health", (req, res) => {
  const response: HealthResponse = { ok: true };
  res.json(response);
});

app.post<unknown, RunJavaResponse, RunJavaRequest>("/run/java", async (req, res) => {
  try {
    const validationResult = RunJavaRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      const errorMessage = firstIssue ? firstIssue.message : "Invalid request";
      res.status(400).json({
        passed: false,
        compile: { ok: false, stderr: "Invalid request: " + errorMessage },
        tests: [],
        timingMs: 0,
      });
      return;
    }
    const { code, testSuite, limits } = validationResult.data;
    // Filter out undefined values from limits to avoid exactOptionalPropertyTypes issues
    const filteredLimits = limits ? Object.fromEntries(
      Object.entries(limits).filter(([, v]) => v !== undefined)
    ) : {};
    const result = await runJavaInDocker(code, testSuite, filteredLimits as Parameters<typeof runJavaInDocker>[2]);
    res.json(result);
  } catch (error) {
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

app.post<unknown, RunJavaResponse, RunJavaProjectRequest>("/run/java-project", async (req, res) => {
  try {
    const validationResult = RunJavaProjectRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      const errorMessage = firstIssue ? firstIssue.message : "Invalid request";
      res.status(400).json({
        passed: false,
        compile: { ok: false, stderr: "Invalid request: " + errorMessage },
        tests: [],
        timingMs: 0,
      });
      return;
    }
    const { files, testSuite, limits } = validationResult.data;
    // Filter out undefined values from limits to avoid exactOptionalPropertyTypes issues
    const filteredLimits = limits ? Object.fromEntries(
      Object.entries(limits).filter(([, v]) => v !== undefined)
    ) : {};
    const result = await runJavaProjectInDocker(files, testSuite, filteredLimits as Parameters<typeof runJavaProjectInDocker>[2]);
    res.json(result);
  } catch (error) {
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

app.post<unknown, RunJavaResponse, RunPythonRequest>("/run/python", async (req, res) => {
  try {
    const validationResult = RunPythonRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      const errorMessage = firstIssue ? firstIssue.message : "Invalid request";
      res.status(400).json({
        passed: false,
        compile: { ok: false, stderr: "Invalid request: " + errorMessage },
        tests: [],
        timingMs: 0,
      });
      return;
    }
    const { code, testSuite, limits } = validationResult.data;
    // Filter out undefined values from limits to avoid exactOptionalPropertyTypes issues
    const filteredLimits = limits ? Object.fromEntries(
      Object.entries(limits).filter(([, v]) => v !== undefined)
    ) : {};
    const result = await runPythonInDocker(code, testSuite, filteredLimits as Parameters<typeof runPythonInDocker>[2]);
    res.json(result);
  } catch (error) {
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

app.post<unknown, RunJavaResponse, RunPythonProjectRequest>("/run/python-project", async (req, res) => {
  try {
    const validationResult = RunPythonProjectRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues[0];
      const errorMessage = firstIssue ? firstIssue.message : "Invalid request";
      res.status(400).json({
        passed: false,
        compile: { ok: false, stderr: "Invalid request: " + errorMessage },
        tests: [],
        timingMs: 0,
      });
      return;
    }
    const { files, testSuite, limits } = validationResult.data;
    // Filter out undefined values from limits to avoid exactOptionalPropertyTypes issues
    const filteredLimits = limits ? Object.fromEntries(
      Object.entries(limits).filter(([, v]) => v !== undefined)
    ) : {};
    const result = await runPythonProjectInDocker(files, testSuite, filteredLimits as Parameters<typeof runPythonProjectInDocker>[2]);
    res.json(result);
  } catch (error) {
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
