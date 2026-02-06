"use client";

import { CircularProgress } from "./ProgressIndicator";
import { Trophy, Flame, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearnProgressCardProps {
  completed: number;
  total: number;
  languageName: string;
  className?: string;
}

export function LearnProgressCard({
  completed,
  total,
  languageName,
  className,
}: LearnProgressCardProps) {
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;
  const remaining = total - completed;

  return (
    <div
      className={cn(
        "bg-[var(--surface-2)] rounded-2xl p-6 text-[var(--text-1)] border border-[var(--border)] shadow-[var(--shadow-md)]",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[var(--surface-3)] rounded-lg">
          <Star className="h-5 w-5 text-[var(--accent)]" />
        </div>
        <span className="font-semibold">{languageName} Progress</span>
      </div>

      <div className="flex items-center gap-6">
        <CircularProgress
          progress={progressPercent}
          size={72}
          strokeWidth={6}
          color="white"
          showLabel
        />

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-sm text-[var(--text-3)]">
            <span>Completed</span>
            <span className="font-semibold">{completed} lessons</span>
          </div>
          <div className="flex items-center justify-between text-sm text-[var(--text-3)]">
            <span>Remaining</span>
            <span className="font-semibold">{remaining} lessons</span>
          </div>
          <div className="flex items-center justify-between text-sm text-[var(--text-3)]">
            <span>Total</span>
            <span className="font-semibold">{total} lessons</span>
          </div>
        </div>
      </div>

      {completed === total && total > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
            <Trophy className="h-4 w-4 text-[var(--warning)]" />
            <span className="font-medium">
              Congratulations! You completed all lessons!
            </span>
          </div>
        </div>
      )}

      {completed > 0 && completed < total && (
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
            <Flame className="h-4 w-4 text-[var(--warning)]" />
            <span className="font-medium">
              Keep going! You&apos;re making great progress!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
