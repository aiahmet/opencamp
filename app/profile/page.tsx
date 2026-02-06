"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMemo, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const profile = useQuery(api.profile.myProfile);
  const completedTracks = useQuery(api.completion.listMyCompletedTracks);
  const certificates = useQuery(api.certificates.listMyCertificates);
  const issueCertificateForTrack = useAction(api.certificates.issueCertificateForTrack);

  const [handle, setHandle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [claimingTrackId, setClaimingTrackId] = useState<string | null>(null);
  const [claimErrors, setClaimErrors] = useState<Record<string, string>>({});
  const [claimCodes, setClaimCodes] = useState<Record<string, string>>({});

  const setHandleMutation = useMutation(api.profile.setMyHandle);
  const certificatesByTrackId = useMemo(() => {
    const map = new Map<Id<"tracks">, NonNullable<typeof certificates>[0]>();
    certificates?.forEach((cert) => {
      map.set(cert.trackId, cert);
    });
    return map;
  }, [certificates]);

  if (profile === undefined || completedTracks === undefined || certificates === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            Please sign in to view your profile.
          </div>
        </div>
      </div>
    );
  }

  const handleSetHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await setHandleMutation({ handle });
      setSuccess(true);
      setHandle("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set handle");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  const handleClaimCertificate = async (trackId: Id<"tracks">) => {
    setClaimingTrackId(trackId);
    setClaimErrors((prev) => ({ ...prev, [trackId]: "" }));
    try {
      const code = await issueCertificateForTrack({ trackId });
      setClaimCodes((prev) => ({ ...prev, [trackId]: code }));
    } catch (err) {
      setClaimErrors((prev) => ({
        ...prev,
        [trackId]: err instanceof Error ? err.message : "Failed to claim certificate",
      }));
    } finally {
      setClaimingTrackId((prev) => (prev === trackId ? null : prev));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Handle
          </h2>
          
          {profile.user.username ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className="text-lg text-gray-900">@{profile.user.username}</p>
                <Link
                  href={`/u/${profile.user.username}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View public profile
                </Link>
              </div>
              <button
                onClick={() => setHandle(profile.user.username || "")}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Change handle
              </button>
            </div>
          ) : (
            <form onSubmit={handleSetHandle} className="space-y-4">
              <div>
                <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">
                  Set your handle
                </label>
                <input
                  id="handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  pattern="^[a-z0-9_]{3,20}$"
                  title="3-20 characters, lowercase letters, numbers, and underscores only"
                />
                <p className="text-sm text-gray-500 mt-1">
                  3-20 characters, lowercase letters, numbers, and underscores only
                </p>
              </div>
              
              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}
              
              {success && (
                <div className="text-sm text-green-600">Handle set successfully!</div>
              )}
              
              <button
                type="submit"
                disabled={saving || !handle}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save handle"}
              </button>
            </form>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-md">
              <div className="text-3xl font-bold text-gray-900">{profile.stats.completedItemsCount}</div>
              <div className="text-sm text-gray-600">Completed Items</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-md">
              <div className="text-3xl font-bold text-gray-900">{profile.stats.inProgressItemsCount}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Completed Tracks
          </h2>
          
          {completedTracks.length === 0 ? (
            <p className="text-gray-600">No completed tracks yet.</p>
          ) : (
            <div className="space-y-4">
              {completedTracks.map((track) => {
                const existingCert = certificatesByTrackId.get(track.trackId);
                const claimCode = claimCodes[track.trackId];
                const claimError = claimErrors[track.trackId];
                const certificateCode = claimCode || existingCert?.code;
                return (
                  <div key={track.trackId} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {track.trackTitle}
                        </h3>
                        <p className="text-sm text-gray-600">{track.languageName}</p>
                        <p className="text-sm text-gray-500">
                          Completed on {formatDate(track.completedAt)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:items-end">
                        {certificateCode ? (
                          <div className="flex gap-3">
                            <Link
                              href={`/certificate/${certificateCode}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View certificate
                            </Link>
                            <Link
                              href={`/verify/${certificateCode}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              Verify
                            </Link>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleClaimCertificate(track.trackId)}
                            disabled={claimingTrackId === track.trackId}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                          >
                            {claimingTrackId === track.trackId ? "Claiming..." : "Claim Certificate"}
                          </button>
                        )}
                      </div>
                    </div>
                    {claimError && (
                      <div className="text-sm text-red-600 mt-2">
                        {claimError}
                      </div>
                    )}
                    {claimCode && (
                      <div className="text-sm text-green-600 mt-2">
                        Certificate issued.{" "}
                        <Link
                          href={`/certificate/${claimCode}`}
                          className="underline"
                        >
                          View certificate
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Certificates
          </h2>
          
          {certificates.length === 0 ? (
            <p className="text-gray-600">No certificates issued yet.</p>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert._id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {cert.trackTitle}
                      </h3>
                      <p className="text-sm text-gray-600">{cert.languageName}</p>
                      <p className="text-sm text-gray-500">
                        Issued on {formatDate(cert.issuedAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/verify/${cert.code}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Verify
                      </Link>
                      <Link
                        href={`/certificate/${cert.code}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
