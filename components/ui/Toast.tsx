"use client";

import { cn } from "@/lib/utils";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastVariant = "default" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  addToast: (toast: Omit<ToastItem, "id">, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, "id">, durationMs = 3200) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const nextToast: ToastItem = { id, ...toast };
    setToasts((prev) => [...prev, nextToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, durationMs);
  }, []);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed right-4 top-4 z-[var(--z-popover)] flex w-[min(360px,90vw)] flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-xl border px-4 py-3 shadow-[var(--shadow-md)] backdrop-blur",
            "bg-[color:rgba(16,20,27,0.9)] text-[var(--text-1)] border-[var(--border)]",
            toast.variant === "success" && "border-[color:rgba(52,211,153,0.4)]",
            toast.variant === "warning" && "border-[color:rgba(251,191,36,0.4)]",
            toast.variant === "error" && "border-[color:rgba(248,113,113,0.5)]"
          )}
        >
          <div className="text-sm font-semibold">{toast.title}</div>
          {toast.description && (
            <div className="mt-1 text-xs text-[var(--text-3)]">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
