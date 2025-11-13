const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://siwasis.novarentech.web.id/api";

export const API_ORIGIN = API_BASE.replace(/\/api$/, "");

export function normalizeArticle(item) {
  if (!item || typeof item !== "object") return null;

  const imagePath = item.image_path ?? item.image ?? null;

  const image_url =
    item.image_url || (imagePath ? `${API_ORIGIN}/storage/${imagePath}` : null);

  const rawContent = item.content ?? item.body ?? "";
  let excerpt = item.excerpt;

  if (!excerpt && rawContent) {
    const plain = rawContent.replace(/<[^>]+>/g, " ");
    const trimmed = plain.trim();
    excerpt =
      trimmed.length > 180 ? trimmed.slice(0, 180).trimEnd() + "…" : trimmed;
  }

  return {
    ...item,
    id: item.id ?? item.slug ?? item.uuid ?? null,
    title: item.title ?? "Tanpa judul",
    content: rawContent,
    created_at: item.created_at ?? item.published ?? item.updated_at ?? null,
    image_url,
    excerpt,
  };
}

export function normalizeArticleList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeArticle).filter(Boolean);
}
