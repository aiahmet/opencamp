"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ContributionEditorPage() {
  const params = useParams();
  const router = useRouter();
  const contributionId = params.id as string;

  const contributionData = useQuery(api.contributions.getContribution, {
    contributionId: contributionId as import("@/convex/_generated/dataModel").Id<"contributions">,
  });

  const updateContribution = useMutation(api.contributions.updateContribution);
  const submitContribution = useMutation(api.contributions.submitContribution);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [testSuiteDefinition, setTestSuiteDefinition] = useState("");
  const [changelog, setChangelog] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isInitialized, setIsInitialized] = useState(false);

  if (!contributionData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const { contribution, item, language, module } = contributionData;

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">Item not found</div>
        </div>
      </div>
    );
  }

  if (!isInitialized && contribution) {
    setTitle(contribution.title || "");
    setContent(contribution.content || "");
    setPrompt(contribution.prompt || "");
    setStarterCode(contribution.starterCode || "");
    setTestSuiteDefinition(
      contribution.testSuiteDefinition
        ? JSON.stringify(contribution.testSuiteDefinition, null, 2)
        : ""
    );
    setChangelog(contribution.changelog || "");
    setIsInitialized(true);
  }

  const isPublished = contribution.status === "published";
  const canEdit = !isPublished;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const fields: Record<string, string | Record<string, unknown>> = {};
      if (title !== contribution.title) fields.title = title;
      if (content !== contribution.content) fields.content = content;
      if (prompt !== contribution.prompt) fields.prompt = prompt;
      if (starterCode !== contribution.starterCode) fields.starterCode = starterCode;

      let testSuiteJson: Record<string, unknown> | undefined = undefined;
      if (testSuiteDefinition.trim()) {
        try {
          testSuiteJson = JSON.parse(testSuiteDefinition) as Record<string, unknown>;
          fields.testSuiteDefinition = testSuiteJson;
        } catch {
          setError("Invalid JSON in test suite definition");
          setSaving(false);
          return;
        }
      }

      await updateContribution({
        contributionId: contribution._id,
        changelog: changelog || contribution.changelog,
        fields,
      });

      setSuccess("Draft saved successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!changelog.trim()) {
      setError("Changelog is required to submit");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await submitContribution({
        contributionId: contribution._id,
      });
      router.push("/contribute");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800",
    submitted: "bg-blue-100 text-blue-800",
    changes_requested: "bg-orange-100 text-orange-800",
    rejected: "bg-red-100 text-red-800",
    published: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/contribute" className="text-blue-600 hover:text-blue-800">
            ← Back to My Contributions
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {item.title}
              </h1>
              <p className="text-gray-600">
                {language?.name} / {module?.title} / {item.kind}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[contribution.status]}`}>
              {contribution.status.replace(/_/g, " ")}
            </span>
          </div>

          {contribution.reviewerNote && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
              <h3 className="font-semibold text-orange-800 mb-1">Reviewer Note</h3>
              <p className="text-orange-700">{contribution.reviewerNote}</p>
            </div>
          )}
        </div>

        {canEdit && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Draft</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {item.kind === "lesson" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (Markdown)
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    rows={12}
                  />
                </div>
              )}

              {item.kind === "challenge" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prompt
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Starter Code
                    </label>
                    <textarea
                      value={starterCode}
                      onChange={(e) => setStarterCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      rows={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test Suite Definition (JSON, optional)
                    </label>
                    <textarea
                      value={testSuiteDefinition}
                      onChange={(e) => setTestSuiteDefinition(e.target.value)}
                      placeholder='{"publicTests": [...]}'
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      rows={8}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Changelog <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                  placeholder="Describe your changes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}

              {success && (
                <div className="text-sm text-green-600">{success}</div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>

                {(contribution.status === "draft" || contribution.status === "changes_requested") && (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !changelog.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit for Review"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {isPublished && contribution.publishedVersionId && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Published Version</h2>
            <p className="text-gray-600">
              This contribution was published as version{" "}
              <Link
                href={`/learn/${language?.slug}/${item.slug}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View on Learn Page
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
