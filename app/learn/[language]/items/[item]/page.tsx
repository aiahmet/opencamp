"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import CodeEditor from "@/components/challenges/CodeEditor";

export default function ItemPage() {
  const params = useParams();
  const languageSlug = params.language as string;
  const itemSlug = params.item as string;
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

  const upsertDraft = useMutation(api.drafts.upsertDraft);
  const deleteDraft = useMutation(api.drafts.deleteDraft);
  const createAndRunSubmission = useAction(api.submissions.createAndRunSubmission);
  const markCompleted = useMutation(api.progress.markCompleted);
  const usage = useQuery(api.usage.getMyUsage);

  const initialCode = draft && draft.code ? draft.code : (itemData?.item.starterCode ?? "");
  const [code, setCode] = useState(initialCode);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [runError, setRunError] = useState<{ code: string; message: string; retryAfterMs?: number; resetsAtMs?: number } | null>(null);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
  const [pendingSave, setPendingSave] = useState<{ code: string; itemId: string } | null>(null);

  // Proper debounce with race condition prevention
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
        // Only clear pending save if the code hasn't changed
        setPendingSave((prev) => (prev?.code === codeToSave ? null : prev));
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [pendingSave, itemData?.item._id, upsertDraft]);

  // Update code and trigger debounced save
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (itemData?.item._id && draft === undefined) {
      setPendingSave({ code: newCode, itemId: itemData.item._id });
    }
  };

  const handleRun = async () => {
    if (!itemData?.item._id) return;
    setIsRunning(true);
    setRunError(null);
    try {
      const result = await createAndRunSubmission({ itemId: itemData.item._id, code });
      
      // Handle rate limit or quota errors
      if (result && typeof result === 'object' && 'blocked' in result && result.blocked) {
        const errorData = result as { code: string; message: string; retryAfterMs?: number; resetsAtMs?: number };
        setRunError(errorData);
        
        if (errorData.retryAfterMs) {
          setCooldownEnd(Date.now() + errorData.retryAfterMs);
          // Auto-clear cooldown after the time passes
          setTimeout(() => {
            setCooldownEnd(null);
            setRunError(null);
          }, errorData.retryAfterMs);
        }
      }
    } catch (error) {
      console.error("Failed to run submission:", error);
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
    } catch (error) {
      console.error("Failed to delete draft:", error);
    }
  };

  const handleMarkCompleted = async () => {
    if (!itemData?.item._id) return;
    try {
      await markCompleted({ itemId: itemData.item._id });
    } catch (error) {
      console.error("Failed to mark as completed:", error);
    }
  };

  const handleLoadSubmission = (submissionCode: string) => {
    setCode(submissionCode);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const progressStatus = progressData?.[0]?.status || "not_started";

  if (itemData === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (itemData === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/learn"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            &larr; Back to Learn
          </Link>
          <div className="text-center text-gray-600 py-12">
            <p>Item not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const { item, track } = itemData;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/learn/${languageSlug}/tracks/${track?.slug}`}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          &larr; Back to {track?.title}
        </Link>

        <div className="mb-4 flex items-center gap-3">
          <span className="px-2 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800">
            {item.kind}
          </span>
          {item.kind === "challenge" && (
            <>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  progressStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : progressStatus === "in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {progressStatus === "completed"
                  ? "Completed"
                  : progressStatus === "in_progress"
                  ? "In Progress"
                  : "Not Started"}
              </span>
            </>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">{item.title}</h1>

        {item.kind === "lesson" && item.content && (
          <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
               components={{
code: (props: { inline?: boolean; children?: React.ReactNode }) => {
                    const { inline, children } = props;
                   return (
                     <code className={inline ? "bg-gray-100 px-1 py-0.5 rounded" : ""} {...props}>
                       {children}
                     </code>
                   );
                 },
pre: (props: { children?: React.ReactNode }) => {
                    const { children } = props;
                   return (
                     <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto" {...props}>
                       {children}
                     </pre>
                   );
                 },
               }}
            >
              {item.content}
            </ReactMarkdown>
          </div>
        )}

        {item.kind === "challenge" && (
          <div className="space-y-6">
            {item.prompt && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Problem Statement
                </h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {item.prompt}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Code Editor</h2>
                {saveStatus === "saving" && (
                  <span className="text-sm text-gray-500">Saving...</span>
                )}
                {saveStatus === "saved" && (
                  <span className="text-sm text-green-600">Saved</span>
                )}
              </div>

              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                languageId={itemData.language.editorConfig.monacoLanguageId}
              />

              <div className="flex gap-3 mt-4 flex-wrap items-center">
                <button
                  onClick={handleRun}
                  disabled={isRunning || !!cooldownEnd}
                  className={`px-6 py-3 text-white rounded-lg transition-colors ${
                    isRunning || cooldownEnd
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isRunning ? "Running..." : cooldownEnd ? `Wait ${Math.ceil((cooldownEnd - Date.now()) / 1000)}s` : "Run"}
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset to Starter
                </button>
                <button
                  onClick={handleMarkCompleted}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Completed
                </button>
                
                {/* Quota Display */}
                {usage && (
                  <div className="ml-auto text-sm text-gray-600">
                    Runs today: {usage.runsUsed} / {usage.runsLimit}
                    {usage.runsUsed >= usage.runsLimit && (
                      <span className="text-red-600 ml-2">(Limit reached)</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Error Messages */}
              {runError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{runError.message}</p>
                  {runError.resetsAtMs && (
                    <p className="text-red-600 text-sm mt-1">
                      Resets at {new Date(runError.resetsAtMs).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {submissions && submissions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Submissions
                </h2>
                <div className="space-y-3">
                   {submissions.map((submission: Doc<"submissions">) => (
                    <div
                      key={submission._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              submission.status === "passed"
                                ? "bg-green-100 text-green-800"
                                : submission.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : submission.status === "error"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {submission.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(submission.createdAt)}
                          </span>
                          {submission.result?.timingMs && (
                            <span className="text-sm text-gray-500">
                              ({submission.result.timingMs}ms)
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {submission.result && (
                            <button
                              onClick={() => setSelectedSubmission(
                                selectedSubmission === submission._id ? null : submission._id
                              )}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {selectedSubmission === submission._id ? "Hide Details" : "Show Details"}
                            </button>
                          )}
                          <button
                            onClick={() => handleLoadSubmission(submission.code)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Load Code
                          </button>
                        </div>
                      </div>
                      {selectedSubmission === submission._id && submission.result && (
                        <div className="mt-4 space-y-3">
                          {submission.result.compile && (
                            <div className="border rounded-lg p-3">
                              <h3 className="font-medium text-gray-900 mb-2">Compilation</h3>
                              {submission.result.compile.ok ? (
                                <span className="text-green-600">✓ Compiled successfully</span>
                              ) : (
                                <div>
                                  <span className="text-red-600">✗ Compilation failed</span>
                                  {submission.result.compile.stderr && (
                                    <pre className="mt-2 bg-red-50 p-2 rounded text-sm overflow-x-auto">
                                      {submission.result.compile.stderr}
                                    </pre>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {submission.result.compile.ok && submission.result.tests && (
                            <div className="border rounded-lg p-3">
                              <h3 className="font-medium text-gray-900 mb-2">Tests</h3>
                              <div className="space-y-2">
                                {submission.result.tests.map((test: { name: string; passed: boolean; expected?: unknown; actual?: unknown; stderr?: string }, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <span className={test.passed ? "text-green-600" : "text-red-600"}>
                                      {test.passed ? "✓" : "✗"}
                                    </span>
                                    <span className="text-sm">{test.name}</span>
                                    {!test.passed && (
                                      <span className="text-sm text-gray-600">
                                        (expected: {JSON.stringify(test.expected)}, actual: {JSON.stringify(test.actual)})
                                      </span>
                                    )}
                                    {test.stderr && (
                                      <span className="text-sm text-red-600 ml-2">{test.stderr}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {submission.result.stdout && (
                            <div className="border rounded-lg p-3">
                              <h3 className="font-medium text-gray-900 mb-2">Stdout</h3>
                              <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto">
                                {submission.result.stdout}
                              </pre>
                            </div>
                          )}
                          {submission.result.stderr && !submission.result.compile.ok && (
                            <div className="border rounded-lg p-3">
                              <h3 className="font-medium text-gray-900 mb-2">Stderr</h3>
                              <pre className="bg-red-50 p-2 rounded text-sm overflow-x-auto">
                                {submission.result.stderr}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {itemDiscussions && itemDiscussions.discussions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Discussions</h2>
                  <Link
                    href={`/items/${itemSlug}/discuss`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all →
                  </Link>
                </div>
                <div className="space-y-3">
                  {itemDiscussions.discussions.slice(0, 5).map((discussion) => (
                    <Link
                      key={discussion._id}
                      href={`/discuss/${discussion._id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            discussion.type === "help"
                              ? "bg-green-100 text-green-800"
                              : discussion.type === "showcase"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {discussion.type}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{discussion.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{discussion.authorUsername}</span>
                        <span>•</span>
                        <span>{formatDate(discussion.updatedAt)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {itemDiscussions && itemDiscussions.discussions.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Discussions</h2>
                  <Link
                    href={`/items/${itemSlug}/discuss`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Start a discussion →
                  </Link>
                </div>
                <p className="text-gray-600 text-sm">
                  No discussions yet. Ask questions or share your work!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
