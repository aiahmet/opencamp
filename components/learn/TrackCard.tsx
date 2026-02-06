"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { LinearProgress, StatusBadge, ProgressStatus } from "./ProgressIndicator";
import { Clock, BookOpen, Play } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface TrackCardProps {
  languageSlug: string;
  slug: string;
  title: string;
  description: string;
  level?: "beginner" | "intermediate" | "advanced" | undefined;
  moduleCount?: number;
  estimatedTime?: string;
  status?: ProgressStatus;
  progress?: number; // 0-100
  className?: string;
}

/**
 * Track card for the language tracks page
 * Displays track info, level badge, and progress
 *
 * @example
 * <TrackCard
 *   languageSlug="python"
 *   slug="basics"
 *   title="Python Basics"
 *   description="Learn the fundamentals"
 *   level="beginner"
 *   moduleCount={8}
 *   status="in_progress"
 *   progress={40}
 * />
 */
export function TrackCard({
  languageSlug,
  slug,
  title,
  description,
  level,
  moduleCount,
  estimatedTime,
  status,
  progress,
  className,
}: TrackCardProps) {
  const levelConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
    beginner: { label: "Beginner", variant: "success" },
    intermediate: { label: "Intermediate", variant: "warning" },
    advanced: { label: "Advanced", variant: "danger" },
  };

  const levelInfo = level ? levelConfig[level] : null;

  return (
    <Link href={`/learn/${languageSlug}/tracks/${slug}`} className="block h-full">
      <Card
        variant="outlined"
        interactive
        className={cn(
          "learn-panel h-full group rounded-2xl",
          status === "completed" && "ring-1 ring-[color:rgba(52,211,153,0.35)]",
          className
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle
                level="h3"
                className="group-hover:text-[var(--accent)] transition-colors truncate"
              >
                {title}
              </CardTitle>

              {levelInfo && (
                <Badge className="mt-2" variant={levelInfo.variant}>
                  {levelInfo.label}
                </Badge>
              )}
            </div>

            {status && (
              <StatusBadge
                status={status}
                size="md"
                showLabel={false}
                className="flex-shrink-0"
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription className="line-clamp-2 min-h-[2.5rem]">
            {description}
          </CardDescription>

          {/* Progress bar for in-progress/completed tracks */}
          {progress !== undefined && progress > 0 && (
            <div>
              <LinearProgress
                progress={progress}
                size="md"
                showLabel
                color={status === "completed" ? "success" : "primary"}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-between border-t border-[var(--border-subtle)]">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-sm text-[var(--text-3)]">
            {moduleCount !== undefined && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>{moduleCount} modules</span>
              </div>
            )}
            {estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>{estimatedTime}</span>
              </div>
            )}
          </div>

          {/* Continue/start indicator */}
          <div className={cn(
            "flex items-center gap-1.5 text-sm font-medium transition-colors",
            status === "in_progress"
              ? "text-[var(--warning)]"
              : "text-[var(--accent)] group-hover:text-[var(--accent-strong)]"
          )}>
            {status === "in_progress" ? (
              <>
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>Continue</span>
              </>
            ) : status === "completed" ? (
              <span>Review</span>
            ) : (
              <span>Start</span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
