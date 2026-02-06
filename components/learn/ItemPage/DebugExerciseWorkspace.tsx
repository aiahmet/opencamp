"use client";

import { useState, useEffect } from "react";
import CodeEditor from "@/components/challenges/CodeEditor";
import { cn } from "@/lib/utils";
import { Loader2, Save, RotateCcw, CheckCircle2, Bug, Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Doc } from "@/convex/_generated/dataModel";

interface Hint {
  level: number;
  text: string;
}

interface DebugExerciseWorkspaceProps {
  brokenCode: string;
  hints: Hint[];
  languageId: string;
  errorType: "syntax" | "logic" | "design";
  onCodeChange: (code: string) => void;
  onRun: () => void | Promise<void>;
  onReset: () => void | Promise<void>;
  onMarkCompleted: () => void | Promise<void>;
  latestSubmission?: Doc<"submissions"> | null;
  isRunning?: boolean;
  cooldownEnd?: number | null;
  saveStatus?: "idle" | "saving" | "saved";
  error?: { code: string; message: string; retryAfterMs?: number; resetsAtMs?: number } | null;
  usage?: { runsUsed: number; runsLimit: number } | null;
  className?: string;
}

const errorTypeConfig = {
  syntax: {
    icon: AlertCircle,
    label: "Syntax Error",
    color: "text-[var(--danger)]",
    bg: "bg-[var(--danger-muted)]",
    border: "border-[color:rgba(248,113,113,0.4)]",
    description: "The code has grammar or structural issues that prevent compilation.",
  },
  logic: {
    icon: Bug,
    label: "Logic Error",
    color: "text-[var(--warning)]",
    bg: "bg-[var(--warning-muted)]",
    border: "border-[color:rgba(251,191,36,0.4)]",
    description: "The code compiles but produces incorrect results.",
  },
  design: {
    icon: Lightbulb,
    label: "Design Issue",
    color: "text-[var(--accent)]",
    bg: "bg-[var(--accent-muted)]",
    border: "border-[color:rgba(125,211,252,0.4)]",
    description: "The code works but has efficiency, readability, or edge case issues.",
  },
};

