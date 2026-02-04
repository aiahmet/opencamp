"use client";

import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

export default function ThreadPage() {
  const params = useParams();
  const discussionId = params.id as string;

  const discussion = useQuery(api.discussions.getDiscussion, {
    discussionId: discussionId as unknown as Id<"discussions">,
  });
  const comments = useQuery(api.comments.listComments, {
    discussionId: discussionId as unknown as Id<"discussions">,
  });
  const currentUser = useQuery(api.users.currentUser);

  const createComment = useMutation(api.comments.createComment);
  const vote = useMutation(api.votes.vote);
  const setAcceptedAnswer = useMutation(api.discussions.setAcceptedAnswer);
  const setThreadLocked = useMutation(api.discussions.setThreadLocked);

  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async (e: React.FormEvent, parentCommentId?: string) => {
    e.preventDefault();
    if (!currentUser || !discussion) return;

    setIsSubmitting(true);
    try {
      await createComment({
        discussionId: discussionId as unknown as Id<"discussions">,
        parentCommentId: parentCommentId as unknown as Id<"comments"> | undefined,
        body: replyBody,
      });
      setReplyBody("");
      setReplyTo(null);
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (commentId: string, value: number) => {
    if (!currentUser) return;
    try {
      await vote({ commentId: commentId as unknown as Id<"comments">, value: value as 1 | -1 });
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to vote");
    }
  };

  const handleSetAccepted = async (commentId: string | null) => {
    if (!currentUser || !discussion) return;

    const isAuthor = currentUser._id === discussion.authorId;
    const isModerator = currentUser.roles.includes("reviewer") || currentUser.roles.includes("maintainer");

    if (!isAuthor && !isModerator) {
      alert("Only the thread author or moderators can set accepted answers");
      return;
    }

    try {
      await setAcceptedAnswer({
        discussionId: discussionId as unknown as Id<"discussions">,
        commentId: commentId as unknown as Id<"comments"> | null,
      });
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to set accepted answer");
    }
  };

  const handleToggleLock = async () => {
    if (!currentUser || !discussion) return;

    const isModerator = currentUser.roles.includes("reviewer") || currentUser.roles.includes("maintainer");
    if (!isModerator) {
      alert("Only moderators can lock threads");
      return;
    }

    try {
      await setThreadLocked({
        discussionId: discussionId as unknown as Id<"discussions">,
        locked: !discussion.locked,
      });
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to lock thread");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (discussion === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (discussion === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/discuss" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Discussions
          </Link>
          <div className="text-center text-gray-600 py-12">
            <p>Discussion not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = currentUser?._id === discussion.authorId;
  const isModerator = currentUser?.roles.includes("reviewer") || currentUser?.roles.includes("maintainer");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/discuss" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Discussions
        </Link>

        <div className="mt-6 bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{discussion.title}</h1>
              <div className="text-sm text-gray-600">
                by {discussion.authorUsername} • {formatDate(discussion.createdAt)}
              </div>
            </div>
            {isModerator && (
              <button
                onClick={handleToggleLock}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                {discussion.locked ? "Unlock Thread" : "Lock Thread"}
              </button>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{discussion.body}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>

          {!discussion.locked && currentUser && (
            <form onSubmit={(e) => handleSubmitReply(e)} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                disabled={isSubmitting}
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || replyBody.trim() === ""}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                    isSubmitting || replyBody.trim() === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>
          )}

          {comments === undefined ? (
            <div className="text-center text-gray-600 py-8">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => {
                const isAccepted = discussion.acceptedCommentId === comment._id;
                const topLevelComments = comments.filter((c) => c.parentCommentId === comment._id);
                const canSetAccepted = discussion.type === "help" && (isAuthor || isModerator);

                return (
                  <div key={comment._id} className="bg-white rounded-lg shadow-md p-6">
                    {isAccepted && (
                      <div className="mb-3 px-3 py-2 bg-green-100 text-green-800 rounded text-sm font-medium">
                        ✓ Accepted Answer
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleVote(comment._id, 1)}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            comment.currentUserVote === 1 ? "text-orange-500" : "text-gray-500"
                          }`}
                        >
                          ▲
                        </button>
                        <span className="text-sm font-medium">{comment.voteSum}</span>
                        <button
                          onClick={() => handleVote(comment._id, -1)}
                          className={`p-1 rounded hover:bg-gray-100 ${
                            comment.currentUserVote === -1 ? "text-blue-500" : "text-gray-500"
                          }`}
                        >
                          ▼
                        </button>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">
                            {comment.authorUsername} • {formatDate(comment.createdAt)}
                          </div>
                          {canSetAccepted && !comment.removed && !isAccepted && (
                            <button
                              onClick={() => handleSetAccepted(comment._id)}
                              className="text-sm text-green-600 hover:text-green-800"
                            >
                              ✓ Accept
                            </button>
                          )}
                          {canSetAccepted && isAccepted && (
                            <button
                              onClick={() => handleSetAccepted(null)}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              Unaccept
                            </button>
                          )}
                        </div>

                        {comment.removed ? (
                          <div className="text-gray-500 italic">(removed)</div>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.body}</ReactMarkdown>
                          </div>
                        )}

                        {!discussion.locked && currentUser && !comment.removed && (
                          <button
                            onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                          >
                            Reply
                          </button>
                        )}

                        {replyTo === comment._id && (
                          <form onSubmit={(e) => handleSubmitReply(e, comment._id)} className="mt-3">
                            <textarea
                              value={replyBody}
                              onChange={(e) => setReplyBody(e.target.value)}
                              placeholder="Write a reply..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                              disabled={isSubmitting}
                            />
                            <div className="flex gap-3 mt-2">
                              <button
                                type="submit"
                                disabled={isSubmitting || replyBody.trim() === ""}
                                className={`px-4 py-2 bg-blue-600 text-white rounded-lg text-sm transition-colors ${
                                  isSubmitting || replyBody.trim() === "" ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                                }`}
                              >
                                {isSubmitting ? "Posting..." : "Reply"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setReplyTo(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}

                        {topLevelComments.map((reply) => (
                          <div key={reply._id} className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center gap-1">
                                <button
                                  onClick={() => handleVote(reply._id, 1)}
                                  className={`p-1 rounded hover:bg-gray-100 ${
                                    reply.currentUserVote === 1 ? "text-orange-500" : "text-gray-500"
                                  }`}
                                >
                                  ▲
                                </button>
                                <span className="text-sm font-medium">{reply.voteSum}</span>
                                <button
                                  onClick={() => handleVote(reply._id, -1)}
                                  className={`p-1 rounded hover:bg-gray-100 ${
                                    reply.currentUserVote === -1 ? "text-blue-500" : "text-gray-500"
                                  }`}
                                >
                                  ▼
                                </button>
                              </div>

                              <div className="flex-1">
                                <div className="text-sm text-gray-600 mb-2">
                                  {reply.authorUsername} • {formatDate(reply.createdAt)}
                                </div>

                                {reply.removed ? (
                                  <div className="text-gray-500 italic">(removed)</div>
                                ) : (
                                  <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{reply.body}</ReactMarkdown>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
