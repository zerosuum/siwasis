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

export default function SampahClient({
  initial,
  readOnly,
  periodes = [],
  activePeriodeId,
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  const paginatedData = initial?.data || {};
  const currentPage = Number(paginatedData?.current_page) || 1;
  const itemsPerPage = Number(paginatedData?.per_page) || 15;
  const totalItems = Number(paginatedData?.total) || 0;

  const [q, setQ] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);

  const initialPeriodeId =
    activePeriodeId ||
    (Array.isArray(periodes) && periodes.length > 0 ? periodes[0].id : null);

  const [periodeId, setPeriodeId] = React.useState(initialPeriodeId);

  const periodeOptions = React.useMemo(() => {
    const list = Array.isArray(periodes) ? periodes : [];
    return list.map((p) => ({
      id: p.id,
      nama: p.nama,
    }));
  }, [periodes]);

  const initRange =
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined;
  const [range, setRange] = React.useState(initRange);

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [confirmExport, setConfirmExport] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(null);

  const [modalState, setModalState] = React.useState({
    open: false,
    type: null,
    data: null,
  });

  const filterBtnRef = React.useRef(null);
  const filterAnchorRef = React.useRef(null);

  const pushWithParams = React.useCallback(
    (extra = {}) => {
      const params = new URLSearchParams(sp.toString());

      if (periodeId) params.set("periode_id", String(periodeId));

      const formatDate = (d) => {
        if (!d) return "";
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      };

      if (range?.from && range?.to) {
        params.set("from", formatDate(range.from));
        params.set("to", formatDate(range.to));
      } else {
        params.delete("from");
        params.delete("to");
      }

      params.delete("q");
      params.set("page", "1");

      Object.entries(extra).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") params.delete(k);
        else params.set(k, String(v));
      });

      router.push(`/dashboard/sampah/laporan?${params.toString()}`);
    },
    [sp, periodeId, range?.from, range?.to, router]
  );

  React.useEffect(() => {
    if (range?.from && range?.to) {
      pushWithParams();
    }
  }, [range?.from, range?.to, pushWithParams]);

  const handleResetFilter = React.useCallback(() => {
    setQ("");
    setRange(undefined);

    const params = new URLSearchParams(sp.toString());

    if (periodeId) params.set("periode_id", String(periodeId));
    else params.delete("periode_id");

    ["from", "to", "type", "min", "max", "page"].forEach((k) =>
      params.delete(k)
    );

    router.push(`/dashboard/sampah/laporan?${params.toString()}`);
  }, [sp, router, periodeId]);

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

  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (payload) => {
    if (submitting) return;
    setSubmitting(true);

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
    } finally {
      setSubmitting(false);
    }
  };

  const initialDataForEdit = React.useMemo(() => {
    if (modalState.type !== "edit" || !modalState.data) return undefined;
    const data = modalState.data;
    return {
      tanggal: data.tanggal?.split("T")[0] || data.tanggal,
      keterangan: data.keterangan,
      nominal: data.jumlah,
      type: data.tipe === "pemasukan" ? "IN" : "OUT",
    };
  }, [modalState]);

  const baseRows = paginatedData.data || [];

  const filteredRows = React.useMemo(() => {
    const s = (q || "").toLowerCase();
    if (!s) return baseRows;

    return baseRows.filter((r) => {
      const ket = (r.keterangan || "").toLowerCase();
      return ket.includes(s);
    });
  }, [baseRows, q]);

  const tableInitial = React.useMemo(
    () => ({
      ...initial,
      data: {
        ...paginatedData,
        data: filteredRows,
      },
    }),
    [initial, paginatedData, filteredRows]
  );

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

        <div className="flex flex-wrap items-center justify-end gap-2 sm:justify-end justify-start">
          <PeriodDropdown
            activeId={periodeId}
            options={periodeOptions}
            onSelect={(id) => {
              setPeriodeId(id);
              pushWithParams({ periode_id: id });
            }}
            showCreateButton={false}
          />

          <div
            className="relative"
            onMouseEnter={() => setSearchOpen(true)}
            onMouseLeave={() => !q && setSearchOpen(false)}
          >
            <IconSearch
              size={16}
              className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari keterangan..."
              className={`h-8 border rounded-[10px] border-gray-300 bg-white pl-7 pr-2 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-gray-200 ${
                searchOpen || q ? "w-48" : "w-6"
              }`}
            />
          </div>

          <button
            ref={filterBtnRef}
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
              className="absolute inset-0 pointer-events-none opacity-0"
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

          {!readOnly && (
            <button
              className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
              title="Export"
              onClick={() => setConfirmExport(true)}
            >
              <IconDownload size={16} />
            </button>
          )}

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

      <div className="overflow-hidden md:rounded-xl md:bg-white md:shadow">
        <SampahTable
          initial={tableInitial}
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
        submitting={submitting}
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

      {!readOnly && (
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
            params.delete("q");

            show({
              variant: "warning",
              title: "Mengunduh laporan",
              description:
                "Jika unduhan tidak mulai otomatis, coba ulangi beberapa saat lagi.",
            });

            window.location.href = `/api/proxy/sampah/laporan/export?${params.toString()}`;
          }}
        />
      )}

      {filterOpen && (
        <FilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          anchorEl={filterBtnRef.current}
          align="right"
          value={{
            typeIn: sp.get("type") === "IN",
            typeOut: sp.get("type") === "OUT",
            min: sp.get("min") ? Number(sp.get("min")) : undefined,
            max: sp.get("max") ? Number(sp.get("max")) : undefined,
          }}
          onApply={({ type, min, max }) =>
            pushWithParams({ type: type ?? "", min, max })
          }
          onResetAll={handleResetFilter}
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
