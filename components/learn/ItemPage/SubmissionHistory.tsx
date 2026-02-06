"use client";

import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, Circle } from "lucide-react";

interface SubmissionHistoryProps {
  submissions: Doc<"submissions">[];
  onLoadCode: (code: string) => void;
  className?: string;
}

/**
 * Display submission history with expandable details
 */
export function SubmissionHistory({ submissions, onLoadCode, className }: SubmissionHistoryProps) {
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  if (submissions.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-[var(--danger)]" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-[var(--warning)]" />;
      default:
        return <Circle className="h-5 w-5 text-[var(--text-4)]" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-[var(--success-muted)] text-[var(--success)] border-[color:rgba(52,211,153,0.4)]";
      case "failed":
        return "bg-[var(--danger-muted)] text-[var(--danger)] border-[color:rgba(248,113,113,0.5)]";
      case "error":
        return "bg-[var(--warning-muted)] text-[var(--warning)] border-[color:rgba(251,191,36,0.45)]";
      default:
        return "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)]";
    }
  };

  return (
    <div className={cn("bg-[var(--surface-1)] rounded-2xl shadow-[var(--shadow-sm)] border border-[var(--border)]", className)}>
      <div className="p-4 sm:p-6 border-b border-[var(--border)]">
        <h2 className="text-xl font-semibold text-[var(--text-1)] flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Submissions
          <span className="text-sm font-normal text-[var(--text-4)]">({submissions.length})</span>
        </h2>
      </div>

      <div className="divide-y divide-[var(--border-subtle)] max-h-[400px] overflow-y-auto">
        {submissions.map((submission) => {
          const isExpanded = expandedSubmission === submission._id;

          return (
            <div key={submission._id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border",
                      getStatusBadgeClass(submission.status)
                    )}
                  >
                    {getStatusIcon(submission.status)}
                    <span className="capitalize">{submission.status}</span>
                  </span>

                  <span className="text-sm text-[var(--text-4)]">
                    {formatDate(submission.createdAt)}
                  </span>

                  {submission.result?.timingMs && (
                    <span className="text-sm text-[var(--text-4)]">({submission.result.timingMs}ms)</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {submission.result && (
                    <button
                      onClick={() => setExpandedSubmission(isExpanded ? null : submission._id)}
                      className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Show Details
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => onLoadCode(submission.code)}
                    className="text-sm px-3 py-1.5 bg-[var(--surface-2)] text-[var(--text-2)] rounded-md hover:bg-[var(--surface-3)] transition-colors min-h-[36px]"
                  >
                    Load Code
                  </button>
                </div>
              </div>

              {isExpanded && submission.result && (
                <div className="mt-4 space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                  {submission.result.compile && (
                    <div className="rounded-lg border border-[var(--border)] overflow-hidden">
                      <div className="px-3 py-2 bg-[var(--surface-2)] font-medium text-[var(--text-1)] text-sm">
                        Compilation
                      </div>
                      <div className="p-3">
                        {submission.result.compile.ok ? (
                          <div className="flex items-center gap-2 text-[var(--success)]">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm font-medium">Compiled successfully</span>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2 text-[var(--danger)] mb-2">
                              <XCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Compilation failed</span>
                            </div>
                            {submission.result.compile.stderr && (
                              <pre className="mt-2 p-3 bg-[var(--danger-muted)] rounded text-sm overflow-x-auto text-[var(--danger)]">
                                {submission.result.compile.stderr}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {submission.result.compile.ok && submission.result.tests && (
                    <div className="rounded-lg border border-[var(--border)] overflow-hidden">
                      <div className="px-3 py-2 bg-[var(--surface-2)] font-medium text-[var(--text-1)] text-sm">
                        Tests
                      </div>
                      <div className="p-3 space-y-2">
                        {submission.result.tests.map((test: { name: string; passed: boolean; expected?: unknown; actual?: unknown; stderr?: string }, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 p-2 rounded bg-[var(--surface-2)]">
                            <span className={test.passed ? "text-[var(--success)]" : "text-[var(--danger)]"}>
                              {test.passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-[var(--text-1)]">{test.name}</span>
                              {!test.passed && (
                                <div className="text-sm text-[var(--text-3)] mt-1">
                                  Expected: {JSON.stringify(test.expected)}
                                  <br />
                                  Actual: {JSON.stringify(test.actual)}
                                </div>
                              )}
                              {test.stderr && (
                                <div className="text-sm text-[var(--danger)] mt-1">{test.stderr}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {submission.result.stdout && (
                    <div className="rounded-lg border border-[var(--border)] overflow-hidden">
                      <div className="px-3 py-2 bg-[var(--surface-2)] font-medium text-[var(--text-1)] text-sm">
                        Output
                      </div>
                      <pre className="p-3 text-sm overflow-x-auto bg-[var(--surface-2)] text-[var(--text-2)]">
                        {submission.result.stdout}
                      </pre>
                    </div>
                  )}

                  {submission.result.stderr && submission.result.compile.ok && (
                    <div className="rounded-lg border border-[color:rgba(248,113,113,0.4)] overflow-hidden">
                      <div className="px-3 py-2 bg-[var(--danger-muted)] font-medium text-[var(--danger)] text-sm">
                        Errors
                      </div>
                      <pre className="p-3 text-sm overflow-x-auto bg-[var(--danger-muted)] text-[var(--danger)]">
                        {submission.result.stderr}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
