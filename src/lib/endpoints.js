export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api";

export const EP = {
  login: () => `${API_BASE}/login`,
  logout: () => `${API_BASE}/logout`,
  articles: (id) =>
    id ? `${API_BASE}/articles/${id}` : `${API_BASE}/articles`,
  documents: (id) =>
    id ? `${API_BASE}/document/${id}` : `${API_BASE}/document`,
  warga: (id) => (id ? `${API_BASE}/warga/${id}` : `${API_BASE}/warga`),
  yt: (id) => (id ? `${API_BASE}/yt_links/${id}` : `${API_BASE}/yt_links`),
  kas: (q) => `${API_BASE}/kas${q ? `?${q}` : ""}`,
};