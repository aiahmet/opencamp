"use client";

import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LearnBreadcrumb } from "@/components/learn/Breadcrumb";
import { LinearProgress, StatusBadge, ProgressStatus, ProgressSummary } from "@/components/learn/ProgressIndicator";
import { ListSkeleton } from "@/components/ui/LoadingSkeleton";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Play,
  BookOpen,
  Code2,
  Target,
  Trophy,
} from "lucide-react";

type Module = {
  slug: string;
  title: string;
  description?: string;
  items: Item[];
};

type Item = {
  _id: string;
  slug: string;
  title: string;
  kind: string;
};

type Progress = {
  itemId: string;
  status: string;
};

const levelConfig = {
  beginner: {
    icon: BookOpen,
    label: "Beginner",
    tone: "text-[var(--success)]",
    bg: "bg-[var(--success-muted)]",
  },
  intermediate: {
    icon: Target,
    label: "Intermediate",
    tone: "text-[var(--warning)]",
    bg: "bg-[var(--warning-muted)]",
  },
  advanced: {
    icon: Trophy,
    label: "Advanced",
    tone: "text-[var(--danger)]",
    bg: "bg-[var(--danger-muted)]",
  },
};

const kindIcons: Record<string, React.ReactNode> = {
  lesson: <BookOpen className="h-4 w-4" />,
  challenge: <Code2 className="h-4 w-4" />,
  quiz: <Target className="h-4 w-4" />,
  project: <Trophy className="h-4 w-4" />,
};

