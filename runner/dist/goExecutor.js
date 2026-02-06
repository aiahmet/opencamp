"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGoInDocker = runGoInDocker;
exports.runGoProjectInDocker = runGoProjectInDocker;
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const execAsyncCustom = (command, options) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, options || {}, (error, stdout, stderr) => {
            if (error) {
                reject({ ...error, stdout: stdout || "", stderr: stderr || "" });
            }
            else {
                resolve({ stdout: stdout || "", stderr: stderr || "" });
            }
        });
    });
};
// Read limits from environment variables with defaults
// ROADMAP Week 1 requirements: CPU 2 cores, Memory 512MB, Timeout 30 seconds
const getConfiguredLimits = () => ({
    cpu: parseFloat(process.env.RUNNER_CPU_LIMITS || "2"),
    memoryMb: parseInt(process.env.RUNNER_MEMORY_MB || "512", 10),
    timeoutMs: parseInt(process.env.RUNNER_TIMEOUT_MS || "30000", 10),
    outputLimitBytes: parseInt(process.env.RUNNER_OUTPUT_LIMIT_BYTES || "262144", 10),
});
function truncateOutput(stdout, stderr, limitBytes) {
    const encoder = new TextEncoder();
    let outputTruncated = false;
    const stdoutBytes = encoder.encode(stdout).length;
    const stderrBytes = encoder.encode(stderr).length;
    const totalBytes = stdoutBytes + stderrBytes;
    if (totalBytes > limitBytes) {
        outputTruncated = true;
        // Proportionally reduce both outputs
        if (totalBytes > 0) {
            const stdoutRatio = stdoutBytes / totalBytes;
            const stderrRatio = stderrBytes / totalBytes;
            const maxStdoutBytes = Math.floor(limitBytes * stdoutRatio - 1024);
            const maxStderrBytes = Math.floor(limitBytes * stderrRatio - 1024);
            if (stdoutBytes > maxStdoutBytes && maxStdoutBytes > 0) {
                const truncated = new TextDecoder().decode(encoder.encode(stdout).slice(0, maxStdoutBytes));
                stdout = truncated + "\n\n[output truncated due to size limits]";
            }
            if (stderrBytes > maxStderrBytes && maxStderrBytes > 0) {
                const truncated = new TextDecoder().decode(encoder.encode(stderr).slice(0, maxStderrBytes));
                stderr = truncated + "\n\n[output truncated due to size limits]";
            }
        }
    }
    return { stdout, stderr, outputTruncated };
}
function logExecution(kind, result, timingMs, compileOk) {
    const logEntry = {
        kind,
        timingMs,
        compileOk,
        passed: result.passed,
        outputTruncated: result.outputTruncated || false,
        errorType: result.compile.ok
            ? undefined
            : result.compile.stderr?.includes("Time limit exceeded")
                ? "timeout"
                : "compile",
    };
    console.log(JSON.stringify(logEntry));
}
function generateGoTestRunner(testSuite) {
    const { function: functionName, tests } = testSuite;
    let code = "package main\n\n";
    code += "import (\n";
    code += '  "fmt"\n';
    code += '  "encoding/json"\n';
    code += ")\n\n";
    // Include the solution (will be replaced)
    code += "// Solution code will be inserted here\n";
    code += "// {{SOLUTION}}\n\n";
    // Test runner
    code += "func main() {\n";
    code += "  results := []map[string]interface{}{}\n";
    code += "  passed := 0\n";
    code += "  failed := 0\n\n";
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        if (!test)
            continue;
        code += `  // Test ${i + 1}: ${test.name}\n`;
        code += `  func() {\n`;
        code += `    defer func() {\n`;
        code += `      if r := recover(); r != nil {\n`;
        code += `        failed++\n`;
        code += `        results = append(results, map[string]interface{}{\n`;
        code += `          "name": "${test.name}",\n`;
        code += `          "passed": false,\n`;
        code += `          "expected": "${test.expected}",\n`;
        code += `          "actual": fmt.Sprintf("%v", r),\n`;
        code += `          "error": "panic",\n`;
        code += `        })\n`;
        code += `      }\n`;
        code += `    }()\n`;
        code += `    result := ${functionName}(${test.input})\n`;
        code += `    expected := ${test.expected}\n`;
        code += `    if result == expected {\n`;
        code += `      passed++\n`;
        code += `      results = append(results, map[string]interface{}{\n`;
        code += `        "name": "${test.name}",\n`;
        code += `        "passed": true,\n`;
        code += `      })\n`;
        code += `    } else {\n`;
        code += `      failed++\n`;
        code += `      results = append(results, map[string]interface{}{\n`;
        code += `        "name": "${test.name}",\n`;
        code += `        "passed": false,\n`;
        code += `        "expected": expected,\n`;
        code += `        "actual": result,\n`;
        code += `      })\n`;
        code += `    }\n`;
        code += `  }()\n\n`;
    }
    code += "  output := map[string]interface{}{\n";
    code += "    \"tests\": results,\n";
    code += "    \"passed\": failed == 0,\n";
    code += "  }\n";
    code += "  json, _ := json.Marshal(output)\n";
    code += "  fmt.Println(string(json))\n";
    code += "}\n";
    return code;
}
async function runGoInDocker(code, testSuite, limits) {
    const startTime = Date.now();
    const actualLimits = { ...getConfiguredLimits(), ...limits };
    const result = {
        passed: false,
        compile: { ok: false },
        tests: [],
        stdout: "",
        stderr: "",
        timingMs: 0,
        outputTruncated: false,
    };
    // Check if Docker is available
    try {
        await execAsync("docker --version");
    }
    catch {
        result.compile.stderr = "Docker not installed or not available";
        result.timingMs = Date.now() - startTime;
        logExecution("challenge", result, result.timingMs, false);
        return result;
    }
    // Create temporary workspace
    let tempDir = null;
    try {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencamp-go-"));
        // Set permissions on temp directory
        await fs.chmod(tempDir, 0o777);
        // Write Solution.go
        const solutionPath = path.join(tempDir, "Solution.go");
        await fs.writeFile(solutionPath, code);
        await fs.chmod(solutionPath, 0o644);
        // Generate and write TestRunner.go
        const testRunnerCode = generateGoTestRunner(testSuite);
        // Insert solution code into test runner
        const finalTestRunner = testRunnerCode.replace("// {{SOLUTION}}", code);
        const testRunnerPath = path.join(tempDir, "TestRunner.go");
        await fs.writeFile(testRunnerPath, finalTestRunner);
        await fs.chmod(testRunnerPath, 0o644);
        // Initialize Go module
        const goModPath = path.join(tempDir, "go.mod");
        await fs.writeFile(goModPath, "module solution\n\ngo 1.21\n");
        await fs.chmod(goModPath, 0o644);
        console.log("Generated TestRunner.go:", testRunnerCode.substring(0, 200) + "...");
        // Get seccomp profile path
        const seccompProfilePath = path.join(__dirname, "../seccomp/go-profile.json");
        // Run Docker container with security constraints
        // ROADMAP Week 1: Disk 100MB limit via storage-opt
        const dockerCommand = [
            "docker",
            "run",
            "--rm",
            "--network",
            "none",
            `--cpus=${actualLimits.cpu}`,
            `--memory=${actualLimits.memoryMb}m`,
            `--memory-swap=${actualLimits.memoryMb}m`,
            "--pids-limit=256",
            "--security-opt=no-new-privileges",
            "--security-opt=seccomp:" + seccompProfilePath,
            "--cap-drop=ALL",
            "--read-only",
            "--storage-opt",
            "size=100m",
            "--tmpfs",
            "/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--tmpfs",
            "/var/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--user",
            "1000:1000",
            "--workdir",
            "/work",
            "-v",
            `${tempDir}:/work:rw`,
            "golang:1.21-alpine",
            "sh",
            "-c",
            `"go build -o /tmp/test TestRunner.go Solution.go 2>&1 && /tmp/test"`,
        ];
        const fullCommand = dockerCommand.join(" ");
        console.log("Executing Docker command:", fullCommand);
        // Set up timeout handling
        let timedOut = false;
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                timedOut = true;
                reject(new Error("Time limit exceeded"));
            }, actualLimits.timeoutMs);
        });
        const execPromise = execAsyncCustom(fullCommand, {
            maxBuffer: actualLimits.outputLimitBytes * 2,
        });
        let stdout;
        let stderr;
        try {
            const execResult = (await Promise.race([
                execPromise,
                timeoutPromise,
            ]));
            stdout = execResult.stdout;
            stderr = execResult.stderr;
        }
        catch (timeoutError) {
            if (timedOut ||
                (timeoutError instanceof Error && timeoutError.message === "Time limit exceeded")) {
                // Kill the docker container if timed out
                try {
                    await execAsync(`docker ps -q --filter "ancestor=golang:1.21-alpine" | head -1 | xargs -r docker kill 2>/dev/null || true`);
                }
                catch {
                    // Ignore kill errors
                }
                result.compile.ok = false;
                result.compile.stderr = "Time limit exceeded";
                result.stderr = "Time limit exceeded";
                result.timingMs = actualLimits.timeoutMs;
                logExecution("challenge", result, result.timingMs, false);
                return result;
            }
            throw timeoutError;
        }
        // Truncate output if needed
        const truncated = truncateOutput(stdout, stderr, actualLimits.outputLimitBytes);
        result.stdout = truncated.stdout;
        result.stderr = truncated.stderr;
        result.outputTruncated = truncated.outputTruncated;
        // Check if compilation succeeded
        if (stderr.includes("error:") || stdout.includes("error:")) {
            result.compile.ok = false;
            result.compile.stderr = result.stderr;
        }
        else {
            result.compile.ok = true;
            // Parse test results from stdout
            try {
                const testOutputMatch = stdout.match(/\{.*\}$/);
                if (testOutputMatch) {
                    const testOutput = JSON.parse(testOutputMatch[0]);
                    result.tests = testOutput.tests || [];
                    result.passed =
                        testOutput.passed !== undefined
                            ? testOutput.passed
                            : result.tests.every((t) => t.passed);
                }
                else {
                    result.passed = false;
                }
            }
            catch (parseError) {
                result.passed = false;
                result.tests = [
                    {
                        name: "parsing",
                        passed: false,
                        expected: "valid JSON",
                        actual: "parse error",
                        stderr: String(parseError),
                    },
                ];
            }
        }
    }
    catch (error) {
        console.error("Docker execution error:", error);
        const err = error;
        result.stderr = err.stderr || err.message || "Docker command failed";
        if (err.message === "Time limit exceeded") {
            result.compile.stderr = "Time limit exceeded";
            result.compile.ok = false;
        }
        else if (err.killed || err.signal === "SIGTERM") {
            result.compile.stderr = "Execution terminated";
            result.compile.ok = false;
        }
    }
    finally {
        // Clean up temp directory
        if (tempDir) {
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
            }
            catch (cleanupError) {
                console.error("Failed to clean up temp directory:", cleanupError);
            }
        }
    }
    result.timingMs = Date.now() - startTime;
    logExecution("challenge", result, result.timingMs, result.compile.ok);
    return result;
}
async function runGoProjectInDocker(files, testSuite, limits) {
    const startTime = Date.now();
    const actualLimits = { ...getConfiguredLimits(), ...limits };
    const result = {
        passed: false,
        compile: { ok: false },
        tests: [],
        stdout: "",
        stderr: "",
        timingMs: 0,
        outputTruncated: false,
    };
    // Validate files
    const MAX_FILES = 30;
    const MAX_FILE_SIZE = 200 * 1024; // 200KB
    if (files.length > MAX_FILES) {
        result.compile.stderr = `Too many files (max ${MAX_FILES})`;
        result.timingMs = Date.now() - startTime;
        logExecution("project", result, result.timingMs, false);
        return result;
    }
    let totalSize = 0;
    const seenPaths = new Set();
    for (const file of files) {
        const pathValidation = validateFilePath(file.path);
        if (!pathValidation.valid) {
            result.compile.stderr = `Invalid file path "${file.path}": ${pathValidation.error}`;
            result.timingMs = Date.now() - startTime;
            logExecution("project", result, result.timingMs, false);
            return result;
        }
        if (seenPaths.has(file.path)) {
            result.compile.stderr = `Duplicate file path: "${file.path}"`;
            result.timingMs = Date.now() - startTime;
            logExecution("project", result, result.timingMs, false);
            return result;
        }
        seenPaths.add(file.path);
        totalSize += file.content.length;
        if (totalSize > MAX_FILE_SIZE) {
            result.compile.stderr = `Total file size exceeds ${MAX_FILE_SIZE} bytes`;
            result.timingMs = Date.now() - startTime;
            logExecution("project", result, result.timingMs, false);
            return result;
        }
    }
    // Check if Docker is available
    try {
        await execAsync("docker --version");
    }
    catch {
        result.compile.stderr = "Docker not installed or not available";
        result.timingMs = Date.now() - startTime;
        logExecution("project", result, result.timingMs, false);
        return result;
    }
    // Create temporary workspace
    let tempDir = null;
    try {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencamp-go-"));
        // Set permissions on temp directory
        await fs.chmod(tempDir, 0o777);
        // Write all Go files respecting paths
        for (const file of files) {
            const filePath = path.join(tempDir, file.path);
            const fileDir = path.dirname(filePath);
            // Create directory if it doesn't exist
            await fs.mkdir(fileDir, { recursive: true });
            await fs.writeFile(filePath, file.content);
            await fs.chmod(filePath, 0o644);
        }
        // Generate and write TestRunner.go
        const testRunnerCode = generateGoTestRunner(testSuite);
        const testRunnerPath = path.join(tempDir, "TestRunner.go");
        await fs.writeFile(testRunnerPath, testRunnerCode);
        await fs.chmod(testRunnerPath, 0o644);
        // Initialize Go module
        const goModPath = path.join(tempDir, "go.mod");
        await fs.writeFile(goModPath, "module solution\n\ngo 1.21\n");
        await fs.chmod(goModPath, 0o644);
        console.log("Generated TestRunner.go:", testRunnerCode.substring(0, 200) + "...");
        // Find all .go files
        const goFiles = [];
        async function findGoFiles(dir) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    await findGoFiles(fullPath);
                }
                else if (entry.isFile() && entry.name.endsWith(".go")) {
                    goFiles.push(fullPath.substring(tempDir.length + 1)); // Relative path
                }
            }
        }
        await findGoFiles(tempDir);
        console.log("Found Go files:", goFiles);
        // Get seccomp profile path
        const seccompProfilePath = path.join(__dirname, "../seccomp/go-profile.json");
        // Run Docker container with security constraints
        // ROADMAP Week 1: Disk 100MB limit via storage-opt
        const dockerCommand = [
            "docker",
            "run",
            "--rm",
            "--network",
            "none",
            `--cpus=${actualLimits.cpu}`,
            `--memory=${actualLimits.memoryMb}m`,
            `--memory-swap=${actualLimits.memoryMb}m`,
            "--pids-limit=256",
            "--security-opt=no-new-privileges",
            "--security-opt=seccomp:" + seccompProfilePath,
            "--cap-drop=ALL",
            "--read-only",
            "--storage-opt",
            "size=100m",
            "--tmpfs",
            "/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--tmpfs",
            "/var/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--user",
            "1000:1000",
            "--workdir",
            "/work",
            "-v",
            `${tempDir}:/work:rw`,
            "golang:1.21-alpine",
            "sh",
            "-c",
            `"go build -o /tmp/test ${goFiles.join(" ")} 2>&1 && /tmp/test"`,
        ];
        const fullCommand = dockerCommand.join(" ");
        console.log("Executing Docker command:", fullCommand);
        // Set up timeout handling
        let timedOut = false;
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                timedOut = true;
                reject(new Error("Time limit exceeded"));
            }, actualLimits.timeoutMs);
        });
        const execPromise = execAsyncCustom(fullCommand, {
            maxBuffer: actualLimits.outputLimitBytes * 2,
        });
        let stdout;
        let stderr;
        try {
            const execResult = (await Promise.race([
                execPromise,
                timeoutPromise,
            ]));
            stdout = execResult.stdout;
            stderr = execResult.stderr;
        }
        catch (timeoutError) {
            if (timedOut ||
                (timeoutError instanceof Error && timeoutError.message === "Time limit exceeded")) {
                // Kill the docker container if timed out
                try {
                    await execAsync(`docker ps -q --filter "ancestor=golang:1.21-alpine" | head -1 | xargs -r docker kill 2>/dev/null || true`);
                }
                catch {
                    // Ignore kill errors
                }
                result.compile.ok = false;
                result.compile.stderr = "Time limit exceeded";
                result.stderr = "Time limit exceeded";
                result.timingMs = actualLimits.timeoutMs;
                logExecution("project", result, result.timingMs, false);
                return result;
            }
            throw timeoutError;
        }
        // Truncate output if needed
        const truncated = truncateOutput(stdout, stderr, actualLimits.outputLimitBytes);
        result.stdout = truncated.stdout;
        result.stderr = truncated.stderr;
        result.outputTruncated = truncated.outputTruncated;
        // Check if compilation succeeded
        if (stderr.includes("error:") || stdout.includes("error:")) {
            result.compile.ok = false;
            result.compile.stderr = result.stderr;
        }
        else {
            result.compile.ok = true;
            // Parse test results from stdout
            try {
                const testOutputMatch = stdout.match(/\{.*\}$/);
                if (testOutputMatch) {
                    const testOutput = JSON.parse(testOutputMatch[0]);
                    result.tests = testOutput.tests || [];
                    result.passed =
                        testOutput.passed !== undefined
                            ? testOutput.passed
                            : result.tests.every((t) => t.passed);
                }
                else {
                    result.passed = false;
                }
            }
            catch (parseError) {
                result.passed = false;
                result.tests = [
                    {
                        name: "parsing",
                        passed: false,
                        expected: "valid JSON",
                        actual: "parse error",
                        stderr: String(parseError),
                    },
                ];
            }
        }
    }
    catch (error) {
        console.error("Docker execution error:", error);
        const err = error;
        result.stderr = err.stderr || err.message || "Docker command failed";
        if (err.message === "Time limit exceeded") {
            result.compile.stderr = "Time limit exceeded";
            result.compile.ok = false;
        }
        else if (err.killed || err.signal === "SIGTERM") {
            result.compile.stderr = "Execution terminated";
            result.compile.ok = false;
        }
    }
    finally {
        // Clean up temp directory
        if (tempDir) {
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
            }
            catch (cleanupError) {
                console.error("Failed to clean up temp directory:", cleanupError);
            }
        }
    }
    result.timingMs = Date.now() - startTime;
    logExecution("project", result, result.timingMs, result.compile.ok);
    return result;
}
function validateFilePath(pathStr) {
    if (!pathStr || pathStr.length === 0) {
        return { valid: false, error: "File path cannot be empty" };
    }
    const MAX_FILE_NAME_LENGTH = 100;
    if (pathStr.length > MAX_FILE_NAME_LENGTH) {
        return {
            valid: false,
            error: `File path too long (max ${MAX_FILE_NAME_LENGTH} characters)`,
        };
    }
    if (pathStr.startsWith("/") || pathStr.includes("..")) {
        return {
            valid: false,
            error: "File paths cannot be absolute or contain '..'",
        };
    }
    const allowedPattern = /^[a-zA-Z0-9_\-/]+\.go$/;
    if (!allowedPattern.test(pathStr)) {
        return {
            valid: false,
            error: "Only .go files with alphanumeric names are allowed",
        };
    }
    return { valid: true };
}
