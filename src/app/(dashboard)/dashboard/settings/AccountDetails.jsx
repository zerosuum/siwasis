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
function Label({ children }) {
  return (
    <label className="text-sm font-medium text-gray-700">{children}</label>
  );
}

export default function AccountDetails({ profile }) {
  const safeProfile = profile ?? {};

  return (
    <Card className="p-5">
      <div className="space-y-5">
        <div>
          <Label>Nama:</Label>
          <div className="mt-1 border-b border-gray-200 pb-2 text-gray-800">
            {safeProfile.name || "—"}
          </div>
        </div>
        <div>
          <Label>Email:</Label>
          <div className="mt-1 border-b border-gray-200 pb-2 text-gray-800">
            {safeProfile.email || "—"}
          </div>
        </div>
        <div>
          <Label>Password:</Label>
          <div className="mt-1 border-b border-gray-200 pb-2 text-gray-800">
            ********************
          </div>
        </div>
      </div>
    </Card>
  );
}
