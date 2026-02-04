# Codebase Quality Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all identified issues in the codebase including critical security vulnerabilities, bugs, poor implementations, and code quality issues.

**Architecture:** Systematic fixes across multiple layers - frontend (React/Next.js), backend (Convex), runner service (Docker execution), and API routes (Clerk webhooks). Each fix is atomic and independently testable.

**Tech Stack:** Next.js 15, React, Convex, Clerk, Docker, TypeScript, Node.js

---

## Task 1: Fix Environment Variable Validation (Critical)

**Files:**
- Modify: `app/providers.tsx:1-26`

**Step 1: Write test/fail expectation**

The issue: `process.env.NEXT_PUBLIC_CONVEX_URL!` uses non-null assertion without validation.

**Step 2: Fix environment variable handling**

Replace the entire file content with:

```typescript
"use client";

import { useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_CONVEX_URL. " +
    "Please set it in your .env.local file."
  );
}

let convexClient: ConvexReactClient | undefined;

function getConvexClient(): ConvexReactClient {
  if (!convexClient) {
    convexClient = new ConvexReactClient(CONVEX_URL);
  }
  return convexClient;
}

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useMemo(() => getConvexClient(), []);

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
```

**Step 3: Verify build succeeds**

Run: `npm run build`
Expected: BUILD succeeds

**Step 4: Commit**

```bash
git add app/providers.tsx
git commit -m "fix(providers): add proper env var validation instead of non-null assertion"
```

---

## Task 2: Add Error Handling to Clerk Webhook (High)

**Files:**
- Modify: `app/api/webhook/clerk/route.ts:72-91`

**Step 1: Add error handling for user sync operations**

Replace the user sync block (lines 72-83) with:

```typescript
  if (eventType === "user.created" || eventType === "user.updated") {
    try {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Add null check for email_addresses
      if (!email_addresses || email_addresses.length === 0) {
        console.error("User has no email addresses:", id);
        return new Response("User has no email addresses", { status: 400 });
      }

      const email = email_addresses[0]?.email_address;
      if (!email) {
        console.error("Primary email is missing:", id);
        return new Response("Primary email is missing", { status: 400 });
      }

      const name = `${first_name || ""} ${last_name || ""}`.trim() || undefined;

      await convex.mutation(api.users.syncUser, {
        clerkUserId: id,
        email,
        name,
        imageUrl: image_url,
      });
    } catch (error) {
      console.error("Failed to sync user:", error);
      // Return 200 to prevent Clerk from retrying indefinitely
      return new Response("User sync failed", { status: 200 });
    }
  }
```

**Step 2: Add error handling for user deletion**

Replace the user deletion block (lines 85-91) with:

```typescript
  if (eventType === "user.deleted") {
    try {
      const { id } = evt.data;
      await convex.mutation(api.users.deleteUser, {
        clerkUserId: id,
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Return 200 to prevent Clerk from retrying indefinitely
      return new Response("User deletion failed", { status: 200 });
    }
  }
```

**Step 3: Verify types are correct**

Run: `npx tsc --noEmit`
Expected: NO type errors

**Step 4: Commit**

```bash
git add app/api/webhook/clerk/route.ts
git commit -m "fix(webhook): add error handling and null checks for user sync"
```

---

## Task 3: Make Docker Resource Limits Configurable (Medium)

**Files:**
- Modify: `runner/src/dockerExecutor.ts:31-36`
- Modify: `runner/src/index.ts:1-16`

**Step 1: Extract constants to environment variables**

Add after line 36 in `runner/src/dockerExecutor.ts`:

```typescript
// Read limits from environment variables with defaults
const getConfiguredLimits = (): typeof DEFAULT_LIMITS => ({
  cpu: parseFloat(process.env.RUNNER_CPU_LIMITS || "0.5"),
  memoryMb: parseInt(process.env.RUNNER_MEMORY_MB || "256", 10),
  timeoutMs: parseInt(process.env.RUNNER_TIMEOUT_MS || "10000", 10),
  outputLimitBytes: parseInt(process.env.RUNNER_OUTPUT_LIMIT_BYTES || "262144", 10),
});
```

