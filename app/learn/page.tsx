"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

type Language = {
  slug: string;
  name: string;
};

export default function LearnPage() {
  const languages = useQuery(api.curriculum.listLanguages);

  if (languages === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Learn</h1>
        
        {languages.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p>No languages available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((language: Language) => (
              <Link
                key={language.slug}
                href={`/learn/${language.slug}`}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {language.name}
                </h2>
                <p className="text-gray-600">Start learning {language.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
