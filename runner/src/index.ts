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

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  const response: HealthResponse = { ok: true };
  res.json(response);
});

app.post("/health", (_req, res) => {
  const response: HealthResponse = { ok: true };
  res.json(response);
});

app.post<unknown, RunJavaResponse, RunJavaRequest>("/run/java", async (req, res) => {
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

    const result = await runJavaInDocker(code, testSuite, limits);
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

    const result = await runJavaProjectInDocker(files, testSuite, limits);
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
    const { code, testSuite, limits } = req.body as RunPythonRequest;

    if (!code || !testSuite) {
      res.status(400).json({
        passed: false,
        compile: { ok: false, stderr: "Missing code or testSuite" },
        tests: [],
        timingMs: 0,
      });
      return;
    }

    const result = await runPythonInDocker(code, testSuite, limits);
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
    const { files, testSuite, limits } = req.body as RunPythonProjectRequest;

    if (!files || !testSuite) {
      res.status(400).json({
        passed: false,
        compile: { ok: false, stderr: "Missing files or testSuite" },
        tests: [],
        timingMs: 0,
      });
      return;
    }

    const result = await runPythonProjectInDocker(files, testSuite, limits);
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
