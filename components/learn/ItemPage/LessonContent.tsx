"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface LessonContentProps {
  content: string;
  className?: string;
  showToc?: boolean;
}

/**
 * Markdown lesson content renderer
 * Supports GitHub Flavored Markdown with custom styling
 *
 * @example
 * <LessonContent content="# Lesson Title\n\nYour content here..." />
 */
export function LessonContent({ content, className, showToc = false }: LessonContentProps) {
  const headings = useMemo(() => {
    const items: { level: number; text: string; id: string }[] = [];
    const counts = new Map<string, number>();
    const regex = /^(#{1,3})\s+(.*)$/gm;
    const tocSource = stripCodeBlocks(content);
    let match: RegExpExecArray | null = null;

    while ((match = regex.exec(tocSource)) !== null) {
      if (!match[1] || !match[2]) {
        continue;
      }
      const level = match[1].length;
      const text = match[2].replace(/\s+#+$/, "").trim();
      const base = slugify(text);
      const count = (counts.get(base) || 0) + 1;
      counts.set(base, count);
      const id = count > 1 ? `${base}-${count}` : base;
      items.push({ level, text, id });
    }

    return items;
  }, [content]);

  const headingIds = useMemo(() => headings.map((item) => item.id), [headings]);
  let headingIndex = 0;

  const contentNode = (
    <div
      className={cn(
        "bg-[var(--surface-1)] rounded-2xl shadow-[var(--shadow-sm)] border border-[var(--border)] p-5 sm:p-7 lg:p-10",
        "max-w-[72ch] lg:max-w-[76ch] text-[var(--text-2)] leading-7",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypePrism]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              id={headingIds[headingIndex++] || undefined}
              className="scroll-mt-28 text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--text-1)] tracking-tight mb-5"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              id={headingIds[headingIndex++] || undefined}
              className="scroll-mt-28 text-xl sm:text-2xl font-semibold text-[var(--text-1)] mt-10 mb-3 tracking-tight"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              id={headingIds[headingIndex++] || undefined}
              className="scroll-mt-28 text-lg sm:text-xl font-semibold text-[var(--text-1)] mt-7 mb-2 tracking-tight"
              {...props}
            >
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="text-[var(--text-2)] leading-7 mb-4" {...props}>
              {children}
            </p>
          ),
          a: ({ children, ...props }) => (
            <a className="text-[var(--accent)] no-underline hover:underline" {...props}>
              {children}
            </a>
          ),
          strong: ({ children, ...props }) => (
            <strong className="text-[var(--text-1)] font-semibold" {...props}>
              {children}
            </strong>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-6 space-y-2 mb-4" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 space-y-2 mb-4" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-7 text-[var(--text-2)] marker:text-[var(--text-4)]" {...props}>
              {children}
            </li>
          ),
          code: ({ inline, className: codeClassName, children, ...props }: React.ComponentProps<"code"> & { inline?: boolean }) => {
            const match = /language-(\w+)/.exec(codeClassName || "");
            return !inline && match ? (
              <code className={codeClassName} {...props}>
                {children}
              </code>
            ) : (
              <code
                className="bg-[var(--surface-3)] px-1.5 py-0.5 rounded-md text-sm font-mono border border-[var(--border-subtle)]"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }: React.ComponentProps<"pre">) => (
            <pre
              className="bg-[var(--surface-3)] text-[var(--text-1)] p-5 rounded-xl overflow-x-auto my-5 border border-[var(--border)]"
              {...props}
            >
              {children}
            </pre>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-[var(--accent-strong)] bg-[var(--surface-2)] rounded-xl py-2 px-4 italic text-[var(--text-2)] mb-4"
              {...props}
            >
              {children}
            </blockquote>
          ),
          hr: (props) => <hr className="border-[var(--border)] my-8" {...props} />,
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-6">
              <table className="w-full border border-[var(--border)] rounded-xl" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="bg-[var(--surface-2)] font-semibold px-4 py-2 text-left text-[var(--text-1)]"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border-t border-[var(--border)] px-4 py-2" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  if (!showToc) {
    return contentNode;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
      {contentNode}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-4)]">
            On this page
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {headings.length === 0 ? (
              <span className="text-[var(--text-4)]">No headings yet</span>
            ) : (
              headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={cn(
                    "block text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors",
                    heading.level === 2 && "pl-3",
                    heading.level === 3 && "pl-6"
                  )}
                >
                  {heading.text}
                </a>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

interface ProblemStatementProps {
  prompt: string;
  className?: string;
}

/**
 * Display problem statement for challenges
 */
export function ProblemStatement({ prompt, className }: ProblemStatementProps) {
  return (
    <div
      className={cn(
        "bg-[var(--surface-1)] rounded-2xl shadow-[var(--shadow-sm)] border border-[var(--border)] p-4 sm:p-6",
        className
      )}
    >
      <h2 className="text-xl font-semibold text-[var(--text-1)] mb-4 flex items-center gap-2">
        <span className="text-2xl">📋</span>
        Problem Statement
      </h2>
      <div className="text-[var(--text-2)] whitespace-pre-wrap prose prose-sm prose-invert max-w-none">
        {prompt}
      </div>
    </div>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function stripCodeBlocks(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "");
}
