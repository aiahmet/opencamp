export interface RunJavaRequest {
  code: string;
  testSuite: JavaTestSuite;
  limits?: {
    cpu?: number;
    memoryMb?: number;
    timeoutMs?: number;
  };
}

export interface RunJavaProjectRequest {
  files: Array<{
    path: string;
    content: string;
  }>;
  testSuite: JavaTestSuite;
  limits?: {
    cpu?: number;
    memoryMb?: number;
    timeoutMs?: number;
  };
}

export interface JavaTestSuite {
  type: string;
  entrypoint: string;
  method: string;
  signature: string;
  tests: Array<{
    input: unknown[];
    output: unknown;
  }>;
}

export interface PythonTestSuite {
  type: "python";
  entrypoint: string;
  function: string;
  tests: Array<{
    input: unknown[];
    output: unknown;
  }>;
}

export interface RunPythonRequest {
  code: string;
  testSuite: PythonTestSuite;
  limits?: {
    cpu?: number;
    memoryMb?: number;
    timeoutMs?: number;
  };
}

export interface RunPythonProjectRequest {
  files: Array<{
    path: string;
    content: string;
  }>;
  testSuite: PythonTestSuite;
  limits?: {
    cpu?: number;
    memoryMb?: number;
    timeoutMs?: number;
  };
}

export interface RunJavaResponse {
  passed: boolean;
  compile: {
    ok: boolean;
    stderr?: string;
  };
  tests: Array<{
    name: string;
    passed: boolean;
    expected: unknown;
    actual: unknown;
    stderr?: string;
  }>;
  stdout?: string;
  stderr?: string;
  timingMs: number;
  outputTruncated?: boolean;
}

export interface HealthResponse {
  ok: true;
}
