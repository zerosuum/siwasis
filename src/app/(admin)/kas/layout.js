"use client";

export default function LayoutKas({ children }) {
  // Jangan render TabGroup di sini
  return <div className="space-y-0">{children}</div>;
}
