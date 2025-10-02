"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import { DateRangePicker } from "@/components/DatePicker";
import LaporanTable from "./LaporanTable";
import Pagination from "@/components/Pagination";
import TransaksiModal from "./TransaksiModal";
import {
  Search as IconSearch,
  SlidersHorizontal as IconFilter,
  Download as IconDownload,
  Plus as IconPlus,
  Pencil as IconPencil,
} from "lucide-react";
import {
  actionCreateEntry,
  actionUpdateEntry,
  actionDeleteEntry,
} from "./actions";
import { useToast } from "@/components/ui/useToast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function LaporanClient({ initial }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  // State dasar
  const [q, setQ] = React.useState(sp.get("q") || "");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [year, setYear] = React.useState(
    Number(sp.get("year")) || new Date().getFullYear()
  );

  // range tanggal dari query
  const initRange =
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined;
  const [range, setRange] = React.useState(initRange);

  // modal transaksi
  const [modalState, setModalState] = React.useState({
    open: false,
    type: null,
    data: null,
  });

  // export confirm
  const [confirmExport, setConfirmExport] = React.useState(false);

  const handleOpenModal = (type, data = null) =>
    setModalState({ open: true, type, data });
  const handleCloseModal = () =>
    setModalState({ open: false, type: null, data: null });

  const handleSubmit = async (payload) => {
    try {
      let title = "";
      if (modalState.type === "pemasukan") {
        await actionCreateEntry({ ...payload, type: "IN" });
        title = "Pemasukan ditambahkan";
      } else if (modalState.type === "pengeluaran") {
        await actionCreateEntry({ ...payload, type: "OUT" });
        title = "Pengeluaran ditambahkan";
      } else if (modalState.type === "edit") {
        await actionUpdateEntry({ id: modalState.data.id, ...payload });
        title = "Data berhasil diperbarui";
      }
      handleCloseModal();
      show({ title: "Sukses!", description: title });
      router.refresh();
    } catch (error) {
      console.error("Submit failed:", error);
      show({
        title: "Gagal",
        description: "Terjadi kesalahan.",
        variant: "error",
      });
    }
  };

  // sinkron tahun → URL
  React.useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("year", String(year));
    router.push(`/kas/laporan?${params.toString()}`);
  }, [year]);

  // Filter (DateRangePicker
  const filterAnchorRef = React.useRef(null);
  const openFilterCalendar = React.useCallback(() => {
    if (!filterAnchorRef.current) return;
    const root = filterAnchorRef.current;
    const trigger =
      root.querySelector('button[aria-haspopup="dialog"]') ||
      root.querySelector('button[type="button"]') ||
      root.querySelector("button");
    if (!trigger) return;
    ["pointerdown", "mousedown", "mouseup", "click"].forEach((type) => {
      trigger.dispatchEvent(
        new MouseEvent(type, { bubbles: true, cancelable: true, view: window })
      );
    });
  }, []);

  // apply ke URL ketika from+to lengkap
  React.useEffect(() => {
    if (!range?.from || !range?.to) return;
    const params = new URLSearchParams(sp.toString());
    params.set("year", String(year));
    params.set("from", range.from.toISOString().slice(0, 10));
    params.set("to", range.to.toISOString().slice(0, 10));
    if (q) params.set("q", q);
    router.push(`/kas/laporan?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range?.from, range?.to]);

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4">
        <TabNavigation className="!mb-0 h-6">
          <TabNavigationLink
            href="/kas/rekapitulasi"
            className="inline-flex h-6 items-center px-2 text-sm font-medium text-gray-400 hover:text-gray-600"
          >
            Rekapitulasi Pembayaran
          </TabNavigationLink>
          <TabNavigationLink
            href="/kas/laporan"
            active
            className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
          >
            Laporan Keuangan
          </TabNavigationLink>
        </TabNavigation>

        <div className="flex items-center gap-2">
          {/* Periode */}
          <select
            className="h-6 w-[138px] rounded border border-gray-300 bg-white px-2 text-sm shadow-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  Periode {y}
                </option>
              );
            })}
          </select>

          {/* Pencarian */}
          <div
            className="relative"
            onMouseEnter={() => setSearchOpen(true)}
            onMouseLeave={() => (q ? null : setSearchOpen(false))}
          >
            <IconSearch
              size={16}
              className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                router.push(
                  `/kas/laporan?year=${year}${
                    range?.from && range?.to
                      ? `&from=${range.from
                          .toISOString()
                          .slice(0, 10)}&to=${range.to
                          .toISOString()
                          .slice(0, 10)}`
                      : ""
                  }${q ? `&q=${encodeURIComponent(q)}` : ""}`
                )
              }
              placeholder="Cari keterangan..."
              className={`h-6 rounded border border-gray-300 bg-white pl-7 pr-2 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-gray-200 ${
                searchOpen || q ? "w-48" : "w-6"
              }`}
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={openFilterCalendar}
              className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white"
              title="Filter tanggal"
              aria-label="Filter tanggal"
            >
              <IconFilter size={16} />
            </button>

            <div
              ref={filterAnchorRef}
              className="absolute inset-0 opacity-0 pointer-events-none"
              aria-hidden="true"
            >
              <DateRangePicker
                value={range}
                onChange={(r) => setRange(r)}
                displayMonths={2}
                enableYearNavigation
                translations={{
                  cancel: "Batal",
                  apply: "Ya, Simpan",
                  range: "Rentang",
                }}
                align="end"
                sideOffset={8}
                contentClassName="mt-2 min-w-[560px] rounded-xl border bg-white p-4 shadow-lg"
                footerClassName="mt-3 border-t pt-3 flex justify-end gap-2"
                cancelClassName="rounded-lg bg-gray-100 px-4 py-1.5 text-sm"
                applyClassName="rounded-lg bg-[#6E8649] px-4 py-1.5 text-sm text-white"
              />
            </div>
          </div>

          {/* Export */}
          <button
            className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-white"
            title="Export"
            onClick={() => setConfirmExport(true)}
          >
            <IconDownload size={16} />
          </button>

          {/* Tambah pemasukan */}
          <button
            onClick={() => handleOpenModal("pemasukan")}
            className="flex h-6 w-6 items-center justify-center rounded bg-[#6E8649] text-white"
            title="Tambah Pemasukan"
          >
            <IconPlus size={16} />
          </button>

          {/* Tambah pengeluaran */}
          <button
            onClick={() => handleOpenModal("pengeluaran")}
            className="flex h-6 w-6 items-center justify-center rounded bg-[#334a2a] text-white"
            title="Tambah Pengeluaran"
          >
            <IconPencil size={16} />
          </button>
        </div>
      </div>

      {/* Card tabel */}
      <div className="rounded-xl bg-white shadow overflow-hidden">
        <LaporanTable
          initial={initial}
          onEdit={(item) => handleOpenModal("edit", item)}
          onDelete={async (item) => {
            if (window.confirm(`Yakin ingin menghapus "${item.keterangan}"?`)) {
              await actionDeleteEntry({ id: item.id });
              show({ title: "Terhapus", description: "Baris telah dihapus." });
              router.refresh();
            }
          }}
        />
      </div>

      <div className="flex items-center justify-center px-4 py-3">
        <Pagination
          page={initial.page}
          limit={initial.perPage}
          total={initial.total}
        />
      </div>

      {/* Modal Transaksi */}
      <TransaksiModal
        open={modalState.open}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={modalState.data}
        {...(modalState.type === "pemasukan" && {
          title: "Mencatat Pemasukan",
          submitText: "Tambah",
        })}
        {...(modalState.type === "pengeluaran" && {
          title: "Mencatat Pengeluaran",
          submitText: "Tambah",
        })}
        {...(modalState.type === "edit" && {
          title: "Mencatat Perubahan",
          submitText: "Simpan",
          initialData: {
            tanggal: modalState.data?.tanggal.split("T")[0],
            keterangan: modalState.data?.keterangan,
            nominal: modalState.data?.pemasukan || modalState.data?.pengeluaran,
          },
        })}
      />

      {/* Confirm Export */}
      <ConfirmDialog
        open={confirmExport}
        title="Konfirmasi"
        description="Apakah Anda yakin ingin mengunduh file ini?"
        cancelText="Batal"
        okText="Ya, Unduh"
        onCancel={() => setConfirmExport(false)}
        onOk={() => {
          setConfirmExport(false);
          const params = new URLSearchParams({
            year: String(year),
            ...(range?.from && range?.to
              ? {
                  from: range.from.toISOString().slice(0, 10),
                  to: range.to.toISOString().slice(0, 10),
                }
              : {}),
            ...(q ? { q } : {}),
          });
          window.location.href = `/api/kas/laporan/export?${params.toString()}`;
        }}
      />
    </>
  );
}
