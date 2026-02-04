"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

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

export default function TrackPage() {
  const params = useParams();
  const languageSlug = params.language as string;
  const trackSlug = params.track as string;
  const trackTree = useQuery(api.curriculum.getTrackTree, {
    languageSlug,
    trackSlug,
  });

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

  const getProgressStatus = (itemId: string) => {
    const progress = progressData?.find((p: Progress) => p.itemId === itemId);
    return progress?.status || "not_started";
  };

  if (trackTree === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (trackTree === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/learn/${languageSlug}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            &larr; Back to Tracks
          </Link>
          <div className="text-center text-gray-600 py-12">
            <p>Track not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const { track, modules } = trackTree;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/learn/${languageSlug}`}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          &larr; Back to Tracks
        </Link>
        <div className="mb-8">
          {track.level && (
            <span className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded mb-2">
              {track.level}
            </span>
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {track.title}
          </h1>
          <p className="text-gray-600">{track.description}</p>
        </div>

        {modules.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p>No modules available yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {modules.map((module: Module) => (
              <div key={module.slug} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {module.title}
                </h2>
                {module.description && (
                  <p className="text-gray-600 mb-4">{module.description}</p>
                )}
                {module.items.length > 0 && (
                  <div className="space-y-2">
                    {module.items.map((item: Item) => {
                      const status = getProgressStatus(item._id);
                      return (
                        <Link
                          key={item.slug}
                          href={`/learn/${languageSlug}/items/${item.slug}`}
                          className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                {item.kind}
                              </span>
                              <span className="text-gray-900 font-medium">
                                {item.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                  status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {status === "completed"
                                  ? "✓ Done"
                                  : status === "in_progress"
                                  ? "● In Progress"
                                  : "○ Not Started"}
                              </span>
                              <span className="text-gray-400">&rarr;</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
