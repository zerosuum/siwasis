import { proxyJSON } from "./_api";

export async function getDocuments(
  _tokenIgnored,
  { page, search, from, to, perPage, tags } = {}
) {
  return proxyJSON("/documents", {
    params: {
      page,
      q: search || undefined,
      from: from || undefined,
      to: to || undefined,
      per_page: perPage,
    },
    tags,
  });
}
