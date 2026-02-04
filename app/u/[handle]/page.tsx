"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PublicProfilePage() {
  const params = useParams();
  const handle = params.handle as string;

  const profile = useQuery(api.profile.getPublicProfile, { handle });

  if (profile === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!profile ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Not Found</h1>
            <p className="text-gray-600 mb-6">
              The user @{handle} does not exist.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Go Home
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {profile.user.username?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    @{profile.user.username}
                  </h1>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Completed Tracks
              </h2>
              
              {profile.completedTracks.length === 0 ? (
                <p className="text-gray-600">No completed tracks yet.</p>
              ) : (
                <div className="space-y-4">
                  {profile.completedTracks.map((track) => (
                    <div key={track.trackId} className="border-b border-gray-200 pb-4 last:border-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        {track.trackTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Completed on {formatDate(track.completedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Certificates
              </h2>
              
              {profile.certificates.length === 0 ? (
                <p className="text-gray-600">No certificates issued yet.</p>
              ) : (
                <div className="space-y-4">
                  {profile.certificates.map((cert) => (
                    <div key={cert.code} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {cert.trackTitle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Issued on {formatDate(cert.issuedAt)}
                          </p>
                        </div>
                        <Link
                          href={`/verify/${cert.code}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Verify
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
