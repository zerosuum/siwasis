import { proxyJSON } from "./_api";

export async function getDocuments(
  _tokenIgnored,
  { page, search, from, to, perPage } = {}
) {
  return proxyJSON("/documents", {
    params: { page, q: search, from, to, limit: perPage },
  });
}
