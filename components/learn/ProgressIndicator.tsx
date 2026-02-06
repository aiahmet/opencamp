"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Lock, Loader2, TrendingUp } from "lucide-react";

export type ProgressStatus = "completed" | "in_progress" | "not_started" | "locked";

export interface ProgressData {
  completed: number;
  total: number;
  inProgress?: number;
}

interface CircularProgressProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  color?: "primary" | "success" | "warning" | "white";
}

/**
 * Circular progress indicator (SVG-based)
 * Good for displaying overall completion in cards
 *
 * @example
 * <CircularProgress progress={75} size={48} showLabel />
 */
export function CircularProgress({
  progress,
  size = 48,
  strokeWidth = 4,
  className,
  showLabel = false,
  label,
  color = "primary",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colors = {
    primary: "stroke-[var(--accent-strong)]",
    success: "stroke-[var(--success)]",
    warning: "stroke-[var(--warning)]",
    white: "stroke-white",
  };

  const bgColors = {
    primary: "stroke-[color:rgba(56,189,248,0.2)]",
    success: "stroke-[color:rgba(52,211,153,0.2)]",
    warning: "stroke-[color:rgba(251,191,36,0.2)]",
    white: "stroke-white/30",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `${Math.round(progress)}% complete`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={bgColors[color]}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(colors[color], "transition-all duration-500 ease-out")}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-xs font-semibold text-[var(--text-2)]">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

interface LinearProgressProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
  color?: "primary" | "success" | "warning";
  animated?: boolean;
}

/**
 * Linear progress bar
 * Good for track/module progress displays
 *
 * @example
 * <LinearProgress progress={60} size="md" showLabel />
 */
export function LinearProgress({
  progress,
  size = "md",
  className,
  showLabel = false,
  color = "primary",
  animated = false,
}: LinearProgressProps) {
  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colors = {
    primary: "bg-[var(--accent-strong)]",
    success: "bg-[var(--success)]",
    warning: "bg-[var(--warning)]",
  };

  const bgColors = {
    primary: "bg-[color:rgba(56,189,248,0.2)]",
    success: "bg-[color:rgba(52,211,153,0.2)]",
    warning: "bg-[color:rgba(251,191,36,0.2)]",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex-1 rounded-full overflow-hidden",
          heights[size],
          bgColors[color]
        )}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colors[color],
            animated && "animate-pulse"
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-[var(--text-3)] min-w-[3rem] text-right">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: ProgressStatus;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Visual status indicator with icon
 * Shows completion, in-progress, or locked state
 *
 * @example
 * <StatusBadge status="completed" />
 * <StatusBadge status="in_progress" showLabel />
 */
export function StatusBadge({ status, className, showLabel = true, size = "md" }: StatusBadgeProps) {
  const sizes = {
    sm: "h-4 w-4 text-sm",
    md: "h-5 w-5 text-base",
    lg: "h-6 w-6 text-lg",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      label: "Completed",
      bgClass: "bg-[var(--success-muted)] text-[var(--success)]",
      iconClass: "text-[var(--success)]",
    },
    in_progress: {
      icon: Loader2,
      label: "In Progress",
      bgClass: "bg-[var(--warning-muted)] text-[var(--warning)]",
      iconClass: "text-[var(--warning)] animate-spin",
    },
    not_started: {
      icon: Circle,
      label: "Not Started",
      bgClass: "bg-[var(--surface-2)] text-[var(--text-3)]",
      iconClass: "text-[var(--text-4)]",
    },
    locked: {
      icon: Lock,
      label: "Locked",
      bgClass: "bg-[var(--surface-2)] text-[var(--text-3)]",
      iconClass: "text-[var(--text-4)]",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (!showLabel) {
    return (
      <Icon className={cn(sizes[size], config.iconClass, className)} aria-label={config.label} />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium",
        config.bgClass,
        className
      )}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
      <span className="text-xs sm:text-sm">{config.label}</span>
    </span>
  );
}

interface ProgressSummaryProps {
  data: ProgressData;
  className?: string;
  showCircular?: boolean;
  circularSize?: number;
}

/**
 * Combined progress display with stats summary
 * Shows completed/total count with optional circular indicator
 *
 * @example
 * <ProgressSummary
 *   data={{ completed: 5, total: 10, inProgress: 2 }}
 *   showCircular
 * />
 */
export function ProgressSummary({
  data,
  className,
  showCircular = false,
  circularSize = 40,
}: ProgressSummaryProps) {
  const { completed, total, inProgress = 0 } = data;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const remaining = total - completed - inProgress;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showCircular && (
        <CircularProgress progress={progress} size={circularSize} color="success" />
      )}
      <div className="flex items-center gap-3 text-sm">
        {completed > 0 && (
          <span className="flex items-center gap-1 text-[var(--success)]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">{completed}</span>
            <span className="text-[var(--text-4)]">done</span>
          </span>
        )}
        {inProgress > 0 && (
          <span className="flex items-center gap-1 text-[var(--warning)]">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">{inProgress}</span>
            <span className="text-[var(--text-4)]">in progress</span>
          </span>
        )}
        {remaining > 0 && (
          <span className="text-[var(--text-4)]">
            {remaining} remaining
          </span>
        )}
        {total === 0 && (
          <span className="text-[var(--text-4)]">Not started</span>
        )}
      </div>
    </div>
  );
}
