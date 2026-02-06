"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { LearnBreadcrumb } from "@/components/learn/Breadcrumb";
import { StatusBadge, ProgressStatus } from "@/components/learn/ProgressIndicator";
import { LessonContent, ProblemStatement } from "@/components/learn/ItemPage/LessonContent";
import { ChallengeWorkspace } from "@/components/learn/ItemPage/ChallengeWorkspace";
import { SubmissionHistory } from "@/components/learn/ItemPage/SubmissionHistory";
import { DiscussionPreview } from "@/components/learn/ItemPage/DiscussionPreview";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  MessageSquare,
  History,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

type Tab = "content" | "submissions" | "discussion";

type TrackTreeItem = {
  _id: string;
  slug: string;
  title: string;
  kind: string;
};

export default function ItemPage() {
  const params = useParams();
  const languageSlug = params.language as string;
  const itemSlug = params.item as string;
  const router = useRouter();
  const { addToast } = useToast();

  const itemData = useQuery(api.curriculum.getItemBySlugs, {
    languageSlug,
    itemSlug,
  });

  const itemDiscussions = useQuery(
    api.discussions.listDiscussionsByItemSlug,
    itemSlug ? { itemSlug, limit: 5 } : "skip"
  );

  const draft = useQuery(
    api.drafts.getDraft,
    itemData?.item._id ? { itemId: itemData.item._id } : "skip"
  );
  const submissions = useQuery(
    api.submissions.listSubmissionsForItem,
    itemData?.item._id ? { itemId: itemData.item._id, limit: 20 } : "skip"
  );
  const progressData = useQuery(
    api.progress.getProgressForItems,
    itemData?.item._id ? { itemIds: [itemData.item._id] } : "skip"
  );

  const trackTree = useQuery(
    api.curriculum.getTrackTree,
    itemData?.track?.slug ? { languageSlug, trackSlug: itemData.track.slug } : "skip"
  );

  const upsertDraft = useMutation(api.drafts.upsertDraft);
  const deleteDraft = useMutation(api.drafts.deleteDraft);
  const createAndRunSubmission = useAction(api.submissions.createAndRunSubmission);
  const markCompleted = useMutation(api.progress.markCompleted);
  const usage = useQuery(api.usage.getMyUsage);

  const initialCode = draft && draft.code ? draft.code : (itemData?.item.starterCode ?? "");
  const [code, setCode] = useState(initialCode);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState<{ code: string; message: string; retryAfterMs?: number; resetsAtMs?: number } | null>(null);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
  const [pendingSave, setPendingSave] = useState<{ code: string; itemId: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("content");

  useEffect(() => {
    if (!pendingSave || !itemData?.item._id) return;

    const { code: codeToSave } = pendingSave;
    const saveTimer = setTimeout(async () => {
      try {
        setSaveStatus("saving");
        await upsertDraft({ itemId: itemData.item._id, code: codeToSave });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        console.error("Failed to save draft:", error);
        setSaveStatus("idle");
      } finally {
        setPendingSave((prev) => (prev?.code === codeToSave ? null : prev));
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [pendingSave, itemData?.item._id, upsertDraft]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (itemData?.item._id && draft !== undefined) {
      setPendingSave({ code: newCode, itemId: itemData.item._id });
    }
  };

  const handleRun = async () => {
    if (!itemData?.item._id) return;
    setIsRunning(true);
    setRunError(null);
    try {
      const result = await createAndRunSubmission({ itemId: itemData.item._id, code });

      if (result && typeof result === "object" && "blocked" in result && result.blocked) {
        const errorData = result as { code: string; message: string; retryAfterMs?: number; resetsAtMs?: number };
        setRunError(errorData);

        if (errorData.retryAfterMs) {
          setCooldownEnd(Date.now() + errorData.retryAfterMs);
          setTimeout(() => {
            setCooldownEnd(null);
            setRunError(null);
          }, errorData.retryAfterMs);
        }
      }
    } catch (error) {
      console.error("Failed to run submission:", error);
      addToast({
        title: "Run failed",
        description: "We couldn't execute your code. Please try again.",
        variant: "error",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = async () => {
    if (!itemData?.item.starterCode || !itemData?.item._id) return;
    setCode(itemData.item.starterCode);
    setPendingSave(null);
    try {
      await deleteDraft({ itemId: itemData.item._id });
      addToast({
        title: "Draft reset",
        description: "Your editor was reset to the starter code.",
      });
    } catch (error) {
      console.error("Failed to delete draft:", error);
    }
  };

  const handleMarkCompleted = async () => {
    if (!itemData?.item._id) return;
    try {
      await markCompleted({ itemId: itemData.item._id });
      addToast({
        title: "Marked complete",
        description: "Nice work. Keep the streak going.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to mark as completed:", error);
      addToast({
        title: "Could not mark complete",
        description: "Please try again in a moment.",
        variant: "error",
      });
    }
  };

  const handleLessonComplete = async () => {
    await handleMarkCompleted();
    if (nextItem) {
      router.push(`/learn/${languageSlug}/items/${nextItem.slug}`);
    }
  };

  const handleLoadSubmission = (submissionCode: string) => {
    setCode(submissionCode);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progressStatus: ProgressStatus = (progressData?.[0]?.status || "not_started") as ProgressStatus;

  const flatItems = useMemo(() => {
    if (!trackTree) return [] as TrackTreeItem[];
    return trackTree.modules.flatMap((mod) => mod.items) as TrackTreeItem[];
  }, [trackTree]);

  const currentIndex = useMemo(() => {
    if (!itemData?.item._id) return -1;
    return flatItems.findIndex((item) => item._id === itemData.item._id);
  }, [flatItems, itemData?.item._id]);

  const previousItem = currentIndex > 0 ? flatItems[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : null;

  if (itemData === undefined) {
    return (
      <div className="learn-page-shell min-h-screen">
        <div className="learn-grid-overlay absolute inset-0" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="mb-8 space-y-4">
            <div className="h-6 w-48 bg-[var(--surface-2)] rounded animate-pulse" />
            <div className="h-10 w-64 bg-[var(--surface-2)] rounded animate-pulse" />
          </div>
          <CardSkeleton showTitle lines={4} />
        </div>
      </div>
    );
  }

  if (itemData === null) {
    return (
      <div className="learn-page-shell min-h-screen">
        <div className="learn-grid-overlay absolute inset-0" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <LearnBreadcrumb />
          <EmptyState
            icon={<BookOpen className="h-8 w-8" />}
            title="Item Not Found"
            description="The item you're looking for doesn't exist."
          />
        </div>
      </div>
    );
  }

  const { item, track } = itemData;
  const latestSubmission = submissions?.[0] ?? null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number | undefined }[] = [
    {
      id: "content",
      label: item.kind === "lesson" ? "Lesson" : "Challenge",
      icon: item.kind === "lesson" ? <BookOpen className="h-4 w-4" /> : <Code2 className="h-4 w-4" />,
    },
    {
      id: "submissions",
      label: "Submissions",
      icon: <History className="h-4 w-4" />,
      count: submissions?.length,
    },
    {
      id: "discussion",
      label: "Discussion",
      icon: <MessageSquare className="h-4 w-4" />,
      count: itemDiscussions?.discussions?.length,
    },
  ];

  return (
    <div className="learn-page-shell min-h-screen">
      <div className="learn-grid-overlay absolute inset-0" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6">
          <LearnBreadcrumb />
        </div>

        <div className="learn-shell-panel rounded-3xl p-6 sm:p-8 mb-6">
          <Link
            href={`/learn/${languageSlug}/tracks/${track?.slug}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {track?.title || "Track"}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border",
                item.kind === "lesson"
                  ? "bg-[var(--success-muted)] text-[var(--success)] border-[color:rgba(52,211,153,0.4)]"
                  : "bg-[var(--accent-muted)] text-[var(--accent)] border-[color:rgba(125,211,252,0.4)]"
              )}
            >
              {item.kind === "lesson" ? (
                <BookOpen className="h-4 w-4" />
              ) : (
                <Code2 className="h-4 w-4" />
              )}
              <span className="capitalize">{item.kind}</span>
            </span>

            <StatusBadge status={progressStatus} size="md" showLabel />
          </div>

          <h1 className="learn-heading text-3xl sm:text-4xl font-semibold text-[var(--text-1)] mb-2">
            {item.title}
          </h1>

          {progressStatus === "completed" && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--success-muted)] text-[var(--success)] rounded-full text-sm font-medium border border-[color:rgba(52,211,153,0.4)]">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </div>
          )}
        </div>

        <div className="learn-panel rounded-2xl border-b border-[var(--border)] mb-8 p-2">
          <nav className="flex gap-2 -mb-px overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 rounded-lg transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-[var(--accent-strong)] bg-[var(--nav-chip-bg)] text-[var(--text-1)]"
                    : "border-transparent text-[var(--text-3)] hover:text-[var(--text-1)]"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      activeTab === tab.id
                        ? "bg-[var(--surface-3)] text-[var(--text-1)]"
                        : "bg-[var(--surface-2)] text-[var(--text-3)]"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-8">
          {activeTab === "content" && (
            <>
              {item.kind === "lesson" && item.content && (
                <div className="space-y-4">
                  <LessonContent content={item.content} showToc />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-[var(--text-4)]">
                      Mark this lesson complete when you are ready to move on.
                    </div>
                    <button
                      type="button"
                      onClick={handleLessonComplete}
                      className="learn-primary-btn inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark Complete
                    </button>
                  </div>
                </div>
              )}

              {item.kind === "challenge" && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                  <div className="space-y-6">
                    {item.prompt && <ProblemStatement prompt={item.prompt} />}
                  </div>

                  <div className="space-y-6">
                    <ChallengeWorkspace
                      code={code}
                      languageId={itemData.language.editorConfig.monacoLanguageId}
                      onCodeChange={handleCodeChange}
                      onRun={handleRun}
                      onReset={handleReset}
                      onMarkCompleted={handleMarkCompleted}
                      isRunning={isRunning}
                      cooldownEnd={cooldownEnd}
                      saveStatus={saveStatus}
                      error={runError}
                      usage={usage}
                      latestSubmission={latestSubmission}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "submissions" && (
            <>
              {submissions && submissions.length > 0 ? (
                <SubmissionHistory
                  submissions={submissions}
                  onLoadCode={handleLoadSubmission}
                />
              ) : (
                <EmptyState
                  icon={<History className="h-8 w-8" />}
                  title="No Submissions Yet"
                  description="Run your code to see your submission history here."
                />
              )}
            </>
          )}

          {activeTab === "discussion" && (
            <DiscussionPreview
              itemId={item._id}
              discussions={itemDiscussions?.discussions ?? []}
            />
          )}
        </div>

        <div className="mt-12 border-t border-[var(--border-subtle)] pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-[var(--text-3)]">
              <span>Progress status:</span>
              <StatusBadge status={progressStatus} size="sm" showLabel />
            </div>
            <div className="flex items-center gap-3">
              {previousItem ? (
                <Link
                  href={`/learn/${languageSlug}/items/${previousItem.slug}`}
                  className="learn-secondary-btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              ) : (
                <span className="text-sm text-[var(--text-4)]">Start of track</span>
              )}
              {nextItem ? (
                <Link
                  href={`/learn/${languageSlug}/items/${nextItem.slug}`}
                  className="learn-primary-btn inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="text-sm text-[var(--text-4)]">End of track</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
