"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function Navigation() {
  const currentUser = useQuery(api.users.currentUser);

  if (!currentUser) {
    return null;
  }

  const isContributor = currentUser.roles.includes("contributor") ||
                        currentUser.roles.includes("reviewer") ||
                        currentUser.roles.includes("maintainer");

  const isReviewer = currentUser.roles.includes("reviewer") ||
                     currentUser.roles.includes("maintainer");

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-gray-900">
              OpenCamp
            </Link>
            <Link
              href="/learn"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Learn
            </Link>
            <Link
              href="/projects"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Projects
            </Link>
            <Link
              href="/discuss"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Discuss
            </Link>
            {isContributor && (
              <Link
                href="/contribute"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contribute
              </Link>
            )}
            {isReviewer && (
              <Link
                href="/review"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Review
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
