"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export interface BreadcrumbItem {
  label: string;
  href?: string; // If undefined, item is current page (not clickable)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string | undefined;
  homeHref?: string;
  homeLabel?: string;
}

/**
 * Breadcrumb navigation for hierarchical page structure
 * Mobile-optimized with truncation on small screens
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: "Learn", href: "/learn" },
 *     { label: "Python", href: "/learn/python" },
 *     { label: "Basics" } // Current page - no href
 *   ]}
 * />
 */
export function Breadcrumb({ items, className, homeHref = "/learn", homeLabel = "Learn" }: BreadcrumbProps) {
  // Add home as first item if not already present
  const allItems = items[0]?.href === homeHref
    ? items
    : [{ label: homeLabel, href: homeHref }, ...items];

  return (
    <nav
      className={cn("flex items-center gap-1 text-sm text-[var(--text-3)]", className)}
      aria-label="Breadcrumb"
    >
      <ol
        className="flex items-center gap-1 flex-wrap"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const position = index + 1;

          return (
            <li
              key={index}
              className="flex items-center gap-1"
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={position.toString()} />

              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-[var(--text-4)] flex-shrink-0" aria-hidden="true" />
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "hover:text-[var(--text-1)] transition-colors truncate max-w-[150px] sm:max-w-none",
                    "text-[var(--text-3)]"
                  )}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-medium truncate max-w-[200px] sm:max-w-none",
                    isLast
                      ? "text-[var(--text-1)]"
                      : "text-[var(--text-3)]"
                  )}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Hook to generate breadcrumb items from the current pathname
 * Automatically parses /learn/[language]/tracks/[track] structure
 */
export function getLearnBreadcrumbs(pathname: string): BreadcrumbItem[] {

  if (!pathname.startsWith("/learn")) {
    return [{ label: "Learn", href: "/learn" }];
  }

  const segments = pathname.split("/").filter(Boolean);

  // /learn
  if (segments.length === 1) {
    return [{ label: "Learn", href: "/learn" }];
  }

  const items: BreadcrumbItem[] = [{ label: "Learn", href: "/learn" }];

  // /learn/[language]
  if (segments.length >= 2) {
    const language = segments[1];
    if (language) {
      items.push({
        label: capitalize(language),
        href: `/learn/${language}`,
      });
    }
  }

  // /learn/[language]/tracks/[track]
  if (segments.length >= 4 && segments[2] === "tracks") {
    const track = segments[3];
    if (track) {
      const item: BreadcrumbItem = {
        label: capitalize(track.replace(/-/g, " ")),
      };
      // If this is the last segment, it's the current page (no href)
      if (segments.length > 4) {
        item.href = `/learn/${segments[1]}/tracks/${track}`;
      }
      items.push(item);
    }
  }

  // /learn/[language]/items/[item]
  if (segments.length >= 4 && segments[2] === "items") {
    const item = segments[3];
    if (item) {
      // Current page - no href needed
      items.push({
        label: capitalize(item.replace(/-/g, " ")),
      });
    }
  }

  return items;
}

function capitalize(str: string): string {
  return str
    .split(/[-\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Convenience component that automatically generates breadcrumbs from pathname
 * Use this in /learn pages for automatic breadcrumb generation
 */
export function LearnBreadcrumb({ className, customItems }: { className?: string; customItems?: BreadcrumbItem[] | undefined }) {
  const pathname = usePathname();
  const items = customItems ?? getLearnBreadcrumbs(pathname);

  return <Breadcrumb items={items} className={className} />;
}
