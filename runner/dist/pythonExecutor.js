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
exports.runPythonInDocker = runPythonInDocker;
exports.runPythonProjectInDocker = runPythonProjectInDocker;
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
// ROADMAP Week 1 requirements: CPU 2 cores, Memory 512MB, Timeout 30 seconds
const DEFAULT_LIMITS = {
    cpu: 2,
    memoryMb: 512,
    timeoutMs: 30000,
    outputLimitBytes: 262144, // 256KB
};
function truncateOutput(stdout, stderr, limitBytes) {
    const encoder = new TextEncoder();
    let outputTruncated = false;
    const stdoutBytes = encoder.encode(stdout).length;
    const stderrBytes = encoder.encode(stderr).length;
    const totalBytes = stdoutBytes + stderrBytes;
    if (totalBytes > limitBytes) {
        outputTruncated = true;
        if (totalBytes > 0) {
            const stdoutRatio = stdoutBytes / totalBytes;
            const stderrRatio = stderrBytes / totalBytes;
            const maxStdoutBytes = Math.floor((limitBytes * stdoutRatio) - 1024);
            const maxStderrBytes = Math.floor((limitBytes * stderrRatio) - 1024);
            if (stdoutBytes > maxStdoutBytes && maxStdoutBytes > 0) {
                const decoder = new TextDecoder();
                const truncated = decoder.decode(encoder.encode(stdout).slice(0, maxStdoutBytes));
                stdout = truncated + "\n\n[output truncated due to size limits]";
            }
            if (stderrBytes > maxStderrBytes && maxStderrBytes > 0) {
                const decoder = new TextDecoder();
                const truncated = decoder.decode(encoder.encode(stderr).slice(0, maxStderrBytes));
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
        errorType: result.compile.ok ? undefined : (result.compile.stderr?.includes("Time limit exceeded") ? "timeout" : "compile"),
    };
    console.log(JSON.stringify(logEntry));
}
function generatePythonTestRunner(testSuite) {
    const { function: functionName, tests } = testSuite;
    let code = "import json\n";
    code += "import sys\n\n";
    // Catch any import or syntax errors from solution
    code += "try:\n";
    code += "    from solution import " + functionName + "\n";
    code += "except Exception as e:\n";
    code += "    print(json.dumps({\n";
    code += '        "passed": False,\n';
    code += '        "compile": {"ok": False, "stderr": str(e)},\n';
    code += '        "tests": []\n';
    code += "    }))\n";
    code += "    sys.exit(0)\n\n";
    code += "tests = " + JSON.stringify(tests, null, 2) + "\n\n";
    code += "results = []\n";
    code += "all_passed = True\n\n";
    code += "for idx, test in enumerate(tests):\n";
    code += "    try:\n";
    code += "        result = " + functionName + "(*test['input'])\n";
    code += "        expected = test['output']\n";
    code += "        passed = (result == expected)\n";
    code += "        if not passed:\n";
    code += "            all_passed = False\n";
    code += "        results.append({\n";
    code += '            "name": f"case {idx+1}",\n';
    code += '            "passed": passed,\n';
    code += '            "expected": expected,\n';
    code += '            "actual": result\n';
    code += "        })\n";
    code += "    except Exception as e:\n";
    code += "        all_passed = False\n";
    code += "        results.append({\n";
    code += '            "name": f"case {idx+1}",\n';
    code += '            "passed": False,\n';
    code += '            "expected": test["output"],\n';
    code += '            "actual": "exception",\n';
    code += '            "stderr": str(e)\n';
    code += "        })\n\n";
    code += "print(json.dumps({\n";
    code += '    "passed": all_passed,\n';
    code += '    "compile": {"ok": True},\n';
    code += '    "tests": results\n';
    code += "}))\n";
    return code;
}
async function runPythonInDocker(code, testSuite, limits) {
    const startTime = Date.now();
    const actualLimits = { ...DEFAULT_LIMITS, ...limits };
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
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencamp-"));
        // Set permissions on temp directory
        await fs.chmod(tempDir, 0o777);
        // Write solution.py
        const solutionPath = path.join(tempDir, "solution.py");
        await fs.writeFile(solutionPath, code);
        await fs.chmod(solutionPath, 0o644);
        // Generate and write test_runner.py
        const testRunnerCode = generatePythonTestRunner(testSuite);
        const testRunnerPath = path.join(tempDir, "test_runner.py");
        await fs.writeFile(testRunnerPath, testRunnerCode);
        await fs.chmod(testRunnerPath, 0o644);
        console.log("Generated test_runner.py:", testRunnerCode.substring(0, 200) + "...");
        // Get seccomp profile path
        const seccompProfilePath = path.join(__dirname, "../seccomp/python-profile.json");
        // Run Docker container with security constraints
        // ROADMAP Week 1: Disk 100MB limit via storage-opt
        const dockerCommand = [
            "docker", "run", "--rm",
            "--network", "none",
            `--cpus=${actualLimits.cpu}`,
            `--memory=${actualLimits.memoryMb}m`,
            `--memory-swap=${actualLimits.memoryMb}m`,
            "--pids-limit=256",
            "--security-opt=no-new-privileges",
            "--security-opt=seccomp:" + seccompProfilePath,
            "--cap-drop=ALL",
            "--read-only",
            "--storage-opt", "size=100m",
            "--tmpfs", "/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--tmpfs", "/var/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--user", "1000:1000",
            "--workdir", "/work",
            "-v", `${tempDir}:/work:rw`,
            "python:3.12-alpine",
            "sh", "-c",
            `"python test_runner.py"`
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
            const execResult = await Promise.race([execPromise, timeoutPromise]);
            stdout = execResult.stdout;
            stderr = execResult.stderr;
        }
        catch (timeoutError) {
            if (timedOut || (timeoutError instanceof Error && timeoutError.message === "Time limit exceeded")) {
                // Kill the docker container if timed out
                try {
                    await execAsync(`docker ps -q --filter "ancestor=python:3.12-alpine" | head -1 | xargs -r docker kill 2>/dev/null || true`);
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
        // Parse test results from stdout
        try {
            const testOutputMatch = stdout.match(/\{.*\}$/);
            if (testOutputMatch) {
                const testOutput = JSON.parse(testOutputMatch[0]);
                // Check compile status from the test runner output
                if (testOutput.compile && !testOutput.compile.ok) {
                    result.compile.ok = false;
                    result.compile.stderr = testOutput.compile.stderr || "Compilation error";
                    result.stderr = testOutput.compile.stderr || "";
                }
                else {
                    result.compile.ok = true;
                    result.tests = testOutput.tests || [];
                    result.passed = testOutput.passed !== undefined ? testOutput.passed : result.tests.every((t) => t.passed);
                }
            }
            else {
                result.compile.ok = false;
                result.compile.stderr = "No valid output from test runner";
                result.stderr = "No valid output from test runner";
            }
        }
        catch (parseError) {
            result.compile.ok = false;
            result.compile.stderr = `Failed to parse test output: ${parseError}`;
            result.stderr = `Failed to parse test output: ${parseError}`;
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
async function runPythonProjectInDocker(files, testSuite, limits) {
    const startTime = Date.now();
    const actualLimits = { ...DEFAULT_LIMITS, ...limits };
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
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencamp-"));
        // Set permissions on temp directory
        await fs.chmod(tempDir, 0o777);
        // Write all Python files respecting paths
        for (const file of files) {
            const filePath = path.join(tempDir, file.path);
            const fileDir = path.dirname(filePath);
            // Create directory if it doesn't exist
            await fs.mkdir(fileDir, { recursive: true });
            await fs.writeFile(filePath, file.content);
            await fs.chmod(filePath, 0o644);
        }
        // Generate and write test_runner.py
        const testRunnerCode = generatePythonTestRunner(testSuite);
        const testRunnerPath = path.join(tempDir, "test_runner.py");
        await fs.writeFile(testRunnerPath, testRunnerCode);
        await fs.chmod(testRunnerPath, 0o644);
        console.log("Generated test_runner.py:", testRunnerCode.substring(0, 200) + "...");
        // Get seccomp profile path
        const seccompProfilePath = path.join(__dirname, "../seccomp/python-profile.json");
        // Run Docker container with security constraints
        // ROADMAP Week 1: Disk 100MB limit via storage-opt
        const dockerCommand = [
            "docker", "run", "--rm",
            "--network", "none",
            `--cpus=${actualLimits.cpu}`,
            `--memory=${actualLimits.memoryMb}m`,
            `--memory-swap=${actualLimits.memoryMb}m`,
            "--pids-limit=256",
            "--security-opt=no-new-privileges",
            "--security-opt=seccomp:" + seccompProfilePath,
            "--cap-drop=ALL",
            "--read-only",
            "--storage-opt", "size=100m",
            "--tmpfs", "/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--tmpfs", "/var/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--user", "1000:1000",
            "--workdir", "/work",
            "-v", `${tempDir}:/work:rw`,
            "python:3.12-alpine",
            "sh", "-c",
            `"python test_runner.py"`
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
            const execResult = await Promise.race([execPromise, timeoutPromise]);
            stdout = execResult.stdout;
            stderr = execResult.stderr;
        }
        catch (timeoutError) {
            if (timedOut || (timeoutError instanceof Error && timeoutError.message === "Time limit exceeded")) {
                // Kill the docker container if timed out
                try {
                    await execAsync(`docker ps -q --filter "ancestor=python:3.12-alpine" | head -1 | xargs -r docker kill 2>/dev/null || true`);
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
        // Parse test results from stdout
        try {
            const testOutputMatch = stdout.match(/\{.*\}$/);
            if (testOutputMatch) {
                const testOutput = JSON.parse(testOutputMatch[0]);
                // Check compile status from the test runner output
                if (testOutput.compile && !testOutput.compile.ok) {
                    result.compile.ok = false;
                    result.compile.stderr = testOutput.compile.stderr || "Compilation error";
                    result.stderr = testOutput.compile.stderr || "";
                }
                else {
                    result.compile.ok = true;
                    result.tests = testOutput.tests || [];
                    result.passed = testOutput.passed !== undefined ? testOutput.passed : result.tests.every((t) => t.passed);
                }
            }
            else {
                result.compile.ok = false;
                result.compile.stderr = "No valid output from test runner";
                result.stderr = "No valid output from test runner";
            }
        }
        catch (parseError) {
            result.compile.ok = false;
            result.compile.stderr = `Failed to parse test output: ${parseError}`;
            result.stderr = `Failed to parse test output: ${parseError}`;
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
        return { valid: false, error: `File path too long (max ${MAX_FILE_NAME_LENGTH} characters)` };
    }
    if (pathStr.startsWith("/") || pathStr.includes("..")) {
        return { valid: false, error: "File paths cannot be absolute or contain '..'" };
    }
    const allowedPattern = /^[a-zA-Z0-9_\-/]+\.py$/;
    if (!allowedPattern.test(pathStr)) {
        return { valid: false, error: "Only .py files with alphanumeric names are allowed" };
    }
    return { valid: true };
}
