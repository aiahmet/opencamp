"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

function computeDiff(oldText: string | undefined, newText: string | undefined) {
  if (!oldText) return { added: newText || "", removed: "", unchanged: "" };
  if (!newText) return { added: "", removed: oldText, unchanged: "" };

  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  const result = { added: "", removed: "", unchanged: "" };
  let oldIndex = 0;
  let newIndex = 0;

  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (oldIndex < oldLines.length && newIndex < newLines.length && oldLines[oldIndex] === newLines[newIndex]) {
      result.unchanged += oldLines[oldIndex] + "\n";
      oldIndex++;
      newIndex++;
    } else {
      if (oldIndex < oldLines.length) {
        result.removed += oldLines[oldIndex] + "\n";
        oldIndex++;
      }
      if (newIndex < newLines.length) {
        result.added += newLines[newIndex] + "\n";
        newIndex++;
      }
    }
  }

  return result;
}

export default function ReviewContributionPage() {
  const params = useParams();
  const router = useRouter();
  const contributionId = params.id as string;

  const contributionData = useQuery(api.contributions.getContribution, {
    contributionId: contributionId as import("@/convex/_generated/dataModel").Id<"contributions">,
  });

  const requestChanges = useMutation(api.contributions.requestChanges);
  const rejectContribution = useMutation(api.contributions.rejectContribution);
  const publishContribution = useAction(api.contributions.publishContribution);

  const [reviewerNote, setReviewerNote] = useState("");
  const [action, setAction] = useState<"request" | "reject" | "publish" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!contributionData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const { contribution, item, language, module, track } = contributionData;

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">Item not found</div>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800",
    submitted: "bg-blue-100 text-blue-800",
    changes_requested: "bg-orange-100 text-orange-800",
    rejected: "bg-red-100 text-red-800",
    published: "bg-green-100 text-green-800",
  };

  const diffContent = computeDiff(item.content || "", contribution.content || "");
  const diffPrompt = computeDiff(item.prompt || "", contribution.prompt || "");
  const diffStarterCode = computeDiff(item.starterCode || "", contribution.starterCode || "");

  const handleAction = async () => {
    setProcessing(true);
    setError("");

    try {
      if (action === "request") {
        await requestChanges({
          contributionId: contribution._id,
          reviewerNote,
        });
        router.push("/review");
      } else if (action === "reject") {
        await rejectContribution({
          contributionId: contribution._id,
          reviewerNote,
        });
        router.push("/review");
      } else if (action === "publish") {
        const result = await publishContribution({
          contributionId: contribution._id,
        });
        alert(`Published successfully! Version: ${result.version}`);
        router.push("/review");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setProcessing(false);
      setAction(null);
      setReviewerNote("");
    }
  };

  const hasChanges =
    contribution.title !== item.title ||
    contribution.content !== item.content ||
    contribution.prompt !== item.prompt ||
    contribution.starterCode !== item.starterCode;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/review" className="text-blue-600 hover:text-blue-800">
            ← Back to Review Queue
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Review: {item.title}
              </h1>
              <p className="text-gray-600">
                {language?.name} / {track?.slug} / {module?.title} / {item.kind}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[contribution.status]}`}>
              {contribution.status.replace(/_/g, " ")}
            </span>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-1">Changelog</h3>
            <p className="text-blue-700">{contribution.changelog}</p>
          </div>
        </div>

        {!hasChanges ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <p className="text-yellow-800 font-semibold">No changes detected</p>
            <p className="text-yellow-700">The draft is identical to the live version.</p>
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Title</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Current (Live)</h3>
                  <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
                    {item.title}
                  </pre>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-600 mb-2">Draft</h3>
                  <pre className="bg-blue-50 p-4 rounded-md text-sm overflow-x-auto">
                    {contribution.title}
                  </pre>
                </div>
              </div>
            </div>

            {item.kind === "lesson" && (diffContent.added || diffContent.removed) && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Content</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Current (Live)</h3>
                    <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto max-h-96 overflow-y-auto">
                      {item.content || "<empty>"}
                    </pre>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-600 mb-2">Draft</h3>
                    <pre className="bg-blue-50 p-4 rounded-md text-sm overflow-x-auto max-h-96 overflow-y-auto">
                      {contribution.content || "<empty>"}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {item.kind === "challenge" && (
              <>
                {(diffPrompt.added || diffPrompt.removed) && (
                  <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Prompt</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Current (Live)</h3>
                        <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto max-h-64 overflow-y-auto">
                          {item.prompt || "<empty>"}
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-blue-600 mb-2">Draft</h3>
                        <pre className="bg-blue-50 p-4 rounded-md text-sm overflow-x-auto max-h-64 overflow-y-auto">
                          {contribution.prompt || "<empty>"}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {(diffStarterCode.added || diffStarterCode.removed) && (
                  <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Starter Code</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Current (Live)</h3>
                        <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto max-h-64 overflow-y-auto font-mono">
                          {item.starterCode || "<empty>"}
                        </pre>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-blue-600 mb-2">Draft</h3>
                        <pre className="bg-blue-50 p-4 rounded-md text-sm overflow-x-auto max-h-64 overflow-y-auto font-mono">
                          {contribution.starterCode || "<empty>"}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {contribution.status === "submitted" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviewer Actions</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reviewer Note
              </label>
              <textarea
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                placeholder="Add your feedback here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 mb-4">{error}</div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setAction("request")}
                disabled={processing}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Request Changes
              </button>

              <button
                onClick={() => setAction("reject")}
                disabled={processing}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Reject
              </button>

              <button
                onClick={() => setAction("publish")}
                disabled={processing || !hasChanges}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Publish
              </button>
            </div>
          </div>
        )}

        {action && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">
                {action === "request" && "Request Changes"}
                {action === "reject" && "Reject Contribution"}
                {action === "publish" && "Publish Contribution"}
              </h2>

              <p className="text-gray-600 mb-4">
                {action === "request" && "Are you sure you want to request changes? The contributor will be able to edit and resubmit."}
                {action === "reject" && "Are you sure you want to reject this contribution? This cannot be undone."}
                {action === "publish" && "Are you sure you want to publish this contribution? This will update the live content and create a new version."}
              </p>

              {action !== "publish" && !reviewerNote.trim() && (
                <div className="text-sm text-red-600 mb-4">
                  Please provide a reviewer note before {action === "request" ? "requesting changes" : "rejecting"}.
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setAction(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={processing || (action !== "publish" && !reviewerNote.trim())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {processing ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