**Step 2: Update functions to use configured limits**

Update both `runJavaInDocker` and `runJavaProjectInDocker` to use configured defaults.

Replace line 94 in `runJavaInDocker` and line 266 in `runJavaProjectInDocker`:

```typescript
const actualLimits = { ...getConfiguredLimits(), ...limits };
```

**Step 3: Add environment variable documentation**

Create `runner/.env.example` with:

```env
# Runner Resource Limits
RUNNER_CPU_LIMITS=0.5
RUNNER_MEMORY_MB=256
RUNNER_TIMEOUT_MS=10000
RUNNER_OUTPUT_LIMIT_BYTES=262144
```

**Step 4: Verify runner compiles**

Run: `cd runner && npm run build`
Expected: BUILD succeeds

**Step 5: Commit**

```bash
git add runner/src/dockerExecutor.ts runner/.env.example
git commit -m "feat(runner): make resource limits configurable via env vars"
```

---

## Task 4: Fix Duplicate Kotlin Extension Mapping (Low)

**Files:**
- Modify: `lib/language.ts:42-44`

**Step 1: Fix duplicate key**

Replace the Kotlin entries with:

```typescript
  // Kotlin
  kotlin: ".kt",
  kotlinScript: ".kts",
```

**Step 5: Commit**

```bash
git add lib/language.ts
git commit -m "fix(language): fix duplicate kotlin key, add kotlinScript"
```

---

## Task 5: Remove TODO Comments from Templates (Low)

**Files:**
- Modify: `lib/language.ts:78-106`

**Step 1: Replace TODO placeholders with better templates**

Replace the entire `LANGUAGE_FILE_TEMPLATES` object with:

```typescript
export const LANGUAGE_FILE_TEMPLATES: Record<string, (fileName: string) => string> = {
  python: (fileName) => `# ${fileName}\n\n# Write your code here\n`,
  java: (fileName) => `public class ${fileName} {\n  // Write your code here\n}\n`,
  javascript: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  typescript: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  go: (fileName) => `package main\n\n// ${fileName}\n// Write your code here\n`,
  rust: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  c: (fileName) => `/* ${fileName} */\n\n// Write your code here\n`,
  cpp: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  csharp: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  ruby: (fileName) => `# ${fileName}\n\n# Write your code here\n`,
  php: (fileName) => `<?php\n// ${fileName}\n// Write your code here\n`,
  swift: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  kotlin: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  kotlinScript: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  shell: (fileName) => `#!/bin/bash\n# ${fileName}\n\n# Write your code here\n`,
  powershell: (fileName) => `# ${fileName}\n\n# Write your code here\n`,
  html: (fileName) => `<!-- ${fileName} -->\n\n<!-- Write your code here -->\n`,
  css: (fileName) => `/* ${fileName} */\n\n/* Write your code here */\n`,
  scss: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  less: (fileName) => `/* ${fileName} */\n\n/* Write your code here */\n`,
  json: () => `{\n  \n}\n`,
  xml: (fileName) => `<!-- ${fileName} -->\n\n<!-- Write your code here -->\n`,
  yaml: () => `# Write your configuration here\n`,
  toml: () => `# Write your configuration here\n`,
  markdown: (fileName) => `# ${fileName}\n\n`,
  sql: (fileName) => `-- ${fileName}\n\n-- Write your SQL here\n`,
  dart: (fileName) => `// ${fileName}\n\n// Write your code here\n`,
  plaintext: (fileName) => `// ${fileName}\n\n`,
};
```

**Step 6: Commit**

```bash
git add lib/language.ts
git commit -m "refactor(language): replace TODO comments with generic templates"
```

---

## Task 6: Improve Type Safety in Error Classes (Medium)

**Files:**
- Modify: `convex/lib/errors.ts:13-28`

**Step 1: Define specific detail interfaces**

Add after line 11:

```typescript
interface RateLimitDetails {
  retryAfterMs: number;
}

