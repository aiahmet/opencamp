"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useState } from "react";

type Project = {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
};

export default function ProjectsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("java");

  const projects = useQuery(api.projects.listProjectsByLanguageSlug, {
    languageSlug: selectedLanguage,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Projects</h1>
          <p className="text-gray-600">
            Multi-file coding projects to test your skills on real-world scenarios.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLanguage("java")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedLanguage === "java"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Java
            </button>
          </div>
        </div>

        {projects === undefined && (
          <div className="text-center text-gray-600 py-12">
            <p>Loading...</p>
          </div>
        )}

        {projects === null && (
          <div className="text-center text-gray-600 py-12">
            <p>No projects available for {selectedLanguage}.</p>
          </div>
        )}

        {projects && projects.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No projects available yet.</p>
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => (
              <Link
                key={project.id}
                href={`/projects/${selectedLanguage}/${project.slug}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                    {selectedLanguage}
                  </span>
                  <span className="text-sm text-gray-500">#{project.order}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
