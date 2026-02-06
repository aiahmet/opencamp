"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Discussion {
  _id: string;
  title: string;
  type: "help" | "showcase" | "general";
  authorUsername: string;
  updatedAt: number;
}

interface DiscussionPreviewProps {
  itemId: string;
  discussions: Discussion[];
  className?: string;
}

/**
 * Preview of related discussions for an item
 * Shows up to 5 discussions with a link to view all
 */
export function DiscussionPreview({ itemId, discussions, className }: DiscussionPreviewProps) {
  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "help":
        return "bg-[var(--success-muted)] text-[var(--success)] border-[color:rgba(52,211,153,0.4)]";
      case "showcase":
        return "bg-[var(--accent-muted)] text-[var(--accent)] border-[color:rgba(125,211,252,0.4)]";
      case "question":
        return "bg-[var(--warning-muted)] text-[var(--warning)] border-[color:rgba(251,191,36,0.4)]";
      default:
        return "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)]";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("bg-[var(--surface-1)] rounded-2xl shadow-[var(--shadow-sm)] border border-[var(--border)]", className)}>
      <div className="p-4 sm:p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--text-1)] flex items-center gap-2">
            <span className="text-2xl">💬</span>
            Discussions
          </h2>
          <Link
            href={`/items/${itemId}/discuss`}
            className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            View all
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {discussions.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-[var(--text-3)] mb-4">
            No discussions yet. Ask questions or share your work!
          </p>
          <Link
            href={`/items/${itemId}/discuss`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-strong)] text-slate-950 font-medium rounded-lg transition-colors min-h-[44px]"
          >
            Start a Discussion
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-subtle)]">
          {discussions.slice(0, 5).map((discussion) => (
            <Link
              key={discussion._id}
              href={`/discuss/${discussion._id}`}
              className="block p-4 hover:bg-[var(--surface-2)] transition-colors"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border flex-shrink-0 mt-0.5",
                    getTypeBadgeClass(discussion.type)
                  )}
                >
                  {discussion.type}
                </span>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--text-1)] mb-1 line-clamp-2">
                    {discussion.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-3)]">
                    <span className="font-medium">{discussion.authorUsername}</span>
                    <span aria-hidden="true">•</span>
                    <span>{formatDate(discussion.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {discussions.length > 0 && (
            <div className="p-4 sm:hidden">
              <Link
                href={`/items/${itemId}/discuss`}
                className="block text-center text-sm text-[var(--accent)] py-2 min-h-[44px] flex items-center justify-center"
              >
                View all {discussions.length} discussions →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
