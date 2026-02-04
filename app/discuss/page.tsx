"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useState } from "react";

export default function DiscussPage() {
  const [typeFilter, setTypeFilter] = useState<"help" | "showcase" | "general" | undefined>(undefined);

  const discussions = useQuery(api.discussions.listDiscussionsByScope, {
    scopeType: "global",
    scopeId: null,
    type: typeFilter,
    limit: 50,
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Discussions</h1>
            <p className="text-gray-600">Join the community conversation</p>
          </div>
          <Link
            href="/discuss/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Thread
          </Link>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTypeFilter(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              typeFilter === undefined
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter("help")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              typeFilter === "help"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Help
          </button>
          <button
            onClick={() => setTypeFilter("showcase")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              typeFilter === "showcase"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Showcase
          </button>
          <button
            onClick={() => setTypeFilter("general")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              typeFilter === "general"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            General
          </button>
        </div>

        {discussions === undefined ? (
          <div className="text-center text-gray-600 py-12">
            Loading...
          </div>
        ) : discussions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No discussions yet</p>
            <Link
              href="/discuss/new"
              className="text-blue-600 hover:text-blue-800"
            >
              Start the first discussion
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion: Doc<"discussions"> & { authorUsername: string }) => (
              <Link
                key={discussion._id}
                href={`/discuss/${discussion._id}`}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
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
                      {discussion.locked && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                          Locked
                        </span>
                      )}
                      {discussion.pinned && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                          Pinned
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {discussion.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>by {discussion.authorUsername}</span>
                      <span>•</span>
                      <span>{formatDate(discussion.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
