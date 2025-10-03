import { headers } from "next/headers";

export async function absoluteUrl(path = "/") {
  const h = await headers(); // ⟵ penting: await!
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");

  const base = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL.replace(/\/+$/, "")
    : `${proto}://${host}`;

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
