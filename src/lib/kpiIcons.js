import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

export const KPI_ICONS = {
  Pemasukan: ArrowDownRight,
  Pengeluaran: ArrowUpRight,
  Saldo: Wallet,
};

export function getKpiIcon(label) {
  return KPI_ICONS[label] || Wallet;
}
