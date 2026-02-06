"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TrackCard } from "@/components/learn/TrackCard";
import { LearnBreadcrumb } from "@/components/learn/Breadcrumb";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { BookOpen, FolderOpen, RotateCcw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";

import { Id } from "@/convex/_generated/dataModel";

type Track = {
  _id: Id<"tracks">;
  slug: string;
  title: string;
  level?: string;
  description: string;
};

export default function LanguagePage() {
  const params = useParams();
  const languageSlug = params.language as string;
  const tracks = useQuery(api.curriculum.listTracksByLanguageSlug, {
    languageSlug,
  });
  const completedTracks = useQuery(api.completion.listMyCompletedTracks);

  const languages = useQuery(api.curriculum.listLanguages);
  const currentLanguage = languages?.find((lang) => lang.slug === languageSlug);

  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  const filteredTracks = useMemo(() => {
    if (!tracks) return [] as Track[];
    return tracks.filter((track: Track) => {
      const matchesQuery =
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.description.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = levelFilter === "all" || track.level === levelFilter;
      return matchesQuery && matchesLevel;
    });
  }, [tracks, query, levelFilter]);

  if (tracks === undefined) {
    return (
      <div className="learn-page-shell min-h-screen">
        <div className="learn-grid-overlay absolute inset-0" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="mb-8 space-y-4">
            <div className="h-6 w-48 bg-[var(--surface-2)] rounded animate-pulse" />
            <div className="h-10 w-64 bg-[var(--surface-2)] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} showTitle lines={2} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tracks === null) {
    return (
      <div className="learn-page-shell min-h-screen">
        <div className="learn-grid-overlay absolute inset-0" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <LearnBreadcrumb />
          <EmptyState
            icon={<FolderOpen className="h-8 w-8" />}
            title="Language Not Found"
            description="The language you're looking for doesn't exist."
          />
        </div>
      </div>
    );
  }

  const beginnerTracks = filteredTracks.filter((track: Track) => track.level === "beginner");
  const intermediateTracks = filteredTracks.filter((track: Track) => track.level === "intermediate");
  const advancedTracks = filteredTracks.filter((track: Track) => track.level === "advanced");
  const completedTrackIds = new Set(
    (completedTracks ?? [])
      .filter((completion) => completion.languageSlug === languageSlug)
      .map((completion) => completion.trackId)
  );
  const completedFilteredTrackCount = filteredTracks.filter((track: Track) =>
    completedTrackIds.has(track._id)
  ).length;
  const hasActiveFilters = query.trim().length > 0 || levelFilter !== "all";

  const resetFilters = () => {
    setQuery("");
    setLevelFilter("all");
  };

  return (
    <div className="learn-page-shell min-h-screen">
      <div className="learn-grid-overlay absolute inset-0" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="mb-8">
          <LearnBreadcrumb />
        </div>

        <div className="learn-shell-panel rounded-3xl p-6 sm:p-8 mb-10">
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="learn-chip inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-[var(--text-3)] mb-3">
                  <BookOpen className="h-4 w-4 text-[var(--accent)]" />
                  {tracks.length} {tracks.length === 1 ? "Track" : "Tracks"}
                </div>
                <h1 className="learn-heading text-4xl sm:text-5xl font-semibold text-[var(--text-1)] mb-2 capitalize">
                  {currentLanguage?.name || languageSlug}
                </h1>
                <p className="text-lg text-[var(--text-3)] max-w-2xl">
                  Choose a track to start your learning journey. Begin with fundamentals and move into advanced concepts.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="learn-chip flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[var(--text-3)]">
                  <Search className="h-4 w-4" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search tracks"
                    className="bg-transparent focus:outline-none text-[var(--text-2)] placeholder:text-[var(--text-4)]"
                    aria-label="Search tracks"
                  />
                  {query.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="rounded-full p-0.5 text-[var(--text-4)] hover:text-[var(--text-2)]"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="learn-secondary-btn inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear Filters
                  </button>
                )}
              </div>

              <TabsList>
                {(["all", "beginner", "intermediate", "advanced"] as const).map((level) => (
                  <TabsTrigger
                    key={level}
                    active={levelFilter === level}
                    onClick={() => setLevelFilter(level)}
                  >
                    {level === "all" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="learn-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[var(--text-3)]">
                Showing {filteredTracks.length} of {tracks.length}
              </span>
              <span className="learn-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[var(--text-3)]">
                {completedFilteredTrackCount} completed
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-10">
            {filteredTracks.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-8 w-8" />}
                title="No matching tracks"
                description="Try adjusting your search or filters to see more results."
              />
            ) : (
              <>
                {levelFilter === "all" && beginnerTracks.length > 0 && (
                  <section>
                    <h2 className="learn-heading text-lg font-semibold text-[var(--text-1)] mb-4">Beginner</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {beginnerTracks.map((track: Track) => (
                        <TrackCard
                          key={track.slug}
                          languageSlug={languageSlug}
                          slug={track.slug}
                          title={track.title}
                          description={track.description}
                          level="beginner"
                          {...(completedTrackIds.has(track._id) && { status: "completed", progress: 100 })}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {levelFilter === "all" && intermediateTracks.length > 0 && (
                  <section>
                    <h2 className="learn-heading text-lg font-semibold text-[var(--text-1)] mb-4">Intermediate</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {intermediateTracks.map((track: Track) => (
                        <TrackCard
                          key={track.slug}
                          languageSlug={languageSlug}
                          slug={track.slug}
                          title={track.title}
                          description={track.description}
                          level="intermediate"
                          {...(completedTrackIds.has(track._id) && { status: "completed", progress: 100 })}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {levelFilter === "all" && advancedTracks.length > 0 && (
                  <section>
                    <h2 className="learn-heading text-lg font-semibold text-[var(--text-1)] mb-4">Advanced</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {advancedTracks.map((track: Track) => (
                        <TrackCard
                          key={track.slug}
                          languageSlug={languageSlug}
                          slug={track.slug}
                          title={track.title}
                          description={track.description}
                          level="advanced"
                          {...(completedTrackIds.has(track._id) && { status: "completed", progress: 100 })}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {levelFilter !== "all" && (
                  <section>
                    <h2 className="learn-heading text-lg font-semibold text-[var(--text-1)] mb-4">
                      {levelFilter.charAt(0).toUpperCase() + levelFilter.slice(1)} Tracks
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {filteredTracks.map((track: Track) => (
                        <TrackCard
                          key={track.slug}
                          languageSlug={languageSlug}
                          slug={track.slug}
                          title={track.title}
                          description={track.description}
                          level={track.level as "beginner" | "intermediate" | "advanced" | undefined}
                          {...(completedTrackIds.has(track._id) && { status: "completed", progress: 100 })}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="learn-panel p-6 rounded-2xl">
                <h3 className="learn-heading text-lg font-semibold text-[var(--text-1)] mb-4">Track Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-3)] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                      Beginner
                    </span>
                    <span className="font-semibold text-[var(--success)]">{beginnerTracks.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                    <span className="text-[var(--text-3)] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--warning)]" />
                      Intermediate
                    </span>
                    <span className="font-semibold text-[var(--warning)]">{intermediateTracks.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-[var(--text-3)] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--danger)]" />
                      Advanced
                    </span>
                    <span className="font-semibold text-[var(--danger)]">{advancedTracks.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
