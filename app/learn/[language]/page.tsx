"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";

type Track = {
  slug: string;
  title: string;
  level?: string;
  description: string;
};

export default function LanguagePage() {
  const params = useParams();
  const languageSlug = params.language as string;
  const tracks = useQuery(api.curriculum.listTracksByLanguageSlug, {
    languageSlug,
  });

  if (tracks === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (tracks === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/learn"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            &larr; Back to Languages
          </Link>
          <div className="text-center text-gray-600 py-12">
            <p>Language not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/learn"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          &larr; Back to Languages
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">
          {languageSlug} Tracks
        </h1>

        {tracks.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p>No tracks available yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tracks.map((track: Track) => (
              <Link
                key={track.slug}
                href={`/learn/${languageSlug}/tracks/${track.slug}`}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {track.title}
                </h2>
                {track.level && (
                  <span className="inline-block px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded mb-2">
                    {track.level}
                  </span>
                )}
                <p className="text-gray-600">{track.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
