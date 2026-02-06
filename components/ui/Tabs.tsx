import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, HTMLAttributes } from "react";

type TabsProps = HTMLAttributes<HTMLDivElement>;

export function Tabs({ className, ...props }: TabsProps) {
  return <div className={cn("space-y-3", className)} {...props} />;
}

type TabsListProps = HTMLAttributes<HTMLDivElement>;

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[var(--surface-2)] p-1 border border-[var(--border)]",
        className
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function TabsTrigger({ className, active = false, ...props }: TabsTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-[var(--surface-4)] text-[var(--text-1)] shadow-[var(--shadow-sm)]"
          : "text-[var(--text-3)] hover:text-[var(--text-1)]",
        className
      )}
      {...props}
    />
  );
}

type TabsContentProps = HTMLAttributes<HTMLDivElement>;

export function TabsContent({ className, ...props }: TabsContentProps) {
  return <div className={cn("mt-4", className)} {...props} />;
}
