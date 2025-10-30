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

export default function AdminList({ admins = [], loading }) {
  return (
    <Card className="p-5">
      {loading ? (
        <div className="text-sm text-gray-500">Memuat…</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {(admins ?? []).map((a, i) => (
            <div key={a.id ?? i} className="py-3">
              <div className="font-medium text-gray-900">
                {i + 1}. @{a.name || a.username || "username"}
              </div>
              <div className="text-sm text-gray-500">{a.email}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
