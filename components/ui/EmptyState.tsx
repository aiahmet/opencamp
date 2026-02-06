import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] px-6 py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-3)] text-[var(--text-2)]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text-1)]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-[var(--text-3)]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
