"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LanguageCard } from "@/components/learn/LanguageCard";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { Code2, Sparkles, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

type Language = {
  slug: string;
  name: string;
  trackCount?: number;
  progress?: {
    completed: number;
    total: number;
  };
};

const languageIcons: Record<string, React.ReactNode> = {
  python: <Code2 className="h-6 w-6" />,
  javascript: <Code2 className="h-6 w-6" />,
  typescript: <Code2 className="h-6 w-6" />,
  rust: <Code2 className="h-6 w-6" />,
  go: <Code2 className="h-6 w-6" />,
  java: <Code2 className="h-6 w-6" />,
};

const languageDescriptions: Record<string, string> = {
  python: "Learn Python from fundamentals to advanced concepts with hands-on coding challenges.",
  javascript: "Master JavaScript and build interactive web applications from scratch.",
  typescript: "Add type safety to your JavaScript projects with TypeScript's powerful features.",
  rust: "Build fast and reliable systems software with Rust's memory safety guarantees.",
  go: "Develop efficient backend services and cloud-native applications with Go.",
  java: "Build a strong Java foundation through structured lessons, challenges, and real projects.",
};

export default function LearnPage() {
  const languages = useQuery(api.curriculum.listLanguages);

  if (languages === undefined) {
    return (
      <div className="learn-page-shell min-h-screen">
        <div className="learn-grid-overlay absolute inset-0" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-12 space-y-4">
            <div className="h-10 w-64 bg-[var(--surface-2)] rounded animate-pulse" />
            <div className="h-6 w-96 bg-[var(--surface-2)] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} showAvatar showTitle lines={2} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const languagesWithProgress = languages.filter(
    (lang: Language) => lang.progress && lang.progress.completed > 0
  );
  const languagesWithoutProgress = languages.filter(
    (lang: Language) => !lang.progress || lang.progress.completed === 0
  );
  const totalTrackCount = languages.reduce((sum: number, lang: Language) => sum + (lang.trackCount ?? 0), 0);
  const startedLanguageCount = languagesWithProgress.length;

  return (
    <div className="learn-page-shell min-h-screen">
      <div className="learn-grid-overlay absolute inset-0" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="learn-shell-panel rounded-3xl p-6 sm:p-8 lg:p-10 mb-10 sm:mb-12">
          <div className="space-y-8 sm:space-y-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="learn-chip inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-[var(--text-3)]">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                <span className="text-sm font-medium">Start your coding journey today</span>
              </div>
              <h1 className="learn-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--text-1)] mb-4">
                Choose Your <span className="text-[var(--accent)]">Learning Path</span>
              </h1>
              <p className="text-lg sm:text-xl text-[var(--text-3)] max-w-2xl mx-auto">
                Master programming languages through hands-on challenges, interactive lessons, and real-world projects.
                Track progress, build momentum, and ship real skills.
              </p>
            </div>

            {languagesWithProgress.length > 0 && (
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="#continue-learning"
                  className="learn-primary-btn inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-300"
                >
                  <Zap className="h-5 w-5" />
                  Continue Learning
                </Link>
                <Link
                  href="#explore-languages"
                  className="learn-secondary-btn inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                >
                  Explore Languages
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            <div className="flex items-center justify-center gap-6 text-sm text-[var(--text-4)] flex-wrap">
              <div className="learn-chip inline-flex items-center gap-2 rounded-full px-3 py-2">
                <span className="text-[var(--text-2)] font-semibold">{languages.length}</span>
                <span>Languages</span>
              </div>
              <div className="learn-chip inline-flex items-center gap-2 rounded-full px-3 py-2">
                <span className="text-[var(--text-2)] font-semibold">{totalTrackCount}</span>
                <span>Total Tracks</span>
              </div>
              <div className="learn-chip inline-flex items-center gap-2 rounded-full px-3 py-2">
                <span className="text-[var(--text-2)] font-semibold">{startedLanguageCount}</span>
                <span>In Progress</span>
              </div>
              <div className="learn-chip inline-flex items-center gap-2 rounded-full px-3 py-2">
                <div className="w-2 h-2 bg-[var(--success)] rounded-full" />
                <span>Interactive Challenges</span>
              </div>
              <div className="learn-chip inline-flex items-center gap-2 rounded-full px-3 py-2">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full" />
                <span>Progress Tracking</span>
              </div>
              <div className="learn-chip inline-flex items-center gap-2 rounded-full px-3 py-2">
                <div className="w-2 h-2 bg-[var(--warning)] rounded-full" />
                <span>Community Support</span>
              </div>
            </div>
          </div>
        </div>

        {languages.length === 0 ? (
          <EmptyState
            icon={<Code2 className="h-8 w-8" />}
            title="No Languages Available"
            description="We’re curating the best learning content for you. Check back soon!"
          />
        ) : (
          <div className="space-y-12">
            {languagesWithProgress.length > 0 && (
              <section id="continue-learning">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="learn-heading text-xl font-semibold text-[var(--text-1)]">Continue where you left off</h2>
                    <p className="text-sm text-[var(--text-4)]">Jump back into your active tracks.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {languagesWithProgress.map((language: Language) => (
                    <LanguageCard
                      key={language.slug}
                      slug={language.slug}
                      name={language.name}
                      trackCount={language.trackCount ?? 0}
                      progress={language.progress ?? undefined}
                      icon={languageIcons[language.slug]}
                      variant="default"
                    />
                  ))}
                </div>
              </section>
            )}

            {languagesWithoutProgress.length > 0 && (
              <section id="explore-languages">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="learn-heading text-xl font-semibold text-[var(--text-1)]">
                      {languagesWithProgress.length > 0 ? "Explore" : "Available Languages"}
                    </h2>
                    <p className="text-sm text-[var(--text-4)]">Pick a language and start with a structured track.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {languagesWithoutProgress.map((language: Language) => (
                    <LanguageCard
                      key={language.slug}
                      slug={language.slug}
                      name={language.name}
                      trackCount={language.trackCount ?? 0}
                      progress={language.progress ?? undefined}
                      icon={languageIcons[language.slug]}
                      description={languageDescriptions[language.slug]}
                      variant="gradient"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