export function DebugExerciseWorkspace({
  brokenCode,
  hints,
  languageId,
  errorType,
  onCodeChange,
  onRun,
  onReset,
  onMarkCompleted,
  latestSubmission = null,
  isRunning = false,
  cooldownEnd = null,
  saveStatus = "idle",
  error = null,
  usage = null,
  className,
}: DebugExerciseWorkspaceProps) {
  const [code, setCode] = useState(brokenCode);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCode(brokenCode);
  }, [brokenCode]);

  useEffect(() => {
    if (!cooldownEnd) {
      const resetTimer = window.setTimeout(() => setCooldownSeconds(0), 0);
      return () => window.clearTimeout(resetTimer);
    }

    const updateSeconds = () => {
      const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
      setCooldownSeconds(remaining);
      if (remaining > 0) {
        requestAnimationFrame(updateSeconds);
      }
    };

    const timer = requestAnimationFrame(updateSeconds);
    return () => cancelAnimationFrame(timer);
  }, [cooldownEnd]);

  const canRun = !isRunning && cooldownSeconds === 0;
  const config = errorTypeConfig[errorType];
  const ErrorIcon = config.icon;

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleRevealHint = (level: number) => {
    setRevealedHints((prev) => new Set([...prev, level]));
  };

  const handleReset = async () => {
    setCode(brokenCode);
    setRevealedHints(new Set());
    await onReset();
  };

  const allTestsPassed = latestSubmission?.result?.tests?.every((test: { passed: boolean }) => test.passed);

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      <div className="p-4 rounded-xl border flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", config.bg, config.border)}>
          <ErrorIcon className={cn("h-5 w-5", config.color)} />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-[var(--text-1)]">{config.label}</h3>
          <p className="text-sm text-[var(--text-3)]">{config.description}</p>
        </div>
      </div>

      <div className="bg-[var(--surface-1)] rounded-2xl shadow-[var(--shadow-sm)] border border-[var(--border)] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[var(--surface-2)] border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐛</span>
            <h2 className="text-lg font-semibold text-[var(--text-1)]">Debug Editor</h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--text-3)]">
            <span className="rounded-full border border-[var(--border)] px-2 py-0.5">
              ⌘/Ctrl + Enter
            </span>
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-[var(--success)]">
                <Save className="h-4 w-4" />
                <span>Saved</span>
              </span>
            )}
          </div>
        </div>

        <div className="min-h-[50vh] sm:min-h-[420px] lg:min-h-[520px]">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            languageId={languageId}
          />
        </div>
      </div>

      <div className="space-y-3">
        {hints.length > 0 && (
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-1)]">
            <h4 className="font-semibold text-[var(--text-1)] mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[var(--accent)]" />
              Hints
            </h4>
            <div className="space-y-2">
              {hints.map((hint) => {
                const isRevealed = revealedHints.has(hint.level);
                return (
                  <div
                    key={hint.level}
                    className="border border-[var(--border)] rounded-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => handleRevealHint(hint.level)}
                      disabled={isRevealed}
                      className={cn(
                        "w-full px-4 py-2.5 text-left flex items-center justify-between gap-3",
                        "transition-colors",
                        isRevealed ? "bg-[var(--surface-2)]" : "bg-[var(--surface-1)] hover:bg-[var(--surface-2)]"
                      )}
                    >
                      <span className="text-sm font-medium text-[var(--text-2)]">
                        Hint {hint.level}
                      </span>
                      {!isRevealed && (
                        <span className="text-xs text-[var(--text-4)]">Click to reveal</span>
                      )}
                    </button>
                    {isRevealed && (
                      <div className="px-4 pb-3 pt-2 text-sm text-[var(--text-2)]">
                        {hint.text}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={onRun}
            disabled={!canRun}
            className={cn(!canRun && "opacity-60")}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Running...</span>
              </>
            ) : cooldownSeconds > 0 ? (
              <span>Wait {cooldownSeconds}s</span>
            ) : (
              <span>Run Tests</span>
            )}
          </Button>

          <Button variant="outline" size="lg" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <Button
          variant="success"
          size="lg"
          onClick={onMarkCompleted}
          disabled={!allTestsPassed}
          className={cn(!allTestsPassed && "opacity-60")}
        >
          <CheckCircle2 className="h-4 w-4" />
          Bug Fixed
        </Button>
      </div>

      {usage && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
          <span className="text-sm text-[var(--text-3)]">Daily runs used</span>
          <span className="text-sm font-semibold text-[var(--text-1)]">
            {usage.runsUsed} / {usage.runsLimit}
            {usage.runsUsed >= usage.runsLimit && (
              <span className="ml-2 text-[var(--danger)]">(Limit reached)</span>
            )}
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-[color:rgba(248,113,113,0.4)] bg-[var(--danger-muted)]">
          <div className="flex items-start gap-3">
            <span className="text-[var(--danger)] text-xl" role="img" aria-label="Error">
              ⚠️
            </span>
            <div className="flex-1">
              <p className="text-[var(--danger)] font-medium">{error.message}</p>
              {error.resetsAtMs && (
                <p className="text-[var(--text-3)] text-sm mt-1">
                  Resets at {new Date(error.resetsAtMs).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <RunOutputPanel
        latestSubmission={latestSubmission}
        isRunning={isRunning}
        error={error}
      />
    </div>
  );
}

function RunOutputPanel({
  latestSubmission,
  isRunning,
  error,
}: {
  latestSubmission: Doc<"submissions"> | null;
  isRunning: boolean;
  error: DebugExerciseWorkspaceProps["error"];
}) {
  const status = latestSubmission?.status;
  const result = latestSubmission?.result;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="text-sm font-semibold text-[var(--text-1)]">Debug Results</div>
        {status && (
          <span className="text-xs text-[var(--text-3)]">Latest: {status}</span>
        )}
      </div>
      <div className="p-4 space-y-3 text-sm text-[var(--text-2)]">
        {isRunning && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Running tests...
          </div>
        )}
        {!isRunning && error && (
          <div className="text-[var(--danger)]">{error.message}</div>
        )}
        {!isRunning && !error && !latestSubmission && (
          <div className="text-[var(--text-4)]">Run your code to see if you fixed the bug.</div>
        )}
        {!isRunning && !error && latestSubmission && (
          <div className="space-y-3">
            {result?.compile && (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <div className="text-xs uppercase tracking-wide text-[var(--text-4)]">Compile</div>
                <div className={cn("mt-1 text-sm", result.compile.ok ? "text-[var(--success)]" : "text-[var(--danger)]")}>
                  {result.compile.ok ? "Compiled successfully" : "Compilation failed"}
                </div>
              </div>
            )}
            {result?.tests && result.tests.length > 0 && (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <div className="text-xs uppercase tracking-wide text-[var(--text-4)] mb-2">Tests</div>
                <div className="space-y-2">
                  {result.tests.map((test: { passed: boolean; name: string; stderr?: string }, idx: number) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-start gap-2 p-2 rounded",
                        test.passed ? "bg-[var(--success-muted)]" : "bg-[var(--danger-muted)]"
                      )}
                    >
                      <span className={test.passed ? "text-[var(--success)]" : "text-[var(--danger)]"}>
                        {test.passed ? "✓" : "✗"}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-[var(--text-1)]">{test.name}</div>
                        {!test.passed && test.stderr && (
                          <div className="text-xs mt-1 text-[var(--danger)]">{test.stderr}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
