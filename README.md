# OpenCamp

A modern learning platform for programming challenges built with Next.js 16, Convex, Clerk, and Docker.

## Prerequisites

- Node.js (v18 or higher)
- Docker (installed and running)
- npm

## Getting Started

### Environment Setup

1. Copy `.env.local.example` to `.env.local` (if available) or create `.env.local` with:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_convex_deployment

# Runner Service
RUNNER_URL=http://localhost:4001
```

2. Install dependencies:

```bash
npm install
```

3. Install runner dependencies:

```bash
cd runner && npm install
```

### Starting the Application

You need to run two separate terminals:

**Terminal 1: Next.js + Convex**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

**Terminal 2: Runner Service**

```bash
npm run dev:runner
```

The runner service will start on [http://localhost:4001](http://localhost:4001).

### Local Runner Service

The runner service executes Java code in isolated Docker containers with:

- No network access (`--network none`)
- CPU limits (0.5 cores)
- Memory limits (256MB)
- 10 second timeout
- Security hardening (no privileges, capabilities dropped)

**Runner Endpoints:**

- `POST /health` - Health check
- `POST /run/java` - Execute Java code with test suite

### Database Seeding

To seed the database with sample curriculum data:

```bash
npx convex run seed
```

This creates:
- Java language
- Java Fundamentals track
- Basics module
- Variables & Types lesson
- Add Two Numbers challenge

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── learn/             # Learning pages
│   └── api/               # API routes
├── components/            # React components
│   └── challenges/        # Challenge-specific components
├── convex/                # Convex backend
│   ├── schema.ts         # Database schema
│   ├── execution.ts       # Code execution actions
│   ├── submissions.ts     # Submission logic
│   ├── progress.ts       # Progress tracking
│   └── drafts.ts         # Draft autosave
├── runner/                # Docker execution service
│   └── src/               # Runner source code
└── public/                # Static assets
```

## Development

### Running Tests

The challenge page provides a "Run" button that:

1. Saves your code as a draft
2. Submits it to the runner service
3. Executes in a Docker container
4. Shows test results and compilation errors

### Code Execution Flow

1. User clicks "Run" in UI
2. Convex creates submission record (queued → running)
3. Convex action calls runner service
4. Runner executes Java in Docker container
5. Runner returns test results
6. Convex patches submission with results
7. UI refreshes to show pass/fail status

## Deployment

This project uses:
- [Vercel](https://vercel.com) for Next.js hosting
- [Convex Cloud](https://convex.dev) for backend
- Docker-compatible runner (requires Docker support)

## Learn More

- [Next.js Documentation](https://nextjs.org)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Docker Documentation](https://docs.docker.com)
