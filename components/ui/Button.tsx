import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)] " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent-strong)] text-slate-950 shadow-[var(--shadow-sm)] hover:bg-[var(--accent)]",
  secondary:
    "bg-[var(--surface-2)] text-[var(--text-1)] border border-[var(--border)] hover:bg-[var(--surface-3)]",
  outline:
    "border border-[var(--border)] text-[var(--text-1)] hover:bg-[var(--surface-2)]",
  ghost:
    "text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)]",
  success:
    "bg-[var(--success)] text-slate-950 shadow-[var(--shadow-sm)] hover:brightness-110",
  destructive:
    "bg-[var(--danger)] text-slate-950 shadow-[var(--shadow-sm)] hover:brightness-110",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
