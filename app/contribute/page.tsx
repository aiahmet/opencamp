"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useState } from "react";

export default function ContributePage() {
  const currentUser = useQuery(api.users.currentUser);
  const myContributions = useQuery(api.contributions.listMyContributions, {});
  const languages = useQuery(api.curriculum.listLanguages);
  const createContribution = useMutation(api.contributions.createContribution);

  const [showModal, setShowModal] = useState(false);
  const [selectedLanguageSlug, setSelectedLanguageSlug] = useState<string>("");
  const [selectedTrackSlug, setSelectedTrackSlug] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [changelog, setChangelog] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const tracksForLanguage = useQuery(
    api.curriculum.listTracksByLanguageSlug,
    selectedLanguageSlug ? { languageSlug: selectedLanguageSlug } : "skip"
  );

  const trackTree = useQuery(
    api.curriculum.getTrackTree,
    selectedLanguageSlug && selectedTrackSlug
      ? { languageSlug: selectedLanguageSlug, trackSlug: selectedTrackSlug }
      : "skip"
  ) as { modules: { items: { _id: string; kind: string; title: string }[] }[] } | undefined | null;

  type TrackItem = { _id: string; kind: string; title: string };
  const allItems: TrackItem[] = trackTree
    ? trackTree.modules.flatMap((m: { items: TrackItem[] }) => m.items)
    : [];

  if (currentUser === undefined || myContributions === undefined || languages === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            Please sign in to contribute.
          </div>
        </div>
      </div>
    );
  }

  const hasContributorRole = currentUser.roles.includes("contributor") ||
                            currentUser.roles.includes("reviewer") ||
                            currentUser.roles.includes("maintainer");

  if (!hasContributorRole) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            You don&apos;t have access to contribute. Please contact an administrator.
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800",
    submitted: "bg-blue-100 text-blue-800",
    changes_requested: "bg-orange-100 text-orange-800",
    rejected: "bg-red-100 text-red-800",
    published: "bg-green-100 text-green-800",
  };

  const handleCreateContribution = async () => {
    if (!selectedItemId) {
      setError("Please select an item");
      return;
    }
    if (!changelog.trim()) {
      setError("Please provide a changelog");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const contributionId = await createContribution({
        itemId: selectedItemId as Id<"curriculumItems">,
        changelog,
      });
      setShowModal(false);
      setSelectedLanguageSlug("");
      setSelectedTrackSlug("");
      setSelectedItemId("");
      setChangelog("");
      window.location.href = `/contribute/${contributionId}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create contribution");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Contributions</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            New Draft
          </button>
        </div>

        {myContributions.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No contributions yet.</p>
            <p className="text-gray-500">Start by creating a new draft to contribute to curriculum items.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myContributions.map((contribution: { _id: string; item: { title?: string; languageName?: string; trackSlug?: string; kind?: string } | null; status: string; updatedAt: number }) => (
                  <tr key={contribution._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contribution.item?.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {contribution.item?.languageName} / {contribution.item?.trackSlug} / {contribution.item?.kind}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[contribution.status]}`}>
                        {contribution.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contribution.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/contribute/${contribution._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {contribution.status === "published" ? "View" : "Edit"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create New Draft</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={selectedLanguageSlug}
                  onChange={(e) => {
                    setSelectedLanguageSlug(e.target.value);
                    setSelectedTrackSlug("");
                    setSelectedItemId("");
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a language...</option>
                  {languages.map((language: { slug: string; name: string }) => (
                    <option key={language.slug} value={language.slug}>
                      {language.name}
                    </option>
                  ))}
                </select>
              </div>

              {tracksForLanguage && tracksForLanguage.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Track
                  </label>
                  <select
                    value={selectedTrackSlug}
                    onChange={(e) => {
                      setSelectedTrackSlug(e.target.value);
                      setSelectedItemId("");
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a track...</option>
                    {tracksForLanguage.map((track: { slug: string; title: string }) => (
                      <option key={track.slug} value={track.slug}>
                        {track.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {allItems.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an item...</option>
                    {allItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.kind}: {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Changelog
                </label>
                <textarea
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                  placeholder="Describe what you plan to change..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 mb-4">{error}</div>
              )}

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedLanguageSlug("");
                    setSelectedTrackSlug("");
                    setSelectedItemId("");
                    setChangelog("");
                    setError("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateContribution}
                  disabled={creating || !selectedItemId || !changelog.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {creating ? "Creating..." : "Create Draft"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
