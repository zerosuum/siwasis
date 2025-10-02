export function usePagination({ page, limit, total }) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const current = Math.min(Math.max(1, page), totalPages);

  const hasPrev = current > 1;
  const hasNext = current < totalPages;

  // window halaman sederhana (1..totalPages, tapi batasi 5)
  const window = 5;
  let start = Math.max(1, current - Math.floor(window / 2));
  let end = Math.min(totalPages, start + window - 1);
  if (end - start + 1 < window) start = Math.max(1, end - window + 1);

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return {
    page: current,
    limit,
    total,
    totalPages,
    hasPrev,
    hasNext,
    pages,
    first: 1,
    last: totalPages,
    prev: hasPrev ? current - 1 : 1,
    next: hasNext ? current + 1 : totalPages,
  };
}
