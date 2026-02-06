# AGENTS.md

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js 16 + React 19 + TypeScript + Convex + Clerk       │
│  Tailwind v4 + shadcn/ui                                    │
└─────────────────────────────────────────────────────────────┘
```

**[Quick Start](#quick-start)** • **[Commands](#common-commands)** • **[Decision Tree](#decision-flowchart)** • **[Examples](#code-examples)** • **[Troubleshooting](#common-issues)**

</div>

---

## TL;DR - The Absolute Essentials

| ✅ DO | ❌ NEVER |
|-------|----------|
| Run `npm run lint && npm test && npm run build` before committing | Run `npm run dev` or `npx convex dev` (causes lock conflicts) |
| Run `npx convex typegen` after schema changes | Write new tests (test suite is locked) |
| Use `"use client"` for interactive components | Use `useUser`/`useAuth` in server components |
| Use `auth()` from `@clerk/nextjs/server` in server components | Modify files in `convex/_generated/` |
| Handle `isLoaded` before accessing Clerk data | Replace real env values with placeholders |

**Component Type Decision:**
- Needs `useState`, `useEffect`, event handlers? → `"use client"`
- Just renders data, no interactivity? → Server Component (default)

**File Locations:**
- Pages: `app/[route]/page.tsx`
- UI Components: `components/ui/`
- App Components: `components/`
- Convex Functions: `convex/[feature].ts`
- Auth Proxy: `proxy.ts`

---

## Quick Start

```bash
# First time
npm install

# Before every commit
npm run lint && npm test && npm run build

# After Convex schema changes
npx convex typegen
```

---

## Project Snapshot

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Runtime | Node.js 20+ |
| Package Manager | npm |
| Auth | Clerk with `proxy.ts` (Node.js, not Edge middleware) |
| Backend | Convex (real-time, type-safe) |
| UI | Tailwind CSS v4 + shadcn/ui (claymorphism theme) |
| Test Framework | Vitest + React Testing Library |
| Linting | eslint-config-next |

### Directory Structure

```
app/                    # App Router routes
├── [route]/
│   ├── page.tsx       # Route pages
│   └── layout.tsx     # Route layouts
├── layout.tsx         # Root layout
└── globals.css        # Theme variables

components/
├── ui/                # shadcn/ui components (don't modify directly)
└── [components].tsx   # App-specific components

convex/
├── schema.ts          # Database schema
├── auth.config.ts     # Clerk auth config
├── _generated/        # Auto-generated types (DON'T EDIT)
└── [feature].ts       # Queries, mutations, actions

