"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function GitPullRequestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

export function HeroSection() {
  const heroStats = [
    { label: "Practice library", value: "200+ guided exercises" },
    { label: "Execution model", value: "Real tests in sandbox" },
    { label: "Proof of progress", value: "Public verification codes" },
  ];

  const heroRunChecks = [
    { step: "Compile", result: "clean build" },
    { step: "Unit tests", result: "7/7 passing" },
    { step: "Runtime", result: "container isolated" },
  ];

  return (
    <section className="relative isolate w-full overflow-hidden py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-grid-overlay absolute inset-0" />
        <div className="hero-orb hero-orb-primary absolute -top-24 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="hero-orb hero-orb-secondary absolute right-0 top-28 h-80 w-80 translate-x-1/3 rounded-full blur-[120px]" />
        <div className="hero-orb hero-orb-tertiary absolute bottom-0 left-0 h-72 w-72 -translate-x-1/4 translate-y-1/3 rounded-full blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
          <div className="relative">
            <div className="fade-in-up inline-flex items-center gap-3 rounded-full border border-[var(--hero-chip-border)] bg-[var(--hero-chip-bg)] px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-[var(--text-3)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)] shadow-[0_0_0_4px_var(--success-muted)] hero-pulse-dot" />
              Java track live in beta
            </div>

            <h1 className="fade-in-up-delay-1 mt-6 max-w-2xl font-[var(--font-display)] text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-[var(--text-1)] sm:text-5xl md:text-6xl lg:text-[4.1rem]">
              Build shipping instincts, not tutorial confidence.
            </h1>

            <p className="fade-in-up-delay-2 mt-6 max-w-xl text-base leading-relaxed text-[var(--text-3)] sm:text-lg">
              OpenCamp gives every lesson a real runtime. Write code, execute isolated tests, compare approaches with community feedback, and earn progress records that can be verified.
            </p>

            <div className="fade-in-up-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <SignedOut>
                <Link
                  href="/sign-up"
                  className="hero-primary-cta inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-base font-semibold text-slate-950 transition-all duration-300"
                >
                  Start learning
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/learn"
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[color:rgba(255,255,255,0.02)] px-7 py-3.5 text-base font-medium text-[var(--text-2)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--text-1)]"
                >
                  Explore curriculum
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/learn"
                  className="hero-primary-cta inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-base font-semibold text-slate-950 transition-all duration-300"
                >
                  Continue learning
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[color:rgba(255,255,255,0.02)] px-7 py-3.5 text-base font-medium text-[var(--text-2)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--text-1)]"
                >
                  Open projects
                </Link>
              </SignedIn>
            </div>

            <div className="fade-in-up-delay-4 mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[var(--hero-chip-border)] bg-[var(--hero-chip-bg)] px-4 py-3"
                >
                  <p className="text-[0.68rem] uppercase tracking-[0.15em] text-[var(--text-4)]">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--text-1)] sm:text-[0.92rem]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in-up-delay-2 relative mx-auto w-full max-w-xl">
            <div className="hero-preview-shell relative overflow-hidden rounded-[1.8rem] border border-[var(--hero-panel-border)] bg-[color:rgba(5,11,22,0.94)] bg-[image:var(--hero-panel-bg)] p-4 shadow-[var(--hero-panel-shadow)] sm:p-5">
              <div className="hero-scanline absolute inset-0" />
              <div className="relative flex items-center justify-between rounded-xl border border-[var(--hero-chip-border)] bg-[color:rgba(255,255,255,0.02)] px-4 py-3">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-4)]">
                    Mission Control
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--text-1)]">Java Foundations / Functions</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--success)]/30 bg-[var(--success-muted)] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[var(--success)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--success)] hero-pulse-dot" />
                  runtime active
                </span>
              </div>

              <div className="relative mt-4 space-y-4">
                <article className="rounded-xl border border-[var(--hero-chip-border)] bg-[color:rgba(0,0,0,0.32)] p-4">
                  <div className="flex items-center justify-between text-xs text-[var(--text-4)]">
                    <span>Lesson progress</span>
                    <span>12/18 complete</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-[var(--text-1)]">Write reliable branching logic</h3>
                  <div className="mt-3 h-2 rounded-full bg-[color:rgba(255,255,255,0.09)]">
                    <div className="h-2 w-[68%] rounded-full bg-gradient-to-r from-[var(--accent-strong)] to-[var(--success)]" />
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-3)]">Next checkpoint: edge case handling and guard clauses.</p>
                </article>

                <article className="rounded-xl border border-[var(--hero-chip-border)] bg-[color:rgba(0,0,0,0.4)] p-4 font-mono text-xs text-[var(--text-2)]">
                  <div className="flex items-center justify-between text-[0.7rem] text-[var(--text-4)]">
                    <span>challenge/maxPairSum.java</span>
                    <span>run #2481</span>
                  </div>
                  <pre className="mt-3 overflow-x-auto whitespace-pre text-[0.78rem] leading-relaxed">
{`public int maxPairSum(int a, int b) {
  return a > b ? a : b;
}`}
                  </pre>
                </article>

                <article className="rounded-xl border border-[var(--hero-chip-border)] bg-[color:rgba(8,13,21,0.7)] px-4 py-3">
                  <div className="mb-2 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-4)]">
                    execution checks
                  </div>
                  <ul className="space-y-2">
                    {heroRunChecks.map((check) => (
                      <li key={check.step} className="flex items-center justify-between text-xs text-[var(--text-2)]">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                          {check.step}
                        </span>
                        <span className="text-[var(--success)]">{check.result}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>

            <div className="hero-floating-chip hero-float-slow pointer-events-none absolute -left-4 top-8 hidden items-center gap-2 rounded-full border border-[var(--hero-chip-border)] bg-[var(--hero-chip-bg)] px-3 py-2 text-xs text-[var(--text-2)] md:inline-flex">
              <ShieldIcon className="h-4 w-4 text-[var(--success)]" />
              Isolated execution
            </div>
            <div className="hero-floating-chip hero-float-slower pointer-events-none absolute -right-5 bottom-12 hidden items-center gap-2 rounded-full border border-[var(--hero-chip-border)] bg-[var(--hero-chip-bg)] px-3 py-2 text-xs text-[var(--text-2)] sm:inline-flex">
              <UsersIcon className="h-4 w-4 text-[var(--accent)]" />
              Community reviewed
            </div>
            <div className="hero-floating-chip hero-float-slow pointer-events-none absolute left-1/2 top-full mt-3 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--hero-chip-border)] bg-[var(--hero-chip-bg)] px-3 py-2 text-xs text-[var(--text-2)] lg:inline-flex">
              <StarIcon className="h-4 w-4 text-[var(--warning)]" />
              Verifiable certificates
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const featureUtilityCards = [
  {
    icon: UsersIcon,
    title: "Community Discussions",
    description: "Get unstuck faster with accepted answers, peer examples, and decision-focused threads.",
    tag: "Guided support",
  },
  {
    icon: GitPullRequestIcon,
    title: "Contribution Workflow",
    description: "Improve lessons through reviewed contributions so quality climbs with every release.",
    tag: "Versioned reviews",
  },
  {
    icon: FolderIcon,
    title: "Multi-File Projects",
    description: "Train on project structure, not toy snippets, and practice real engineering workflows.",
    tag: "Portfolio-ready",
  },
];

const executionChecks = [
  { label: "Compile", detail: "1.2s clean build" },
  { label: "Tests", detail: "7/7 passing" },
  { label: "Runtime", detail: "No network, strict limits" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative isolate w-full overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="features-grid-overlay absolute inset-0" />
        <div className="features-glow features-glow-one absolute -left-20 top-20 h-80 w-80 rounded-full blur-[120px]" />
        <div className="features-glow features-glow-two absolute -right-28 bottom-8 h-96 w-96 rounded-full blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--feature-chip-border)] bg-[var(--feature-chip-bg)] px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.17em] text-[var(--text-3)]">
              <TerminalIcon className="h-3.5 w-3.5 text-[var(--accent)]" />
              Learning command grid
            </div>
            <h2 className="mt-5 max-w-3xl font-[var(--font-display)] text-3xl font-semibold leading-tight tracking-[-0.02em] text-[var(--text-1)] sm:text-4xl md:text-5xl">
              Everything you need to master programming
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-3)] sm:text-lg">
              OpenCamp combines execution, review, and progression into one workflow, so every study session produces evidence that you can actually ship.
            </p>
          </div>

          <ul className="grid gap-2.5 text-sm text-[var(--text-2)]">
            {[
              "Run real tests in an isolated sandbox.",
              "Track progression with objective checkpoints.",
              "Share verifiable outcomes, not screenshots.",
            ].map((proof) => (
              <li
                key={proof}
                className="inline-flex items-start gap-2 rounded-lg border border-[var(--feature-chip-border)] bg-[var(--feature-chip-bg)] px-3.5 py-2.5"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                {proof}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-5">
          <article className="feature-card feature-card-flagship fade-in-up-delay-1 rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <span className="feature-icon-wrap">
                  <TerminalIcon className="h-5 w-5 text-[var(--accent)]" />
                </span>
                <span className="feature-rail-chip">Real Test Execution</span>
              </div>
              <span className="rounded-full border border-[var(--success)]/30 bg-[var(--success-muted)] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.13em] text-[var(--success)]">
                Runtime online
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-semibold text-[var(--text-1)]">
              Ship code under real constraints from day one
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-3)] sm:text-base">
              Every challenge runs in isolated containers with deterministic test output, so your practice matches production expectations instead of local-only assumptions.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="rounded-2xl border border-[var(--feature-card-border)] bg-[color:rgba(0,0,0,0.42)] p-4">
                <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.13em] text-[var(--text-4)]">
                  <span>challenge/sumPairs.java</span>
                  <span>run #2483</span>
                </div>
                <pre className="feature-terminal mt-3 overflow-x-auto whitespace-pre text-[0.79rem] text-[var(--text-2)]">
{`public int sumPairs(int[] nums) {
  int sum = 0;
  for (int value : nums) sum += value;
  return sum;
}`}
                </pre>
              </div>

              <div className="rounded-2xl border border-[var(--feature-card-border)] bg-[color:rgba(4,11,22,0.68)] p-4">
                <p className="text-[0.67rem] uppercase tracking-[0.14em] text-[var(--text-4)]">
                  Execution report
                </p>
                <ul className="mt-3 space-y-2.5">
                  {executionChecks.map((check) => (
                    <li key={check.label} className="flex items-center justify-between text-xs text-[var(--text-2)]">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                        {check.label}
                      </span>
                      <span className="text-[var(--success)]">{check.detail}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-lg border border-[var(--feature-chip-border)] bg-[var(--feature-chip-bg)] px-3 py-2 text-xs text-[var(--text-3)]">
                  Output is reproducible for learners, reviewers, and certificates.
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <article className="feature-card fade-in-up-delay-2 rounded-3xl p-5">
              <div className="inline-flex items-center gap-2">
                <span className="feature-icon-wrap">
                  <CodeIcon className="h-5 w-5 text-[var(--accent)]" />
                </span>
                <span className="feature-rail-chip">Language-Agnostic Tracks</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text-1)]">
                Learn one pattern, apply it across stacks
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-3)]">
                Curriculum structure stays consistent while language implementations evolve from Java to additional tracks.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-2)]">
                <span className="rounded-full border border-[var(--feature-chip-border)] bg-[var(--feature-chip-bg)] px-3 py-1.5">Java live</span>
                <span className="rounded-full border border-[var(--feature-chip-border)] bg-[var(--feature-chip-bg)] px-3 py-1.5">Python queued</span>
                <span className="rounded-full border border-[var(--feature-chip-border)] bg-[var(--feature-chip-bg)] px-3 py-1.5">Go queued</span>
              </div>
            </article>

            <article className="feature-card fade-in-up-delay-3 rounded-3xl p-5">
              <div className="inline-flex items-center gap-2">
                <span className="feature-icon-wrap">
                  <TrophyIcon className="h-5 w-5 text-[var(--warning)]" />
                </span>
                <span className="feature-rail-chip">Progress & Certificates</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text-1)]">
                Turn study sessions into verifiable proof
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-3)]">
                Completion is tied to passing checkpoints, then anchored to certificate codes anyone can verify.
              </p>
              <div className="mt-4 rounded-xl border border-[var(--feature-card-border)] bg-[color:rgba(0,0,0,0.34)] p-3">
                <div className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-4)]">
                  <span>Track completion</span>
                  <span>67%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[color:rgba(255,255,255,0.1)]">
                  <div className="h-2 w-[67%] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--success)]" />
                </div>
                <p className="mt-2 text-xs text-[var(--text-3)]">Next milestone unlocks certificate verification.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {featureUtilityCards.map((feature, index) => (
            <article
              key={feature.title}
              className="feature-card fade-in-up-delay-4 rounded-2xl p-5"
              style={{ animationDelay: `${320 + index * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="feature-icon-wrap">
                  <feature.icon className="h-5 w-5 text-[var(--accent)]" />
                </span>
                <span className="rounded-full border border-[var(--feature-chip-border)] bg-[var(--feature-chip-bg)] px-2.5 py-1 text-[0.63rem] uppercase tracking-[0.12em] text-[var(--text-3)]">
                  {feature.tag}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--text-1)]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-3)]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[var(--feature-chip-border)] bg-[var(--feature-chip-bg)] px-5 py-4 text-sm text-[var(--text-2)] sm:flex sm:items-center sm:justify-between">
          <p>Every module in this grid is designed to move you from syntax knowledge to shipping confidence.</p>
          <Link
            href="/learn"
            className="mt-3 inline-flex items-center gap-2 font-medium text-[var(--accent)] transition-colors hover:text-[var(--text-1)] sm:mt-0"
          >
            Open learning tracks
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const workflowSteps = [
  {
    number: "01",
    title: "Choose your route",
    description: "Select a guided track matched to your level so every next lesson has context.",
    proof: "Clear milestones and prerequisites from the first click.",
    signal: "Track planning",
    icon: CodeIcon,
    animationClass: "fade-in-up-delay-1",
  },
  {
    number: "02",
    title: "Execute and iterate",
    description: "Run code in isolated containers, review feedback, and improve until tests are consistently green.",
    proof: "Deterministic execution reports on every challenge run.",
    signal: "Sandbox runtime",
    icon: TerminalIcon,
    animationClass: "fade-in-up-delay-2",
  },
  {
    number: "03",
    title: "Verify your progress",
    description: "Convert completed milestones into auditable achievements you can share with confidence.",
    proof: "Certificate verification codes tied to real checkpoints.",
    signal: "Outcome proof",
    icon: TrophyIcon,
    animationClass: "fade-in-up-delay-3",
  },
];

export function HowItWorksSection() {
  return (
    <section id="workflow" className="relative isolate w-full overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="how-grid-overlay absolute inset-0" />
        <div className="how-glow how-glow-one absolute -left-24 top-1/3 h-80 w-80 rounded-full blur-[120px]" />
        <div className="how-glow how-glow-two absolute -right-28 bottom-14 h-96 w-96 rounded-full blur-[135px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--how-chip-border)] bg-[var(--how-chip-bg)] px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.17em] text-[var(--text-3)]">
            <SparkleIcon className="h-3.5 w-3.5 text-[var(--accent)]" />
            Guided flight path
          </div>
          <h2 className="mt-5 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.02em] text-[var(--text-1)] sm:text-4xl md:text-5xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-3)] sm:text-lg">
            Three focused steps move you from first lesson to verifiable engineering outcomes.
          </p>
        </div>

        <ol className="how-timeline mt-12 grid list-none gap-4 md:grid-cols-3 md:gap-5">
          {workflowSteps.map((step) => (
            <li
              key={step.number}
              className={`flight-step-card ${step.animationClass} rounded-3xl p-5 sm:p-6`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flight-step-number">{step.number}</span>
                <span className="flight-step-badge">{step.signal}</span>
              </div>

              <span className="mt-5 inline-flex rounded-2xl border border-[var(--how-chip-border)] bg-[var(--how-chip-bg)] p-3">
                <step.icon className="h-5 w-5 text-[var(--accent)]" />
              </span>

              <h3 className="mt-4 text-xl font-semibold text-[var(--text-1)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-3)] sm:text-base">
                {step.description}
              </p>
              <p className="mt-4 rounded-xl border border-[var(--how-chip-border)] bg-[var(--how-chip-bg)] px-3 py-2 text-xs text-[var(--text-2)]">
                {step.proof}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            "Track selection in under 2 minutes",
            "Execution feedback on every attempt",
            "Shareable proof after each milestone",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[var(--how-chip-border)] bg-[var(--how-chip-bg)] px-4 py-2.5 text-center text-xs uppercase tracking-[0.12em] text-[var(--text-3)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const trustPillars = [
  {
    icon: ShieldIcon,
    title: "Sandboxed execution",
    description: "All challenge runs happen in isolated containers designed to mirror production constraints.",
    proof: "No outbound network, strict CPU and memory limits, deterministic output.",
    signal: "Runtime integrity",
    animationClass: "fade-in-up-delay-1",
  },
  {
    icon: EyeIcon,
    title: "Auditable progress",
    description: "Your milestones are tied to objective checkpoints instead of subjective completion states.",
    proof: "Every certificate ships with a public verification code and verifiable history.",
    signal: "Proof-first records",
    animationClass: "fade-in-up-delay-2",
  },
  {
    icon: GithubIcon,
    title: "Open-source governance",
    description: "Curriculum quality improves through transparent review from maintainers and contributors.",
    proof: "Discussion, review, and publishing are versioned and inspectable end to end.",
    signal: "Community reviewed",
    animationClass: "fade-in-up-delay-3",
  },
];

export function TrustSection() {
  return (
    <section id="community" className="relative isolate w-full overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="trust-grid-overlay absolute inset-0" />
        <div className="trust-glow trust-glow-one absolute -left-20 top-16 h-72 w-72 rounded-full blur-[115px]" />
        <div className="trust-glow trust-glow-two absolute -right-24 bottom-10 h-[22rem] w-[22rem] rounded-full blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--trust-chip-border)] bg-[var(--trust-chip-bg)] px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.17em] text-[var(--text-3)]">
            <ShieldIcon className="h-3.5 w-3.5 text-[var(--success)]" />
            Trust protocol
          </div>
          <h2 className="mt-5 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.02em] text-[var(--text-1)] sm:text-4xl md:text-5xl">
            Built for trust and safety
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-3)] sm:text-lg">
            Every learning signal in OpenCamp is designed to be secure, explainable, and independently verifiable.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {trustPillars.map((pillar) => (
            <article
              key={pillar.title}
              className={`trust-card ${pillar.animationClass} rounded-3xl p-5 sm:p-6`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="trust-icon-wrap">
                  <pillar.icon className="h-5 w-5 text-[var(--accent)]" />
                </span>
                <span className="trust-signal-chip">{pillar.signal}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text-1)]">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-3)] sm:text-base">
                {pillar.description}
              </p>
              <p className="mt-4 rounded-xl border border-[var(--trust-chip-border)] bg-[var(--trust-chip-bg)] px-3 py-2 text-xs text-[var(--text-2)]">
                {pillar.proof}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            "Isolation enforced on every run",
            "Progress metrics are auditable",
            "Content quality is community reviewed",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[var(--trust-chip-border)] bg-[var(--trust-chip-bg)] px-4 py-2.5 text-center text-xs uppercase tracking-[0.12em] text-[var(--text-3)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const launchChecklist = [
  "Choose a track aligned with your target role.",
  "Complete lessons and pass execution checkpoints.",
  "Share verifiable outcomes with confidence.",
];

export function CTASection() {
  return (
    <section id="certificates" className="relative isolate w-full overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="cta-grid-overlay absolute inset-0" />
        <div className="cta-glow cta-glow-one absolute -left-24 top-20 h-80 w-80 rounded-full blur-[120px]" />
        <div className="cta-glow cta-glow-two absolute -right-24 bottom-8 h-96 w-96 rounded-full blur-[135px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="cta-shell rounded-[2rem] p-6 sm:p-10 lg:p-12">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--cta-chip-border)] bg-[var(--cta-chip-bg)] px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.17em] text-[var(--text-3)]">
                <SparkleIcon className="h-3.5 w-3.5 text-[var(--accent)]" />
                Launch sequence
              </div>
              <h2 className="mt-5 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.02em] text-[var(--text-1)] sm:text-5xl lg:text-6xl">
                Ready to turn practice into proof?
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-3)] sm:text-lg">
                Start free, ship real code, and leave with outcomes people can verify.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-[var(--text-2)]">
                {launchChecklist.map((item) => (
                  <li key={item} className="inline-flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <SignedOut>
                  <Link
                    href="/sign-up"
                    className="cta-primary-btn inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold text-slate-950 transition-all duration-300"
                  >
                    Start learning free
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/learn"
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--cta-chip-border)] bg-[var(--cta-chip-bg)] px-8 py-3.5 text-base font-medium text-[var(--text-2)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--text-1)]"
                  >
                    Browse tracks
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/learn"
                    className="cta-primary-btn inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold text-slate-950 transition-all duration-300"
                  >
                    Continue learning
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center rounded-xl border border-[var(--cta-chip-border)] bg-[var(--cta-chip-bg)] px-8 py-3.5 text-base font-medium text-[var(--text-2)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--text-1)]"
                  >
                    Open projects
                  </Link>
                </SignedIn>
              </div>
            </div>

            <div className="cta-panel rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-1)]">Launch checklist</h3>
                <span className="rounded-full border border-[var(--success)]/30 bg-[var(--success-muted)] px-3 py-1 text-[0.66rem] uppercase tracking-[0.13em] text-[var(--success)]">
                  ready
                </span>
              </div>

              <ol className="mt-4 space-y-3">
                {launchChecklist.map((item, index) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--cta-chip-border)] bg-[var(--cta-chip-bg)] text-[0.7rem] font-semibold text-[var(--text-2)]">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-sm text-[var(--text-2)]">{item}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {["No credit card", "Free forever", "Open source", "Verifiable progress"].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-[var(--cta-chip-border)] bg-[var(--cta-chip-bg)] px-3 py-2 text-center text-xs uppercase tracking-[0.12em] text-[var(--text-3)]"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--cta-chip-border)] bg-[var(--cta-chip-bg)] px-3 py-1.5 text-xs text-[var(--text-3)]">
                <span className="h-2 w-2 rounded-full bg-[var(--success)] hero-pulse-dot" />
                Start in minutes and publish proof as you progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
