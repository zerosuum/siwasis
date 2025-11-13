"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import { DateRangePicker } from "@/components/DatePicker";
import SampahTable from "./SampahTable";
import Pagination from "@/components/Pagination";
import TransaksiModal from "@/components/TransaksiModal";
import FilterModal from "@/components/GenericFilterModal";
import PeriodDropdown from "../../kas/rekapitulasi/PeriodDropdown";
import {
  Calendar as IconCalendar,
  Search as IconSearch,
  SlidersHorizontal as IconFilter,
  Download as IconDownload,
  PlusCircle as IconPlus,
  MinusCircle as IconMinus,
} from "lucide-react";
import {
  actionCreateEntry,
  actionUpdateEntry,
  actionDeleteEntry,
} from "./actions";
import { useToast } from "@/components/ui/useToast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { API_BASE } from "@/lib/config";

export default function SampahClient({ initial, readOnly }) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const setoranBounds = React.useMemo(() => ({ min: 0, max: 10000000 }), []);

  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  const paginatedData = initial?.data || {};
  const currentPage = Number(paginatedData?.current_page) || 1;
  const itemsPerPage = Number(paginatedData?.per_page) || 15;
  const totalItems = Number(paginatedData?.total) || 0;

  const [q, setQ] = React.useState(sp.get("q") || "");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [year, setYear] = React.useState(
    Number(sp.get("year")) || new Date().getFullYear()
  );

  const initRange =
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined;
  const [range, setRange] = React.useState(initRange);

  const [modalState, setModalState] = React.useState({
    open: false,
    type: null,
    data: null,
  });
  const [confirmExport, setConfirmExport] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  const pushWithParams = React.useCallback(
    (extra = {}) => {
      const params = new URLSearchParams(sp.toString());
      if (year) params.set("year", String(year));
      if (range?.from && range?.to) {
        params.set("from", range.from.toISOString().slice(0, 10));
        params.set("to", range.to.toISOString().slice(0, 10));
      } else {
        params.delete("from");
        params.delete("to");
      }
      if (q) params.set("q", q);
      else params.delete("q");
      params.set("page", "1");
      Object.entries(extra).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") params.delete(k);
        else params.set(k, String(v));
      });
      router.push(`/dashboard/sampah/laporan?${params.toString()}`);
    },
    [sp, year, range?.from, range?.to, q, router]
  );

  React.useEffect(() => {
    pushWithParams();
  }, [year]);
  React.useEffect(() => {
    if (range?.from && range?.to) pushWithParams();
  }, [range?.from, range?.to]);

  const filterAnchorRef = React.useRef(null);
  const openFilterCalendar = React.useCallback(() => {
    const root = filterAnchorRef.current;
    if (!root) return;
    const btn =
      root.querySelector('button[aria-haspopup="dialog"]') ||
      root.querySelector("button");
    if (!btn) return;
    ["pointerdown", "mousedown", "mouseup", "click"].forEach((t) =>
      btn.dispatchEvent(
        new MouseEvent(t, { bubbles: true, cancelable: true, view: window })
      )
    );
  }, []);

  const handleOpenModal = (type, data = null) =>
    setModalState({ open: true, type, data });
  const handleCloseModal = () =>
    setModalState({ open: false, type: null, data: null });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await actionDeleteEntry({ id: confirmDelete.id });
      show({ title: "Terhapus", description: "Baris telah dihapus." });
      setConfirmDelete(null);
      router.refresh();
    } catch (e) {
      show({
        title: "Gagal",
        description: String(e.message || "Gagal menghapus."),
        variant: "error",
      });
      setConfirmDelete(null);
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (modalState.type === "pemasukan") {
        await actionCreateEntry({ ...payload, type: "IN" });
        show({ title: "Sukses!", description: "Pemasukan ditambahkan." });
      } else if (modalState.type === "pengeluaran") {
        await actionCreateEntry({ ...payload, type: "OUT" });
        show({ title: "Sukses!", description: "Pengeluaran ditambahkan." });
      } else if (modalState.type === "edit") {
        const originalTipe = modalState.data?.tipe;
        const typeToSend = originalTipe === "pemasukan" ? "IN" : "OUT";

        await actionUpdateEntry({
          id: modalState.data.id,
          type: typeToSend,
          ...payload,
        });
        show({ title: "Sukses!", description: "Data berhasil diperbarui." });
      }
      handleCloseModal();
      router.refresh();
    } catch (e) {
      console.error(e);
      show({
        title: "Gagal",
        description: String(e.message || "Terjadi kesalahan."),
        variant: "error",
      });
    }
  };

  const initialDataForEdit = React.useMemo(() => {
    if (modalState.type !== "edit" || !modalState.data) return undefined;
    const { data } = modalState;
    return {
      tanggal: data.tanggal?.split("T")[0] || data.tanggal,
      keterangan: data.keterangan,
      nominal: data.jumlah,
      type: data.tipe === "pemasukan" ? "IN" : "OUT",
    };
  }, [modalState]);

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4">
        <TabNavigation className="!mb-0 h-6">
          <TabNavigationLink
            href="/dashboard/sampah/laporan"
            active
            className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
          >
            Laporan Keuangan
          </TabNavigationLink>
        </TabNavigation>

        <div className="flex items-center gap-2">
          <PeriodDropdown
            year={year}
            onSelectYear={(y) => setYear(Number(y))}
            showCreateButton={false}
          />
          <div className="relative" onMouseEnter={() => setSearchOpen(true)}>
            <IconSearch
              size={16}
              className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                if (e.target.value === "") {
                  pushWithParams({ q: "" });
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && pushWithParams()}
              placeholder="Cari keterangan..."
              className={`h-8 border rounded-[10px] border-gray-300 bg-white pl-7 pr-2 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-gray-200 ${
                searchOpen || q ? "w-48" : "w-6"
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
            title="Filter"
          >
            <IconFilter size={16} />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={openFilterCalendar}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
              title="Pilih rentang tanggal"
            >
              <IconCalendar size={16} />
            </button>
            <div
              ref={filterAnchorRef}
              className="absolute inset-0 opacity-0 pointer-events-none"
              aria-hidden="true"
            >
              <DateRangePicker
                value={range}
                onChange={setRange}
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
          <button
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
            title="Export"
            onClick={() => setConfirmExport(true)}
          >
            <IconDownload size={16} />
          </button>
          {!readOnly && (
            <>
              <button
                onClick={() => handleOpenModal("pemasukan")}
                className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white"
                title="Tambah Pemasukan"
              >
                <IconPlus size={16} />
              </button>
              <button
                onClick={() => handleOpenModal("pengeluaran")}
                className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#334a2a] text-white"
                title="Tambah Pengeluaran"
              >
                <IconMinus size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white shadow overflow-hidden">
        <SampahTable
          initial={initial}
          readOnly={readOnly}
          onEdit={(item) => handleOpenModal("edit", item)}
          onDelete={(item) => setConfirmDelete(item)}
        />
      </div>

      <div className="flex items-center justify-center px-4 py-3">
        <Pagination
          page={currentPage}
          limit={itemsPerPage}
          total={totalItems}
        />
      </div>

      <TransaksiModal
        open={modalState.open}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={initialDataForEdit}
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
        })}
      />

      <ConfirmDialog
        open={confirmExport}
        title="Konfirmasi"
        description="Apakah Anda yakin ingin mengunduh file ini?"
        cancelText="Batal"
        okText="Ya, Unduh"
        onCancel={() => setConfirmExport(false)}
        onOk={() => {
          setConfirmExport(false);
          const params = new URLSearchParams(sp.toString());
          window.location.href = `${API_BASE}/sampah/laporan/export?${params.toString()}`;
        }}
      />

      {filterOpen && (
        <FilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          value={{
            typeIn: sp.get("type") === "IN",
            typeOut: sp.get("type") === "OUT",
            min: sp.get("min") ? Number(sp.get("min")) : undefined,
            max: sp.get("max") ? Number(sp.get("max")) : undefined,
          }}
          onApply={({ type, min, max }) =>
            pushWithParams({ type: type ?? "", min, max })
          }
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Hapus Transaksi"
        description={`Apakah Anda yakin ingin menghapus "${confirmDelete?.keterangan}"?`}
        cancelText="Batal"
        okText="Ya, Hapus"
        onCancel={() => setConfirmDelete(null)}
        onOk={handleDelete}
      />
    </>
  );
}
