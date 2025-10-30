"use client";
import * as React from "react";

function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-xl border border-[#EEF0E8] bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
function Button({ className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm bg-[#6E8649] text-white hover:bg-[#61753f] ${className}`}
    />
  );
}

export default function ProfileCard({ profile = {}, loading, error, onEdit }) {
  return (
    <Card className="p-5">
      {error && (
        <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="text-lg font-semibold text-gray-900">
            {profile.name || "User Name"}
          </div>
          <div className="text-sm text-gray-500">
            Akun dibuat pada:{" "}
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
