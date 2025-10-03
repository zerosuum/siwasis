import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

export const KPI_ICONS = {
  Pemasukan: ArrowUpRight,
  Pengeluaran: ArrowDownRight,
  Saldo: Wallet,
};

export function getKpiIcon(label) {
  return KPI_ICONS[label] || Wallet;
}
