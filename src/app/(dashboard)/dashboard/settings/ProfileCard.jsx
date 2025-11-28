"use client";
import * as React from "react";
import { useMemo } from "react";
import { getProfilePhotoUrl } from "@/lib/profilePhoto";

const getStorageUrl = (path) => {
  if (!path) return null;
  const base = (
    process.env.NEXT_PUBLIC_API_BASE || "https://siwasis.novarentech.web.id"
  ).replace(/\/api$/, "");

  const cleanPath = String(path)
    .replace(/^storage\//, "")
    .replace(/^\/+/, "/");
  return `${base}/storage/${cleanPath}`;
};

function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-xl border border-[#EEF0E8] bg-white shadow-sm",
        "transition-shadow hover:shadow-md",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function Button({ className = "", ...props }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm",
        "bg-[#6E8649] text-white hover:bg-[#61753f] focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6E8649]",
        className,
      ].join(" ")}
    />
  );
}

export default function ProfileCard({ profile, loading, error, onEdit }) {

  if (loading || !profile) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
          <div className="min-w-0 space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-56 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="ml-auto h-9 w-28 rounded-lg bg-[#E2E7D7]" />
        </div>
      </Card>
    );
  }

  const photoUrl = useMemo(() => getProfilePhotoUrl(profile), [profile]);

  return (
    <Card className="p-5">
      {error && (
        <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={profile.name || "avatar"}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='100%' height='100%' fill='%23eef0e8'/></svg>";
              }}
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-xs text-gray-400">
              no photo
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="truncate text-lg font-semibold text-gray-900">
            {profile.name || "User Name"}
          </div>
          <div className="truncate text-sm text-gray-500">
            {profile.email || "—"}
          </div>
          <div className="text-xs text-gray-400">
            Akun dibuat:&nbsp;
            {profile.created_at
              ? new Date(profile.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </div>
        </div>

        <div className="ml-auto">
          <Button onClick={onEdit}>Edit Profile</Button>
        </div>
      </div>
    </Card>
  );
}