interface QuotaExceededDetails {
  resetsAtMs: number;
}

type ExecutionLimitDetails = RateLimitDetails | QuotaExceededDetails;
```

**Step 2: Update ExecutionLimitError class**

Replace the `ExecutionLimitError` class with:

```typescript
export class ExecutionLimitError extends Error {
  code: "RATE_LIMITED" | "QUOTA_EXCEEDED";
  details: ExecutionLimitDetails;

  constructor(code: "RATE_LIMITED" | "QUOTA_EXCEEDED", details: ExecutionLimitDetails) {
    super(code === "RATE_LIMITED"
      ? `Rate limit exceeded. Try again in ${Math.ceil((details as RateLimitDetails).retryAfterMs / 1000)}s.`
      : `Daily run limit reached. Resets at ${new Date((details as QuotaExceededDetails).resetsAtMs).toLocaleTimeString()}.`
    );
    this.code = code;
    this.details = details;
    this.name = "ExecutionLimitError";
  }
}
```

**Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: NO type errors

**Step 7: Commit**

```bash
git add convex/lib/errors.ts
git commit -m "refactor(errors): improve type safety with specific detail interfaces"
```

---

## Task 7: Add Input Validation Schema to Runner (Medium)

**Files:**
- Create: `runner/src/validation.ts`
- Modify: `runner/src/index.ts`

**Step 1: Create validation schema**

Create `runner/src/validation.ts`:

```typescript
import { z } from "zod";

export const JavaTestSchema = z.object({
  input: z.array(z.any()),
  output: z.any(),
});

export const JavaTestSuiteSchema = z.object({
  type: z.literal("java"),
  entrypoint: z.string(),
  method: z.string(),
  signature: z.string().optional(),
  tests: z.array(JavaTestSchema),
});

export const RunJavaRequestSchema = z.object({
  code: z.string().max(10000), // 10KB limit
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
  content: z.string().max(50000), // 50KB per file
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

// Python schemas
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
```

**Step 2: Install zod dependency**

Run: `cd runner && npm install zod`
Expected: INSTALL succeeds

**Step 3: Update runner index.ts to use validation**

Update the `/run/java` route handler to:

```typescript
app.post<unknown, RunJavaResponse, unknown>("/run/java", async (req, res) => {
  try {
    const validationResult = RunJavaRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        passed: false,
        compile: { ok: false, stderr: "Invalid request: " + validationResult.error.errors[0].message },
        tests: [],
        timingMs: 0,
      });
      return;
    }

    const { code, testSuite, limits } = validationResult.data;
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
```

**Step 4: Update all other routes similarly**

Apply similar validation to `/run/java-project`, `/run/python`, and `/run/python-project`.

**Step 5: Verify runner compiles**

Run: `cd runner && npm run build`
Expected: BUILD succeeds

**Step 8: Commit**

```bash
git add runner/src/validation.ts runner/src/index.ts runner/package.json runner/package-lock.json
git commit -m "feat(runner): add input validation using Zod"
```

---

## Task 8: Add Default Rate Limiting (High)

**Files:**
- Modify: `app/api/webhook/clerk/route.ts:11-23`

**Step 1: Implement in-memory rate limiting as fallback**

Replace the rate limiter initialization with:

```typescript
// Initialize rate limiter - use in-memory fallback if Redis not configured
let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
  });
} else {
  // Fallback to in-memory rate limiting (not distributed, but better than nothing)
  const inMemoryCache = new Map<string, { count: number; resetAt: number }>();

  ratelimit = {
    async limit(identifier: string) {
      const now = Date.now();
      const windowMs = 60 * 1000; // 1 minute
      const maxRequests = 10;

      const record = inMemoryCache.get(identifier);

      if (!record || now > record.resetAt) {
        inMemoryCache.set(identifier, { count: 1, resetAt: now + windowMs });
        return {
          success: true,
          limit: maxRequests,
          remaining: maxRequests - 1,
          reset: now + windowMs,
        };
      }

      if (record.count >= maxRequests) {
        return {
          success: false,
          limit: maxRequests,
          remaining: 0,
          reset: record.resetAt,
        };
      }

      record.count++;
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - record.count,
        reset: record.resetAt,
      };
    },
  } as unknown as Ratelimit;

  console.warn("Using in-memory rate limiting (not distributed). Configure UPSTASH_REDIS_* for production.");
}
```

**Step 9: Commit**

```bash
git add app/api/webhook/clerk/route.ts
git commit -m "feat(webhook): add in-memory rate limiting as fallback when Redis not configured"
```

---

## Task 9: Update TypeScript Configuration for Better Type Safety (Low)

**Files:**
- Modify: `tsconfig.json`

**Step 1: Enable stricter type checking**

Add or update these compiler options:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Step 2: Fix any resulting type errors**

Run: `npx tsc --noEmit`
Expected: MAY have type errors - fix them one by one

**Step 10: Commit**

```bash
git add tsconfig.json
git commit -m "chore(tsconfig): enable stricter type checking options"
```

---

## Task 10: Split Large Schema File (Medium)

**Files:**
- Create: `convex/schema/users.ts`
- Create: `convex/schema/curriculum.ts`
- Create: `convex/schema/content.ts`
- Create: `convex/schema/social.ts`
- Create: `convex/schema/execution.ts`
- Modify: `convex/schema.ts`

**Step 1: Extract user-related schemas**

Create `convex/schema/users.ts`:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userTables = {
  users: defineTable({
    clerkUserId: v.string(),
    username: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    roles: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_username", ["username"]),
};
```

