import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export type BadgeVariant =
  | "default"
  | "subtle"
  | "outline"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--surface-3)] text-[var(--text-1)]",
  subtle: "bg-[var(--surface-2)] text-[var(--text-2)]",
  outline: "border border-[var(--border)] text-[var(--text-2)]",
  success: "bg-[var(--success-muted)] text-[var(--success)] border border-[color:var(--success-muted)]",
  warning: "bg-[var(--warning-muted)] text-[var(--warning)] border border-[color:var(--warning-muted)]",
  danger: "bg-[var(--danger-muted)] text-[var(--danger)] border border-[color:var(--danger-muted)]",
  info: "bg-[var(--accent-muted)] text-[var(--accent)] border border-[color:var(--accent-muted)]",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
