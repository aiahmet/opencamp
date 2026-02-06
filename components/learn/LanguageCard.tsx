"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { CircularProgress } from "./ProgressIndicator";
import { BookOpen, Code2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface LanguageCardProps {
  slug: string;
  name: string;
  trackCount?: number;
  progress?: {
    completed: number;
    total: number;
  } | undefined;
  description?: string | undefined;
  icon?: React.ReactNode;
  levels?: Array<"beginner" | "intermediate" | "advanced">;
  variant?: "default" | "gradient";
  className?: string;
}

/**
 * Language card for the /learn page
 * Displays language name, track count, and optional progress ring
 *
 * @example
 * <LanguageCard
 *   slug="python"
 *   name="Python"
 *   trackCount={12}
 *   progress={{ completed: 4, total: 12 }}
 * />
 */
export function LanguageCard({
  slug,
  name,
  trackCount,
  progress,
  description,
  icon,
  levels,
  variant = "default",
  className,
}: LanguageCardProps) {
  const progressPercent = progress && progress.total > 0
    ? Math.min(100, Math.max(0, (progress.completed / progress.total) * 100))
    : 0;

  return (
    <Link href={`/learn/${slug}`} className="block h-full">
      <Card
        variant="elevated"
        interactive
        className={cn(
          "learn-panel h-full group relative overflow-hidden rounded-2xl",
          progress && progress.completed > 0 && "ring-1 ring-[color:rgba(56,189,248,0.4)]",
          variant === "gradient" && "bg-[linear-gradient(120deg,rgba(56,189,248,0.12),rgba(16,20,27,0))]",
          className
        )}
      >
        <div className="relative">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {icon && (
                <div className="mb-3 text-[var(--text-2)]">
                  {icon}
                </div>
              )}
              <CardTitle
                level="h3"
                className="group-hover:text-[var(--accent)] transition-colors"
              >
                {name}
              </CardTitle>
              {levels && levels.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {levels.includes("beginner") && <Badge variant="info">Beginner</Badge>}
                  {levels.includes("intermediate") && (
                    <Badge variant="subtle">Intermediate</Badge>
                  )}
                  {levels.includes("advanced") && <Badge variant="subtle">Advanced</Badge>}
                </div>
              )}
            </div>

            {progress ? (
              <CircularProgress
                progress={progressPercent}
                size={48}
                strokeWidth={4}
                color="success"
                showLabel
                aria-label={`${progressPercent}% complete`}
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-[var(--surface-3)] flex items-center justify-center">
                <Code2 className="h-6 w-6 text-[var(--text-3)]" />
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-3">
            {description && (
              <CardDescription className="line-clamp-2">
                {description}
              </CardDescription>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-3)]">
              {trackCount !== undefined && (
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {trackCount} {trackCount === 1 ? "track" : "tracks"}
                  </span>
                </div>
              )}

              {progress && progress.completed > 0 && (
                <div className="flex items-center gap-1.5 text-[var(--success)]">
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                  <span className="font-medium">
                    {progress.completed} completed
                  </span>
                </div>
              )}
            </div>

            {progress && progress.total > 0 && (
              <div className="pt-2">
                <div className="h-1.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--success)] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
