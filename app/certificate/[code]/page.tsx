"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CertificatePage() {
  const params = useParams();
  const code = params.code as string;

  const certificate = useQuery(api.certificates.verifyCertificate, { code });

  if (certificate === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-xl rounded-lg p-12 border-8 border-gray-800">
          {!certificate.valid ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Invalid Certificate
              </h1>
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
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="h-16 w-16 text-blue-600"
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
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Certificate of Completion
                </h1>
                <p className="text-xl text-gray-600">
                  OpenCamp
                </p>
              </div>

              <div className="border-2 border-gray-300 rounded-lg p-8 mb-8">
                <p className="text-lg text-gray-700 mb-4">
                  This is to certify that
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {certificate.holder?.username ? `@${certificate.holder.username}` : "Anonymous"}
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                  has successfully completed the track
                </p>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">
                  {certificate.track?.title ?? "Unknown Track"}
                </h3>
                <p className="text-lg text-gray-600 mb-2">
                  {certificate.language?.name ?? "Unknown Language"}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Certificate Code: <span className="font-mono">{certificate.code}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Issued on: {certificate.issuedAt !== undefined ? formatDate(certificate.issuedAt) : "N/A"}
                </p>
              </div>

              <button
                onClick={handlePrint}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 print:hidden"
              >
                Print Certificate
              </button>

              <div className="mt-8 pt-8 border-t border-gray-300 print:hidden">
                <Link
                  href={`/verify/${certificate.code}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Verify this certificate
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
