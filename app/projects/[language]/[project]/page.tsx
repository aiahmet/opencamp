"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import MonacoEditor from "@/components/projects/MonacoEditor";
import { getNewFileDetails } from "@/lib/language";

interface File {
  path: string;
  content: string;
}

interface TestResult {
  passed: boolean;
  name: string;
  expected?: unknown;
  actual?: unknown;
  stderr?: string;
}

interface SubmissionResult {
  ok: boolean;
  compile: { ok: boolean; stderr?: string };
  tests?: TestResult[];
  timingMs?: number;
  stdout?: string;
  stderr?: string;
}

interface Submission {
  _id: string;
  status: string;
  createdAt: number;
  result?: SubmissionResult;
}

export default function ProjectPage() {
  const params = useParams();
  const languageSlug = params.language as string;
  const projectSlug = params.project as string;

  const projectData = useQuery(api.projects.getProjectBySlugs, {
    languageSlug,
    projectSlug,
  });

  const workspace = useQuery(
    api.projectWorkspaces.getWorkspace,
    projectData?.id ? { projectId: projectData.id } : "skip"
  );

  const submissions = useQuery(
    api.projectSubmissions.listProjectSubmissions,
    projectData?.id ? { projectId: projectData.id, limit: 20 } : "skip"
  ) as Submission[] | undefined;

  const progressData = useQuery(
    api.projectProgress.getMyProjectProgress,
    projectData?.id ? { projectIds: [projectData.id] } : "skip"
  );

  const upsertWorkspace = useMutation(api.projectWorkspaces.upsertWorkspace);
  const resetWorkspace = useMutation(api.projectWorkspaces.resetWorkspace);
  const createAndRunProjectSubmission = useAction(api.projectSubmissions.createAndRunProjectSubmission);
  const markProjectCompleted = useMutation(api.projectProgress.markProjectCompleted);
  const usage = useQuery(api.usage.getMyUsage);

  const [files, setFiles] = useState<File[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [runError, setRunError] = useState<{ code: string; message: string; retryAfterMs?: number; resetsAtMs?: number } | null>(null);
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);

  // Initialize files from workspace or project initial files
  useEffect(() => {
    if (workspace?.files) {
      setFiles(workspace.files);
    } else if (projectData?.initialFiles) {
      setFiles(projectData.initialFiles);
    }
  }, [workspace, projectData]);

  // Auto-save workspace
  useEffect(() => {
    if (projectData?.id && files.length > 0) {
      const statusTimeoutId = setTimeout(() => {
        setSaveStatus("saving");
      }, 0);

      const saveTimeoutId = setTimeout(async () => {
        try {
          await upsertWorkspace({ projectId: projectData.id, files });
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } catch (error) {
          console.error("Failed to save workspace:", error);
        }
      }, 1000);

      return () => {
        clearTimeout(statusTimeoutId);
        clearTimeout(saveTimeoutId);
      };
    }
  }, [files, projectData?.id, upsertWorkspace]);

  const handleFileContentChange = (index: number, newContent: string) => {
    const newFiles = [...files];
    newFiles[index] = { ...newFiles[index], content: newContent };
    setFiles(newFiles);
  };

  const handleRun = async () => {
    if (!projectData?.id) return;
    setIsRunning(true);
    setRunError(null);
    try {
      const result = await createAndRunProjectSubmission({ projectId: projectData.id, files });
      
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
    if (!projectData?.initialFiles || !projectData?.id) return;
    setFiles(projectData.initialFiles);
    try {
      await resetWorkspace({ projectId: projectData.id });
    } catch (error) {
      console.error("Failed to reset workspace:", error);
    }
  };

  const handleMarkCompleted = async () => {
    if (!projectData?.id) return;
    try {
      await markProjectCompleted({ projectId: projectData.id });
    } catch (error) {
      console.error("Failed to mark as completed:", error);
    }
  };

  const handleCreateFile = async () => {
    if (!newFileName || !projectData?.id) return;

    const newFile = getNewFileDetails(
      projectData.language.monacoLanguageId,
      newFileName
    );

    setFiles([...files, newFile]);
    setNewFileName("");
    setShowNewFileDialog(false);
  };

  const handleDeleteFile = (index: number) => {
    if (files.length <= 1) {
      alert("Cannot delete the last file");
      return;
    }

    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    if (selectedFileIndex === index) {
      setSelectedFileIndex(0);
    } else if (selectedFileIndex > index) {
      setSelectedFileIndex(selectedFileIndex - 1);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const progressStatus = progressData?.[0]?.status || "not_started";

  if (projectData === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (projectData === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/projects" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            &larr; Back to Projects
          </Link>
          <div className="text-center text-gray-600 py-12">
            <p>Project not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const { title, description, instructions, rubric } = projectData;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/projects" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          &larr; Back to Projects
        </Link>

        <div className="mb-4 flex items-center gap-3">
          <span className="px-2 py-1 text-sm font-medium rounded bg-purple-100 text-purple-800">
            Project
          </span>
          <span className="px-2 py-1 text-sm font-medium rounded bg-blue-100 text-blue-800">
            {languageSlug}
          </span>
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
          {saveStatus === "saving" && (
            <span className="text-sm text-gray-500">Saving...</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-sm text-green-600">Saved</span>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Instructions and Rubric */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {instructions}
                </ReactMarkdown>
              </div>
            </div>

            {rubric && rubric.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Rubric</h2>
                <ul className="space-y-2">
                  {rubric.map((item: { id: string; text: string }) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        disabled
                        className="mt-1 w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-700 text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning || !!cooldownEnd}
                  className={`w-full px-4 py-2 text-white rounded-lg transition-colors ${
                    isRunning || cooldownEnd
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isRunning ? "Running..." : cooldownEnd ? `Wait ${Math.ceil((cooldownEnd - Date.now()) / 1000)}s` : "Run Tests"}
                </button>
                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset Workspace
                </button>
                <button
                  onClick={() => setShowNewFileDialog(true)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  New File
                </button>
                {selectedFileIndex !== null && files.length > 1 && (
                  <button
                    onClick={() => handleDeleteFile(selectedFileIndex)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Current File
                  </button>
                )}
                <button
                  onClick={handleMarkCompleted}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Mark as Completed
                </button>
              </div>
              
              {/* Quota Display */}
              {usage && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  Runs today: {usage.runsUsed} / {usage.runsLimit}
                  {usage.runsUsed >= usage.runsLimit && (
                    <span className="text-red-600 ml-2">(Limit reached)</span>
                  )}
                </div>
              )}
              
              {/* Error Messages */}
              {runError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium text-sm">{runError.message}</p>
                  {runError.resetsAtMs && (
                    <p className="text-red-600 text-xs mt-1">
                      Resets at {new Date(runError.resetsAtMs).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right side - File explorer, editor, and submissions */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Explorer and Editor */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Workspace</h2>

              {/* File Explorer */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Files</h3>
                </div>
                <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                  {files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFileIndex(index)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                        selectedFileIndex === index ? "bg-blue-50 text-blue-700" : ""
                      }`}
                    >
                      {file.path}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              {files.length > 0 && selectedFileIndex !== null && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      {files[selectedFileIndex].path}
                    </h3>
                  </div>
                  <MonacoEditor
                    value={files[selectedFileIndex].content}
                    onChange={(newContent) => handleFileContentChange(selectedFileIndex, newContent)}
                    language={projectData.language.monacoLanguageId}
                    height="500px"
                  />
                </div>
              )}

              {files.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <p>No files in workspace. Click &quot;New File&quot; to add one.</p>
                </div>
              )}
            </div>

            {/* Submissions History */}
            {submissions && submissions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Submissions
                </h2>
                <div className="space-y-3">
                  {submissions.map((submission) => (
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
                                {submission.result.tests.map((test: { passed: boolean; name: string; expected?: unknown; actual?: unknown; stderr?: string }, idx: number) => (
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
          </div>
        </div>

        {/* New File Dialog */}
        {showNewFileDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New File</h2>
               <input
                 type="text"
                 value={newFileName}
                 onChange={(e) => setNewFileName(e.target.value)}
                 placeholder="Enter file name (without extension)"
                 className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 autoFocus
               />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowNewFileDialog(false);
                    setNewFileName("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFile}
                  disabled={!newFileName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