export default function TrackPage() {
  const params = useParams();
  const languageSlug = params.language as string;
  const trackSlug = params.track as string;
  const trackTree = useQuery(api.curriculum.getTrackTree, {
    languageSlug,
    trackSlug,
  });
  const certificate = useQuery(
    api.certificates.getCertificateForUserTrack,
    trackTree?.track?._id ? { trackId: trackTree.track._id } : "skip"
  );
  const issueCertificateForTrack = useAction(api.certificates.issueCertificateForTrack);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isClaimingCertificate, setIsClaimingCertificate] = useState(false);
  const [claimCertificateError, setClaimCertificateError] = useState("");
  const [claimedCertificateCode, setClaimedCertificateCode] = useState<string | null>(null);

  const allItemIds = useMemo(() => {
    if (!trackTree) return [];
    const itemIds: string[] = [];
    trackTree.modules.forEach((module: Module) => {
      module.items.forEach((item: Item) => {
        itemIds.push(item._id);
      });
    });
    return itemIds;
  }, [trackTree]);

  const progressData = useQuery(
    api.progress.getProgressForItems,
    allItemIds.length > 0 ? { itemIds: allItemIds as Id<"curriculumItems">[] } : "skip"
  );

  const progressByItemId = useMemo(() => {
    const map = new Map<string, ProgressStatus>();
    progressData?.forEach((progress: Progress) => {
      map.set(progress.itemId, (progress.status || "not_started") as ProgressStatus);
    });
    return map;
  }, [progressData]);

  const getProgressStatus = useCallback(
    (itemId: string): ProgressStatus => {
      return progressByItemId.get(itemId) ?? "not_started";
    },
    [progressByItemId]
  );

  const trackProgress = useMemo(() => {
    if (!progressData || !allItemIds.length) return null;
    const completed = progressData.filter((p) => p.status === "completed").length;
    const inProgress = progressData.filter((p) => p.status === "in_progress").length;
    return { completed, total: allItemIds.length, inProgress };
  }, [progressData, allItemIds]);
  const isTrackComplete =
    trackProgress !== null && trackProgress.total > 0 && trackProgress.completed === trackProgress.total;
  const isCertificateLoaded = certificate !== undefined;
  const certificateCode = claimedCertificateCode || certificate?.code || null;
  const hasCertificate = Boolean(certificateCode);
  const canClaimCertificate = isTrackComplete && isCertificateLoaded && !hasCertificate;

  const firstInProgressItem = (() => {
    if (!trackTree) return null;
    for (const mod of trackTree.modules) {
      for (const item of mod.items) {
        const status = progressByItemId.get(item._id) ?? "not_started";
        if (status === "in_progress") {
          return { item, moduleSlug: mod.slug };
        }
      }
    }
    for (const mod of trackTree.modules) {
      for (const item of mod.items) {
        const status = progressByItemId.get(item._id) ?? "not_started";
        if (status === "not_started") {
          return { item, moduleSlug: mod.slug };
        }
      }
    }
    return null;
  })();

  useEffect(() => {
    if (!firstInProgressItem) return;
    setExpandedModules((prev) => {
      if (prev.size > 0) return prev;
      return new Set([firstInProgressItem.moduleSlug]);
    });
  }, [firstInProgressItem]);

  const toggleModule = (moduleSlug: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleSlug)) {
        next.delete(moduleSlug);
      } else {
        next.add(moduleSlug);
      }
      return next;
    });
  };
  const expandAllModules = useCallback(() => {
    setExpandedModules(new Set(trackTree?.modules.map((mod: Module) => mod.slug) ?? []));
  }, [trackTree]);
  const collapseAllModules = useCallback(() => {
    setExpandedModules(new Set());
  }, []);

  const handleClaimCertificate = async () => {
    if (!trackTree?.track?._id) return;
    setIsClaimingCertificate(true);
    setClaimCertificateError("");
    try {
      const code = await issueCertificateForTrack({ trackId: trackTree.track._id });
      setClaimedCertificateCode(code);
    } catch (error) {
      setClaimCertificateError(
        error instanceof Error ? error.message : "Failed to claim certificate"
      );
    } finally {
      setIsClaimingCertificate(false);
    }
  };

  if (trackTree === undefined) {
    return (
      <div className="learn-page-shell min-h-screen">
        <div className="learn-grid-overlay absolute inset-0" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="mb-8 space-y-4">
            <div className="h-6 w-48 bg-[var(--surface-2)] rounded animate-pulse" />
            <div className="h-10 w-64 bg-[var(--surface-2)] rounded animate-pulse" />
          </div>
          <ListSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (trackTree === null) {
    return (
      <div className="learn-page-shell min-h-screen">
        <div className="learn-grid-overlay absolute inset-0" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <LearnBreadcrumb />
          <EmptyState
            icon={<Trophy className="h-8 w-8" />}
            title="Track Not Found"
            description="The track you're looking for doesn't exist."
          />
        </div>
      </div>
    );
  }

  const { track, modules } = trackTree;
  const levelInfo = track.level ? levelConfig[track.level as keyof typeof levelConfig] : null;

  return (
    <div className="learn-page-shell min-h-screen">
      <div className="learn-grid-overlay absolute inset-0" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="mb-8">
          <LearnBreadcrumb />
        </div>

        <div className="learn-shell-panel rounded-3xl p-6 sm:p-8 mb-12">
          <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {levelInfo && (
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border",
                      levelInfo.bg,
                      levelInfo.tone,
                      "border-[var(--border)]"
                    )}
                  >
                    <levelInfo.icon className="h-4 w-4" />
                    {levelInfo.label}
                  </span>
                  {trackProgress && trackProgress.completed > 0 && (
                    <span className="text-sm text-[var(--text-4)]">
                      {trackProgress.completed} of {trackProgress.total} completed
                    </span>
                  )}
                </div>
              )}
              <h1 className="learn-heading text-4xl sm:text-5xl font-semibold text-[var(--text-1)] mb-4">
                {track.title}
              </h1>
              <p className="text-lg text-[var(--text-3)] max-w-3xl">
                {track.description}
              </p>
            </div>

            {trackProgress && trackProgress.total > 0 && (
              <div className="flex-shrink-0">
                <div className="learn-panel rounded-2xl p-6">
                  <ProgressSummary data={trackProgress} showCircular circularSize={80} />
                </div>
              </div>
            )}
          </div>

          {firstInProgressItem && (
            <Link
              href={`/learn/${languageSlug}/items/${firstInProgressItem.item.slug}`}
              className="learn-primary-btn inline-flex items-center gap-3 px-6 py-3 rounded-xl text-slate-950 font-semibold transition-all duration-300"
            >
              <Play className="h-5 w-5" />
              Continue Learning
            </Link>
          )}

          {isTrackComplete && (
            <div className="learn-panel rounded-2xl p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-4)]">
                    Certificate
                  </span>
                  <h2 className="text-xl font-semibold text-[var(--text-1)]">
                    Track complete. Claim your certificate.
                  </h2>
                  <p className="text-sm text-[var(--text-3)]">
                    Get a shareable certificate to prove you finished this track.
                  </p>
                </div>
                {hasCertificate ? (
                  <Link
                    href={`/certificate/${certificateCode}`}
                    className="learn-secondary-btn inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <Trophy className="h-4 w-4" />
                    View Certificate
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handleClaimCertificate}
                    disabled={!canClaimCertificate || isClaimingCertificate}
                    className={cn(
                      "learn-primary-btn inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-slate-950 font-semibold transition-all duration-300",
                      !canClaimCertificate || isClaimingCertificate
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    )}
                  >
                    <Trophy className="h-4 w-4" />
                    {isClaimingCertificate ? "Claiming..." : "Claim Certificate"}
                  </button>
                )}
              </div>
              {claimCertificateError && (
                <p className="mt-3 text-sm text-[var(--danger)]">
                  {claimCertificateError}
                </p>
              )}
              {claimedCertificateCode && (
                <p className="mt-3 text-sm text-[var(--success)]">
                  Certificate issued.{" "}
                  <Link
                    href={`/certificate/${claimedCertificateCode}`}
                    className="font-semibold underline underline-offset-2"
                  >
                    View certificate
                  </Link>
                </p>
              )}
            </div>
          )}
          </div>
        </div>

        {modules.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-8 w-8" />}
            title="No Modules Available"
            description="We’re preparing content for this track. Check back soon!"
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={expandAllModules}
                className="learn-secondary-btn inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAllModules}
                className="learn-secondary-btn inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
              >
                <ChevronUp className="h-4 w-4" />
                Collapse All
              </button>
            </div>
            {modules.map((mod: Module, moduleIndex: number) => {
              const isExpanded = expandedModules.has(mod.slug);
              const moduleProgress = mod.items.reduce(
                (acc, item) => {
                  const status = getProgressStatus(item._id);
                  if (status === "completed") acc.completed++;
                  if (status === "in_progress") acc.inProgress++;
                  acc.total++;
                  return acc;
                },
                { completed: 0, inProgress: 0, total: 0 }
              );

              return (
                <div
                  key={mod.slug}
                  className={cn(
                    "bg-[var(--surface-1)] rounded-2xl border overflow-hidden transition-all duration-200",
                    moduleProgress.completed === moduleProgress.total && moduleProgress.total > 0
                      ? "border-[color:rgba(52,211,153,0.4)]"
                      : moduleProgress.inProgress > 0
                      ? "border-[color:rgba(251,191,36,0.4)]"
                      : "border-[var(--border)]"
                  )}
                >
                  <button
                    onClick={() => toggleModule(mod.slug)}
                    className={cn(
                      "w-full px-6 py-5 flex items-center justify-between gap-4 text-left",
                      "hover:bg-[var(--surface-2)] transition-colors",
                      "min-h-[72px]"
                    )}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-xl text-lg font-bold flex-shrink-0",
                          moduleProgress.completed === moduleProgress.total && moduleProgress.total > 0
                            ? "bg-[var(--success-muted)] text-[var(--success)]"
                            : moduleProgress.inProgress > 0
                            ? "bg-[var(--warning-muted)] text-[var(--warning)]"
                            : "bg-[var(--surface-2)] text-[var(--text-3)]"
                        )}
                      >
                        {moduleProgress.completed === moduleProgress.total && moduleProgress.total > 0 ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          moduleIndex + 1
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-lg font-semibold text-[var(--text-1)] truncate">
                            {mod.title}
                          </h2>
                          {moduleProgress.total > 0 && (
                            <span className="text-sm text-[var(--text-4)] flex-shrink-0">
                              ({moduleProgress.completed}/{moduleProgress.total})
                            </span>
                          )}
                        </div>
                        {mod.description && (
                          <p className="text-sm text-[var(--text-3)] line-clamp-1">
                            {mod.description}
                          </p>
                        )}
                        {moduleProgress.total > 0 && (
                          <div className="mt-2">
                            <LinearProgress
                              progress={(moduleProgress.completed / moduleProgress.total) * 100}
                              size="sm"
                              color={
                                moduleProgress.completed === moduleProgress.total
                                  ? "success"
                                  : moduleProgress.inProgress > 0
                                  ? "warning"
                                  : "primary"
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-[var(--text-4)]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[var(--text-4)]" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[var(--border-subtle)]">
                      <div className="p-4 space-y-2">
                        {mod.items.length === 0 ? (
                          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-3)]">
                            No lessons yet. Content for this module is coming soon.
                          </div>
                        ) : (
                          mod.items.map((item: Item, index: number) => {
                            const status = getProgressStatus(item._id);
                            return (
                              <Link
                                key={item.slug}
                                href={`/learn/${languageSlug}/items/${item.slug}`}
                                className={cn(
                                  "flex items-center gap-4 p-4 rounded-lg",
                                  "border border-transparent",
                                  "hover:bg-[var(--surface-2)]",
                                  "hover:border-[var(--border)]",
                                  "transition-all duration-200",
                                  "group min-h-[64px]",
                                  status === "in_progress" &&
                                    "ring-1 ring-[color:rgba(251,191,36,0.4)] bg-[var(--warning-muted)]"
                                )}
                              >
                                <div
                                  className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                                    status === "completed"
                                      ? "bg-[var(--success-muted)]"
                                      : status === "in_progress"
                                      ? "bg-[var(--warning-muted)]"
                                      : "bg-[var(--surface-2)]"
                                  )}
                                >
                                  {status === "completed" ? (
                                    <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
                                  ) : status === "in_progress" ? (
                                    <div className="w-5 h-5 border-2 border-[var(--warning)] border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <span className="text-[var(--text-4)]">{index + 1}</span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-4)] flex items-center gap-1">
                                      {kindIcons[item.kind]}
                                      {item.kind}
                                    </span>
                                  </div>
                                  <span className="font-medium text-[var(--text-1)] truncate block">
                                    {item.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <StatusBadge status={status} showLabel size="sm" />
                                </div>
                              </Link>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