**Step 2: Extract curriculum schemas**

Create `convex/schema/curriculum.ts` with languages, tracks, modules, curriculumItems, testSuites.

**Step 3: Extract content schemas**

Create `convex/schema/content.ts` with projects, projectWorkspaces, projectProgress.

**Step 4: Extract social schemas**

Create `convex/schema/social.ts` with discussions, comments, votes, moderationEvents.

**Step 5: Extract execution schemas**

Create `convex/schema/execution.ts` with submissions, progress, drafts, trackCompletions, certificates, contributions, contentVersions, rateLimits, executionLogs, usageCounters, limitsConfig.

**Step 6: Update main schema file**

Replace `convex/schema.ts` with:

```typescript
import { defineSchema } from "convex/server";
import { userTables } from "./schema/users";
import { curriculumTables } from "./schema/curriculum";
import { contentTables } from "./schema/content";
import { socialTables } from "./schema/social";
import { executionTables } from "./schema/execution";

export default defineSchema({
  ...userTables,
  ...curriculumTables,
  ...contentTables,
  ...socialTables,
  ...executionTables,
});
```

**Step 11: Commit**

```bash
git add convex/schema.ts convex/schema/
git commit -m "refactor(schema): split large schema file into domain modules"
```

---

## Summary of Changes

After completing all tasks, the following issues will be resolved:

1. **Critical**: Environment variable validation instead of non-null assertions
2. **High**: Error handling in webhook routes with null checks
3. **Medium**: Configurable Docker resource limits
4. **Low**: Fixed duplicate Kotlin key
5. **Low**: Removed TODO comments from templates
6. **Medium**: Improved type safety in error classes
7. **Medium**: Input validation using Zod in runner
8. **High**: Default rate limiting with in-memory fallback
9. **Low**: Stricter TypeScript configuration
10. **Medium**: Split large schema file into modules

---

## Execution Notes

- Each task can be completed independently
- Tasks are ordered by priority (Critical → High → Medium → Low)
- Run `npm run build` and `npm run test` (if tests exist) after each task
- If a task fails, rollback with `git reset --hard HEAD~1` and investigate
- The TODO in `convex/seed.ts:187` is intentional - it's a starter code placeholder for users
