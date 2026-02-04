"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const params = useParams();
  const code = params.code as string;

  const certificate = useQuery(api.certificates.verifyCertificate, { code });

  if (certificate === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {!certificate.valid ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Invalid Certificate</h1>
            <p className="text-gray-600 mb-6">
              This certificate code is not found or has been revoked.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Go Home
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Valid Certificate
            </h1>

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Certificate Code</p>
                <p className="text-lg font-mono font-medium text-gray-900">{certificate.code}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Track</p>
                <p className="text-lg font-medium text-gray-900">{certificate.track?.title ?? "Unknown Track"}</p>
                <p className="text-sm text-gray-500">{certificate.language?.name ?? "Unknown Language"}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Issued To</p>
                <p className="text-lg font-medium text-gray-900">
                  {certificate.holder?.username ? `@${certificate.holder.username}` : "Anonymous"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Issued On</p>
                <p className="text-lg font-medium text-gray-900">
                  {certificate.issuedAt !== undefined ? formatDate(certificate.issuedAt) : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                href={`/certificate/${certificate.code}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Certificate
              </Link>
              <Link
                href="/"
                className="inline-block px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Go Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
