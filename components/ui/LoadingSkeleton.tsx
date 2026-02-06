import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "list" | "circle" | "text";
}

/**
 * Reusable loading skeleton component
 *
 * @example
 * // Card skeleton (default)
 * <Skeleton className="h-40 w-full" />
 *
 * @example
 * // List item skeleton
 * <Skeleton variant="list" className="h-16 w-full" />
 *
 * @example
 * // Circle skeleton (avatar, progress ring)
 * <Skeleton variant="circle" className="h-12 w-12" />
 *
 * @example
 * // Text skeleton
 * <Skeleton variant="text" className="h-4 w-3/4" />
 */
export function Skeleton({ className, variant = "card", ...props }: SkeletonProps) {
  const variantStyles: Record<string, string> = {
    card: "rounded-lg",
    list: "rounded-md",
    circle: "rounded-full",
    text: "rounded-sm h-4",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--surface-2)]",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

interface CardSkeletonProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  lines?: number;
}

/**
 * Skeleton for a card with optional avatar, title, and text lines
 */
export function CardSkeleton({ showAvatar = false, showTitle = true, lines = 2 }: CardSkeletonProps) {
  return (
    <div className="p-6 space-y-4 bg-[var(--surface-1)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)]">
      {showAvatar && <Skeleton variant="circle" className="h-12 w-12" />}
      {showTitle && <Skeleton className="h-6 w-3/4" />}
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

interface ListSkeletonProps {
  count?: number;
}

/**
 * Skeleton for a list of items
 */
export function ListSkeleton({ count = 3 }: ListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="list" className="h-16 w-full" />
      ))}
    </div>
  );
}