proxy.ts               # Clerk auth proxy (Node.js runtime)
public/                # Static assets
```

---

## Critical Rules

### 🚨 NEVER Run Dev Server
- **Never** run `npm run dev` or `npx convex dev` — managed separately
- Dev server causes file lock conflicts
- Verify changes with `npm test`, not by running dev server

### 🧪 NEVER Write New Tests
- Test suite is maintained separately
- **Only run existing tests:** `npm test`, `npm run test:watch`
- Do not modify test files or add new test cases

### 🔐 Auth Architecture
- **Server Components:** Use `auth()` from `@clerk/nextjs/server`
- **Client Components:** Use `useUser`, `useAuth` from `@clerk/nextjs`
- **Always** check `isLoaded` before accessing user data
- Route protection happens in `proxy.ts` (Node.js runtime, not Edge middleware)

### ⚠️ Environment Variables
- **CRITICAL:** Never replace real values with placeholders in `.env.local`
- Public vars need `NEXT_PUBLIC_` prefix
- `AUTH_SECRET` goes in Convex dashboard, not `.env.local`
- Keep secrets out of git

---

## Decision Flowchart

```
Starting a task?
│
├─→ Creating/editing a component
│   │
│   ├─→ Needs user interaction? (buttons, forms, useState, useEffect)
│   │   └─→ YES → "use client" at top
│   │             Use Clerk hooks (useUser, useAuth)
│   │             Use Convex useQuery/useMutation
│   │
│   └─→ NO → Server Component (default, no directive)
│            Use auth() from @clerk/nextjs/server
│            Pass data as props to client components
│
├─→ Creating a Convex function?
│   ├─→ Read data? → defineQuery in convex/*.ts
│   ├─→ Write data? → defineMutation in convex/*.ts
│   └─→ External API? → defineAction in convex/*.ts
│
└─→ Before committing?
    └─→ ALWAYS: npm run lint && npm test && npm run build
```

---

## Common Commands

### Development
```bash
npm install                   # Install dependencies
npm run lint                  # Check linting
npm run lint -- --fix         # Auto-fix linting issues
npm test                      # Run all tests
npm run test:watch            # Watch mode
npm run test:coverage         # Coverage report
npm run build                 # Build production (validate before commit)
```

### Convex
```bash
npx convex typegen            # Generate types (after schema changes)
npx convex deploy             # Deploy with migrations
npx shadcn@latest add <comp>  # Add shadcn component
```

### Testing
```bash
npx vitest run <path>         # Run single test file
npx vitest run -t "test name" # Run specific test
```

**Coverage Requirements:** 70% lines/functions/statements, 60% branches

---

## Code Style

### Formatting
- 2-space indentation
- Keep semicolons
- Prefer double quotes in TS/TSX
- Match existing style in the file you edit

### Imports
```tsx
// Order: external → absolute → relative
import { useUser } from "@clerk/nextjs";           // External
import { useQuery } from "convex/react";           // External
import { api } from "@/convex/_generated/api";     // Absolute
import { Button } from "@/components/ui/button";   // Absolute
import { helper } from "./utils";                   // Relative
```

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `ConvexClientProvider` |
| Hooks | useX | `useLocalStorage` |
| Variables/functions | camelCase | `getUserData` |
| Constants | UPPER_SNAKE_CASE | `API_TIMEOUT` |
| App files | Next.js convention | `page.tsx`, `layout.tsx` |
| Convex files | kebab-case | `user-tasks.ts` |

### TypeScript
- Avoid `any` and unsafe type assertions
- Prefer inference for obvious types; annotate when ambiguous
- Use `type` aliases for props
- Use `ReactNode` for children
- Do not edit `convex/_generated` files

### React & Next.js
- Prefer server components; add `'use client'` only when needed
- Only use Clerk hooks in client components
- Use `next/link` for navigation, `next/image` for images
- Avoid `useEffect` for data fetching (use Convex)

### Data & State
- Handle loading states: `tasks === undefined` means loading
- Use Convex `useQuery` in client components only
- Show empty states when arrays have length 0
- Avoid fetching in layout unless necessary

### Styling
- Use Tailwind utility classes
- Use shadcn/ui components from `components/ui/`
- Prefer CSS variables in `app/globals.css` over hard-coded colors
- Avoid inline styles (except for dynamic values)

### Performance
- Keep bundle sizes under 200KB per route
- Use `next/image` with proper sizing
- Minimize client-side JS; prefer server components
- Debounce expensive operations (search, resize)

---

## Code Examples

### Server Component
```tsx
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return <div>Please sign in</div>;
  
  return (
    <div className="p-4">
      <h1>Dashboard</h1>
    </div>
  );
}
```

### Client Component
```tsx
"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UserProfile() {
  const { user, isLoaded } = useUser();
  const profile = useQuery(api.users.getProfile, { userId: user?.id });

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div className="p-4"><h1>{profile?.name}</h1></div>;
}
```

### Convex Query
```tsx
import { defineQuery } from "convex/server";
import { v } from "convex/values";

export const getTasks = defineQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});
```

### Convex Mutation
```tsx
import { defineMutation } from "convex/server";
import { v } from "convex/values";

export const createTask = defineMutation({
  args: { title: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      title: args.title,
      userId: args.userId,
      completed: false,
    });
  },
});
```

### Loading State Pattern
```tsx
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function TaskList() {
  const tasks = useQuery(api.tasks.list);

  if (tasks === undefined) 
    return <div className="animate-pulse">Loading...</div>;
  
  if (tasks.length === 0) 
    return <div className="text-gray-500">No tasks yet</div>;

  return (
    <ul>
      {tasks.map((task) => <li key={task._id}>{task.title}</li>)}
    </ul>
  );
}
```

---

## Common Tasks

| Task | How To |
|------|--------|
| Add shadcn component | `npx shadcn@latest add <component>` |
| Add new route | Create `app/<route>/page.tsx` |
| Protect routes | Update `proxy.ts` matchers |
| Update theme | Edit `app/globals.css` variables |
| Add Convex function | Create `convex/<feature>.ts` |
| Deploy Convex | `npx convex deploy` (auto-runs migrations) |

---

## Before You Edit Checklist

1. **Read** the target file to understand context
2. **Read** 2-3 similar files to understand conventions  
3. **Check** imports and dependencies
4. **Verify** correct directory location
5. **Run** `npm run lint && npm test` after changes

**Ask for help when:**
- Multiple valid approaches exist in codebase
- Pattern conflicts with general best practices
- Need to add new dependency
- Modifying generated files
- Change spans auth + UI + data

---

## Environment Variables

**Local:** `.env.local` (never commit)

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# AUTH_SECRET → Set in Convex dashboard, NOT here
```

---

## Architecture

### Data Flow
```
Client → Next.js App Router → Clerk Auth Check (proxy.ts)
                     ↓
            Convex Server Functions
                     ↓
              Convex Database
                     ↓
         Real-time Subscriptions → React Components
```

### Key Principles
- **Server Components by default** — client components only for interactivity
- **All data fetching through Convex** — no direct DB connections
- **Authentication at proxy.ts** — Clerk middleware in Node.js runtime
- **UI components in components/ui/** — shadcn pattern, extend via composition

### proxy.ts vs middleware.ts

| Feature | middleware.ts (deprecated) | proxy.ts (current) |
|---------|---------------------------|-------------------|
| Runtime | Edge (limited APIs) | Node.js (full APIs) |
| Use case | Simple redirects | Complex auth logic |
| Pattern | `export const middleware` | Named exports |

**Why proxy.ts?** Clerk recommends it, better JWT verification, easier debugging.

---

## Common Issues

### Build Errors
| Error | Solution |
|-------|----------|
| Module not found | Run `npm install` |
| Cannot read properties of undefined | Check Convex query undefined handling |
| NextRouter not mounted | Only use `useRouter` in client components |

### Convex Errors
| Error | Solution |
|-------|----------|
| AUTH_SECRET not set | Configure in Convex dashboard |
| Action without authentication | Check Clerk auth state |
| Document not found | Verify document IDs |
| Type errors after schema | Run `npx convex typegen` |

### Clerk Errors
| Error | Solution |
|-------|----------|
| clerkMiddleware not defined | Check imports from `@clerk/nextjs/server` |
| User not authenticated | Check `isLoaded` before accessing user |
| Invalid publishable key | Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |

### Linting Errors
| Error | Solution |
|-------|----------|
| Missing semicolon | Add semicolons |
| Unused variable | Remove or prefix with `_` |
| Import order | Reorder: external → absolute → relative |

---

## Git Workflow

| Item | Rule |
|------|------|
| Main branch | `main` (production-ready) |
| Feature branches | `feature/description`, `fix/description` |
| Commits | Conventional: `feat:`, `fix:`, `docs:`, `refactor:` |
| PRs | Required for all changes to main |
| Pre-commit | `npm run lint` runs via husky |

---

## CI/CD Pipeline

- **CI:** Runs on every PR (lint, TypeScript, tests, build)
- **Coverage:** Must pass 70% lines, 60% branches
- **Deploy:** Auto-deploy to Vercel + Convex on merge to main

---

## Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Convex Docs](https://docs.convex.dev)
- [Clerk Docs](https://clerk.com/docs)
- [Tailwind v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

## First Time Setup Checklist

- [ ] Run `npm install`
- [ ] Create `.env.local` with required vars (don't commit)
- [ ] Run `npm run lint && npm test` to verify setup
- [ ] Review code patterns in your target area
- [ ] Check `SETUP_COMPLETE.md` for detailed setup notes

---

<div align="center">

**Need help?** Check [Common Issues](#common-issues) or refer to [External Resources](#resources)

</div>
