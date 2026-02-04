"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function ItemDiscussionsPage() {
  const params = useParams();
  const itemId = params.itemId as string;

  const discussionsData = useQuery(api.discussions.listDiscussionsByItemSlug, {
    itemSlug: itemId,
    limit: 50,
  });

  const createDiscussion = useMutation(api.discussions.createDiscussionForItemSlug);

  const [showNewThread, setShowNewThread] = useState(false);
  const [type, setType] = useState<"help" | "showcase" | "general">("help");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createDiscussion({
        itemSlug: itemId,
        type,
        title,
        body,
      });
      setShowNewThread(false);
      setTitle("");
      setBody("");
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to create discussion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (discussionsData === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (discussionsData === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            &larr; Back
          </Link>
          <div className="text-center text-gray-600 py-12">
            <p>Item not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href={`/learn/${"language"}/items/${itemId}`}
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Item
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Discussions</h1>
          <p className="text-gray-600">Ask questions and share insights about this item</p>
        </div>

        {showNewThread && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">New Thread</h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as "help" | "showcase" | "general")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="help">Help</option>
                  <option value="showcase">Showcase</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's on your mind?"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                  Body
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48"
                  placeholder="Describe your question or topic in detail..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Creating..." : "Create Thread"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewThread(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {!showNewThread && (
          <button
            onClick={() => setShowNewThread(true)}
            className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Thread
          </button>
        )}

        {discussionsData.discussions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No discussions yet</p>
            <p className="text-gray-500">Be the first to start a conversation about this item!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {discussionsData.discussions.map((discussion) => (
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
