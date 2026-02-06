"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-4">
      <div className="landing-nav-shell mx-auto max-w-6xl rounded-2xl">
        <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="group inline-flex items-center gap-2.5 text-[var(--text-1)] transition-opacity hover:opacity-95">
              <span className="landing-nav-brand-badge">OC</span>
              <span className="hidden text-sm font-medium tracking-wide sm:inline">OpenCamp</span>
            </Link>

            <div className="hidden lg:inline-flex items-center gap-2 rounded-full border border-[var(--nav-chip-border)] bg-[var(--nav-chip-bg)] px-3 py-1 text-[0.66rem] uppercase tracking-[0.13em] text-[var(--text-3)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              Java track beta
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem href="#features">Learn</NavItem>
            <NavItem href="#workflow">Workflow</NavItem>
            <NavItem href="#community">Trust</NavItem>
            <NavItem href="#certificates">Launch</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            <SignedOut>
              <Link
                href="/sign-in"
                className="landing-nav-muted hidden px-3 py-2 text-sm font-medium sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="landing-nav-primary inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300"
              >
                Start free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/learn"
                className="landing-nav-muted inline-flex px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--nav-chip-border)] bg-[var(--nav-chip-bg)]">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-7 h-7",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>

        <div className="border-t border-[var(--nav-chip-border)] px-2 py-2 md:hidden">
          <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <MobileNavItem href="#features">Learn</MobileNavItem>
            <MobileNavItem href="#workflow">Workflow</MobileNavItem>
            <MobileNavItem href="#community">Trust</MobileNavItem>
            <MobileNavItem href="#certificates">Launch</MobileNavItem>
            <SignedOut>
              <MobileNavItem href="/sign-in">Sign in</MobileNavItem>
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="landing-nav-link px-3 py-2 text-sm">
      {children}
    </Link>
  );
}

function MobileNavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-lg border border-[var(--nav-chip-border)] bg-[var(--nav-chip-bg)] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-[var(--text-3)] transition-colors hover:text-[var(--text-1)]"
    >
      {children}
    </Link>
  );
}
