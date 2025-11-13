const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN || "https://siwasis.novarentech.web.id";

export function getYoutubeThumbFromUrl(url) {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
  );
  if (!m) return null;
  return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
}

export function normalizeYoutubeList(raw = []) {
  if (!Array.isArray(raw)) return [];

  return raw.map((v, idx) => {
    const uploadedImage = v.image ? `${APP_ORIGIN}/storage/${v.image}` : null;

    const ytThumb = getYoutubeThumbFromUrl(v.url);

    return {
      id: v.id,
      title: v.title || "Video Kegiatan",
      created_at: v.created_at,
      youtube_url: v.url,
      thumbnail_url: uploadedImage || ytThumb || `/video/${(idx % 4) + 1}.jpg`,
    };
  });
}
