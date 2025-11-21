export function getProfilePhotoUrl(profile) {
  if (!profile) return null;

  const raw =
    profile.photo || profile.photo_url || profile.avatar || profile.image || profile.profile_photo_path || "";

  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;

  const base = (process.env.NEXT_PUBLIC_API_BASE || "")
    .replace(/\/api\/?$/, "");

  if (raw.startsWith("/storage/")) {
    return `${base}${raw}`;
  }

  if (raw.startsWith("storage/")) {
    return `${base}/${raw}`;
  }

  if (raw.startsWith("profile/")) {
    return `${base}/storage/${raw}`;
  }

  return `${base}/storage/profile/${raw}`;
}
