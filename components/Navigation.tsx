"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
};

function linkIsActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

export default function Navigation() {
  const pathname = usePathname();
  const currentUser = useQuery(api.users.currentUser);

  if (pathname === "/") {
    return null;
  }
  const isLearnRoute = pathname.startsWith("/learn");

  const isContributor =
    currentUser?.roles.includes("contributor") ||
    currentUser?.roles.includes("reviewer") ||
    currentUser?.roles.includes("maintainer");

  const isReviewer =
    currentUser?.roles.includes("reviewer") ||
    currentUser?.roles.includes("maintainer");

  const signedInLinks: NavLink[] = [
    { href: "/learn", label: "Learn" },
    { href: "/projects", label: "Projects" },
    { href: "/discuss", label: "Discuss" },
    ...(isContributor ? [{ href: "/contribute", label: "Contribute" }] : []),
    ...(isReviewer ? [{ href: "/review", label: "Review" }] : []),
  ];

  const signedOutLinks: NavLink[] = [
    { href: "/learn", label: "Learn" },
    { href: "/pricing", label: "Pricing" },
    { href: "/projects", label: "Projects" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full px-3 sm:px-4",
        "pt-3",
        isLearnRoute && "learn-nav-wrap"
      )}
    >
      <div className={cn("landing-nav-shell mx-auto max-w-6xl rounded-2xl", isLearnRoute && "learn-nav-shell")}>
        <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="group inline-flex items-center gap-2.5 text-[var(--text-1)] transition-opacity hover:opacity-95">
              <span className="landing-nav-brand-badge">OC</span>
              <span className="hidden text-sm font-medium tracking-wide sm:inline">OpenCamp</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <SignedIn>
              {signedInLinks.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  active={linkIsActive(pathname, link.href)}
                >
                  {link.label}
                </NavItem>
              ))}
            </SignedIn>
            <SignedOut>
              {signedOutLinks.map((link) => (
                <NavItem
                  key={link.href}
                  href={link.href}
                  active={linkIsActive(pathname, link.href)}
                >
                  {link.label}
                </NavItem>
              ))}
            </SignedOut>
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
            <SignedIn>
              {signedInLinks.map((link) => (
                <MobileNavItem key={link.href} href={link.href} active={linkIsActive(pathname, link.href)}>
                  {link.label}
                </MobileNavItem>
              ))}
            </SignedIn>
            <SignedOut>
              {signedOutLinks.map((link) => (
                <MobileNavItem key={link.href} href={link.href} active={linkIsActive(pathname, link.href)}>
                  {link.label}
                </MobileNavItem>
              ))}
              <MobileNavItem href="/sign-in" active={pathname === "/sign-in"}>
                Sign in
              </MobileNavItem>
            </SignedOut>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavItem({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "landing-nav-link px-3 py-2 text-sm",
        active && "border-[var(--nav-chip-border)] bg-[var(--nav-chip-bg)] text-[var(--text-1)]"
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

function MobileNavItem({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-lg border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors",
        active
          ? "border-[var(--nav-chip-border)] bg-[var(--nav-chip-bg)] text-[var(--text-1)]"
          : "border-[var(--nav-chip-border)] bg-[var(--nav-chip-bg)] text-[var(--text-3)] hover:text-[var(--text-1)]"
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
