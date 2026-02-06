"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface MobileMenuContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextValue | undefined>(undefined);

/**
 * Hook to access mobile menu state and controls
 * @throws Error if used outside of MobileMenuProvider
 */
export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider");
  }
  return context;
}

interface MobileMenuProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages mobile menu state
 * Handles escape key and click-outside to close
 */
export function MobileMenuProvider({ children }: MobileMenuProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, close]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <MobileMenuContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

interface MobileMenuTriggerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Button that opens the mobile menu
 * Typically a hamburger icon
 */
export function MobileMenuTrigger({ children, className }: MobileMenuTriggerProps) {
  const { toggle } = useMobileMenu();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-[var(--text-2)]",
        "hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]",
        "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--accent-strong)]",
        "min-h-[44px] min-w-[44px]",
        className
      )}
      aria-label="Open menu"
      aria-expanded="false"
    >
      {children}
    </button>
  );
}

interface MobileMenuContentProps {
  children: ReactNode;
  className?: string;
  position?: "left" | "right";
}

/**
 * Slide-in drawer for mobile navigation
 * Includes backdrop overlay
 */
export function MobileMenuContent({ children, className, position = "right" }: MobileMenuContentProps) {
  const { isOpen, close } = useMobileMenu();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[var(--z-modal-backdrop)] animate-in fade-in duration-200"
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={menuRef}
        className={cn(
          "fixed inset-y-0 w-80 max-w-[85vw] bg-[var(--surface-1)] shadow-[var(--shadow-lg)] z-[var(--z-modal)]",
          "flex flex-col",
          "animate-in slide-in-from-right duration-300 ease-out",
          position === "left" ? "left-0 slide-in-from-left" : "right-0",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <span className="text-lg font-semibold text-[var(--text-1)]">Menu</span>
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center justify-center rounded-md p-2 text-[var(--text-3)] hover:bg-[var(--surface-2)] min-h-[44px] min-w-[44px]"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}

interface MobileMenuItemProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

/**
 * Link item for use inside mobile menu
 * Automatically closes menu on click
 */
export function MobileMenuItem({ href, children, onClick, isActive = false, className }: MobileMenuItemProps) {
  const { close } = useMobileMenu();

  const handleClick = () => {
    onClick?.();
    close();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "block px-4 py-3 text-base font-medium",
        "border-b border-[var(--border-subtle)] last:border-b-0",
        isActive
          ? "bg-[var(--surface-3)] text-[var(--text-1)] border-l-4 border-l-[var(--accent-strong)]"
          : "text-[var(--text-2)] hover:bg-[var(--surface-2)]",
        "min-h-[44px] flex items-center",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </a>
  );
}

interface MobileMenuSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section header for grouping menu items
 */
export function MobileMenuSection({ title, children, className }: MobileMenuSectionProps) {
  return (
    <div className={className}>
      {title && (
        <div className="px-4 py-2 text-xs font-semibold text-[var(--text-4)] uppercase tracking-wider bg-[var(--surface-2)]">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
