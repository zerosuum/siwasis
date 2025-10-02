export const rupiah = (n = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export const shortDate = (d) => {
  const dt = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  if (Number.isNaN(dt?.getTime?.())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dt);
};

export const cls = (...xs) => xs.filter(Boolean).join(" ");
