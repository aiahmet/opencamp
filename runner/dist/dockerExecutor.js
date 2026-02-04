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
exports.runJavaInDocker = runJavaInDocker;
exports.runJavaProjectInDocker = runJavaProjectInDocker;
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const testRunnerGenerator_1 = require("./testRunnerGenerator");
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
const DEFAULT_LIMITS = {
    cpu: 0.5,
    memoryMb: 256,
    timeoutMs: 10000,
    outputLimitBytes: 262144, // 256KB
};
// Read limits from environment variables with defaults
const getConfiguredLimits = () => ({
    cpu: parseFloat(process.env.RUNNER_CPU_LIMITS || "0.5"),
    memoryMb: parseInt(process.env.RUNNER_MEMORY_MB || "256", 10),
    timeoutMs: parseInt(process.env.RUNNER_TIMEOUT_MS || "10000", 10),
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
            const maxStdoutBytes = Math.floor((limitBytes * stdoutRatio) - 1024); // Reserve space for message
            const maxStderrBytes = Math.floor((limitBytes * stderrRatio) - 1024);
            if (stdoutBytes > maxStdoutBytes && maxStdoutBytes > 0) {
                const encoder = new TextEncoder();
                const decoder = new TextDecoder();
                const truncated = decoder.decode(encoder.encode(stdout).slice(0, maxStdoutBytes));
                stdout = truncated + "\n\n[output truncated due to size limits]";
            }
            if (stderrBytes > maxStderrBytes && maxStderrBytes > 0) {
                const encoder = new TextEncoder();
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
async function runJavaInDocker(code, testSuite, limits) {
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
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencamp-"));
        // Set permissions on temp directory
        await fs.chmod(tempDir, 0o777);
        // Write Solution.java
        const solutionPath = path.join(tempDir, "Solution.java");
        await fs.writeFile(solutionPath, code);
        await fs.chmod(solutionPath, 0o644);
        // Generate and write TestRunner.java
        const testRunnerCode = (0, testRunnerGenerator_1.generateTestRunner)(testSuite);
        const testRunnerPath = path.join(tempDir, "TestRunner.java");
        await fs.writeFile(testRunnerPath, testRunnerCode);
        await fs.chmod(testRunnerPath, 0o644);
        console.log("Generated TestRunner.java:", testRunnerCode.substring(0, 200) + "...");
        // Run Docker container with security constraints
        const dockerCommand = [
            "docker", "run", "--rm",
            "--network", "none",
            `--cpus=${actualLimits.cpu}`,
            `--memory=${actualLimits.memoryMb}m`,
            "--pids-limit=256",
            "--security-opt=no-new-privileges",
            "--cap-drop=ALL",
            "--read-only",
            "--tmpfs", "/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--tmpfs", "/var/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--user", "1000:1000",
            "--workdir", "/work",
            "-v", `${tempDir}:/work:rw`,
            "eclipse-temurin:21-jdk",
            "sh", "-c",
            `"javac Solution.java TestRunner.java && java TestRunner"`
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
            maxBuffer: actualLimits.outputLimitBytes * 2, // Allow some buffer for overhead
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
                    await execAsync(`docker ps -q --filter "ancestor=eclipse-temurin:21-jdk" | head -1 | xargs -r docker kill 2>/dev/null || true`);
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
                    result.passed = testOutput.passed !== undefined ? testOutput.passed : result.tests.every((t) => t.passed);
                }
                else {
                    result.passed = false;
                }
            }
            catch (parseError) {
                result.passed = false;
                result.tests = [{
                        name: "parsing",
                        passed: false,
                        expected: "valid JSON",
                        actual: "parse error",
                        stderr: String(parseError),
                    }];
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
async function runJavaProjectInDocker(files, testSuite, limits) {
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
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "opencamp-"));
        // Set permissions on temp directory
        await fs.chmod(tempDir, 0o777);
        // Write all Java files respecting paths
        for (const file of files) {
            const filePath = path.join(tempDir, file.path);
            const fileDir = path.dirname(filePath);
            // Create directory if it doesn't exist
            await fs.mkdir(fileDir, { recursive: true });
            await fs.writeFile(filePath, file.content);
            await fs.chmod(filePath, 0o644);
        }
        // Generate and write TestRunner.java
        const testRunnerCode = (0, testRunnerGenerator_1.generateTestRunner)(testSuite);
        const testRunnerPath = path.join(tempDir, "TestRunner.java");
        await fs.writeFile(testRunnerPath, testRunnerCode);
        await fs.chmod(testRunnerPath, 0o644);
        console.log("Generated TestRunner.java:", testRunnerCode.substring(0, 200) + "...");
        // Find all .java files
        const javaFiles = [];
        async function findJavaFiles(dir) {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    await findJavaFiles(fullPath);
                }
                else if (entry.isFile() && entry.name.endsWith(".java")) {
                    javaFiles.push(fullPath.substring(tempDir.length + 1)); // Relative path
                }
            }
        }
        await findJavaFiles(tempDir);
        console.log("Found Java files:", javaFiles);
        // Run Docker container with security constraints
        const dockerCommand = [
            "docker", "run", "--rm",
            "--network", "none",
            `--cpus=${actualLimits.cpu}`,
            `--memory=${actualLimits.memoryMb}m`,
            "--pids-limit=256",
            "--security-opt=no-new-privileges",
            "--cap-drop=ALL",
            "--read-only",
            "--tmpfs", "/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--tmpfs", "/var/tmp:rw,nosuid,nodev,noexec,size=64m",
            "--user", "1000:1000",
            "--workdir", "/work",
            "-v", `${tempDir}:/work:rw`,
            "eclipse-temurin:21-jdk",
            "sh", "-c",
            `"javac ${javaFiles.join(" ")} && java TestRunner"`
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
                    await execAsync(`docker ps -q --filter "ancestor=eclipse-temurin:21-jdk" | head -1 | xargs -r docker kill 2>/dev/null || true`);
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
                    result.passed = testOutput.passed !== undefined ? testOutput.passed : result.tests.every((t) => t.passed);
                }
                else {
                    result.passed = false;
                }
            }
            catch (parseError) {
                result.passed = false;
                result.tests = [{
                        name: "parsing",
                        passed: false,
                        expected: "valid JSON",
                        actual: "parse error",
                        stderr: String(parseError),
                    }];
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
        return { valid: false, error: `File path too long (max ${MAX_FILE_NAME_LENGTH} characters)` };
    }
    if (pathStr.startsWith("/") || pathStr.includes("..")) {
        return { valid: false, error: "File paths cannot be absolute or contain '..'" };
    }
    const allowedPattern = /^[a-zA-Z0-9_\-/]+\.java$/;
    if (!allowedPattern.test(pathStr)) {
        return { valid: false, error: "Only .java files with alphanumeric names are allowed" };
    }
    return { valid: true };
}
