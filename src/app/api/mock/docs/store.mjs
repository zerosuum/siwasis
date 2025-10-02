// In-memory store untuk dokumen (persist selama dev berkat globalThis)
function seed() {
  return [
    // contoh awal kosong atau 1 sample
    // { id: 1, title: "RAB 2025", description: "Draft", filename: "rab.pdf", mime: "application/pdf", size: 10240, uploadedAt: new Date().toISOString(), data: new Uint8Array() }
  ];
}

export const DOCS =
  globalThis.__SIWASIS_DOCS__ ?? (globalThis.__SIWASIS_DOCS__ = seed());

export function nextId() {
  return DOCS.length ? Math.max(...DOCS.map((d) => d.id)) + 1 : 1;
}
