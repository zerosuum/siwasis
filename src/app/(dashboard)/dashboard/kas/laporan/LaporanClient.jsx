"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import { DateRangePicker } from "@/components/DatePicker";
import LaporanTable from "./LaporanTable";
import Pagination from "@/components/Pagination";
import TransaksiModal from "@/components/TransaksiModal";
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
import FilterModal from "./FilterModal";
import PeriodDropdown from "../rekapitulasi/PeriodDropdown";
import PeriodModal from "../rekapitulasi/PeriodModal";
import { actionCreatePeriod } from "../rekapitulasi/actions";

function normalizeKasLaporan(resp, year) {
  if (!resp || resp.ok === false) {
    return {
      ...defaultData,
      meta: { year: year || defaultData.meta.year },
    };
  }

  const paginator = resp.pagination || {};
  const raw = Array.isArray(resp.data) ? resp.data : [];

  const rows = raw.map((r) => ({
    id: r.id,
    tanggal: r.tanggal,
    keterangan: r.keterangan,
    pemasukan: r.tipe === "pemasukan" ? Number(r.jumlah) : 0,
    pengeluaran: r.tipe === "pengeluaran" ? Number(r.jumlah) : 0,
    saldo: r.saldo_sementara ?? 0,
  }));

  const totalMasuk = rows.reduce((a, b) => a + (b.pemasukan || 0), 0);
  const totalKeluar = rows.reduce((a, b) => a + (b.pengeluaran || 0), 0);
  const saldo = totalMasuk - totalKeluar;

  const filters = resp.filter || {};
  const filterYear = filters.year ?? year ?? null;

  return {
    meta: {
      year: filterYear || new Date().getFullYear(),
    },
    rows,
    page: paginator.current_page ?? 1,
    perPage: paginator.per_page ?? 10,
    total: paginator.total ?? rows.length,
    kpi: {
      pemasukanFormatted: formatRp(totalMasuk),
      pengeluaranFormatted: formatRp(totalKeluar),
      saldoFormatted: formatRp(saldo),
      rangeLabel: filterYear ? `Tahun ${filterYear}` : "Semua",
    },
  };
}

export default function LaporanClient({ initial, readOnly }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  const periodes = initial?.periodes || [];

  const metaYear = initial?.meta?.year;
  const urlYear = sp.get("year") ? Number(sp.get("year")) : null;
  const [year, setYear] = React.useState(
    urlYear || metaYear || new Date().getFullYear()
  );

  const [q, setQ] = React.useState(sp.get("q") || "");
  const [searchOpen, setSearchOpen] = React.useState(false);

  const initRange =
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined;
  const [range, setRange] = React.useState(initRange);

  const [filterOpen, setFilterOpen] = React.useState(false);
  const setoranBounds = React.useMemo(() => ({ min: 0, max: 10_000_000 }), []);

  const filterBtnRef = React.useRef(null);

  const [modalState, setModalState] = React.useState({
    open: false,
    type: null,
    data: null,
  });
  const [confirmExport, setConfirmExport] = React.useState(false);
  const [newPeriodOpen, setNewPeriodOpen] = React.useState(false);

  const [deleteState, setDeleteState] = React.useState({
    open: false,
    item: null,
  });

  const toLocalYMD = (d) =>
    [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");

  const pushWithParams = React.useCallback(
    (extra = {}) => {
      const params = new URLSearchParams(sp.toString());

      // year
      if (year) params.set("year", String(year));
      else params.delete("year");

      // range tanggal
      if (range?.from && range?.to) {
        params.set("from", toLocalYMD(range.from));
        params.set("to", toLocalYMD(range.to));
      } else {
        params.delete("from");
        params.delete("to");
      }

      // search
      const trimmed = q.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");

      // reset page kalau ada perubahan
      params.set("page", "1");

      // extra
      Object.entries(extra).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") params.delete(k);
        else params.set(k, String(v));
      });

      router.push(`/dashboard/kas/laporan?${params.toString()}`);
    },
    [sp, year, range?.from, range?.to, q, router]
  );

  // ganti tahun via dropdown
  const handleSelectYear = (y) => {
    setYear(Number(y));
  };

  React.useEffect(() => {
    const currentYear = sp.get("year") ? Number(sp.get("year")) : null;
    if (currentYear !== year) {
      pushWithParams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  React.useEffect(() => {
    if (range?.from && range?.to) {
      pushWithParams();
    }
  }, [range?.from, range?.to, pushWithParams]);

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
        const pemasukan = Number(modalState.data?.pemasukan ?? 0);
        const pengeluaran = Number(modalState.data?.pengeluaran ?? 0);

        const type = pengeluaran > 0 ? "OUT" : "IN";

        await actionUpdateEntry({
          id: modalState.data.id,
          type,
          ...payload,
        });
        title = "Data berhasil diperbarui";
      }
      handleCloseModal();
      show({ title: "Sukses!", description: title });
      router.refresh();
    } catch (e) {
      console.error(e);
      show({
        title: "Gagal",
        description: "Terjadi kesalahan.",
        variant: "error",
      });
    }
  };

  const initialDataForEdit = React.useMemo(() => {
    if (modalState.type !== "edit") return undefined;

    const pemasukan = Number(modalState.data?.pemasukan ?? 0);
    const pengeluaran = Number(modalState.data?.pengeluaran ?? 0);
    const isPengeluaran = pengeluaran > 0;

    return {
      tanggal:
        modalState.data?.tanggal?.split("T")[0] || modalState.data?.tanggal,
      keterangan: modalState.data?.keterangan,
      nominal: isPengeluaran ? pengeluaran : pemasukan,
      type: isPengeluaran ? "OUT" : "IN",
    };
  }, [modalState]);

  const handleCreatePeriod = async ({ name, nominal, from, to }) => {
    try {
      const res = await actionCreatePeriod({ name, nominal, from, to });
      setNewPeriodOpen(false);
      show({ title: "Sukses!", description: "Periode baru dibuat." });
      const y = Number(res?.year) || new Date().getFullYear();
      setYear(y);
    } catch (e) {
      console.error(e);
      show({
        title: "Gagal",
        description: "Tidak dapat membuat periode baru.",
        variant: "error",
      });
    }
  };

  const activePeriode = React.useMemo(() => {
    if (!periodes.length) return null;
    const found = periodes.find((p) => {
      if (!p.tanggal_mulai) return false;
      return new Date(p.tanggal_mulai).getFullYear() === Number(year);
    });
    return found || periodes[0];
  }, [periodes, year]);

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4">
        <TabNavigation className="!mb-0 h-6">
          <TabNavigationLink
            href="/dashboard/kas/rekapitulasi"
            className="inline-flex h-6 items-center px-2 text-sm font-medium text-gray-400 hover:text-gray-600"
          >
            Rekapitulasi Pembayaran
          </TabNavigationLink>
          <TabNavigationLink
            href="/dashboard/kas/laporan"
            active
            className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
          >
            Laporan Keuangan
          </TabNavigationLink>
        </TabNavigation>

        <div className="flex items-center gap-2">
          <PeriodDropdown
            activeId={activePeriode?.id ?? null}
            options={periodes}
            onSelect={(id) => {
              const p = periodes.find((pp) => pp.id === id);
              if (p?.tanggal_mulai) {
                const y = new Date(p.tanggal_mulai).getFullYear();
                setYear(y);
              }
            }}
            showCreateButton={false}
          />

          <div className="relative" onMouseEnter={() => setSearchOpen(true)}>
            <IconSearch
              size={16}
              className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pushWithParams();
                }
              }}
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
              aria-label="Pilih rentang tanggal"
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

          {!readOnly && (
            <button
              onClick={() => setConfirmExport(true)}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white"
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

      <div className="rounded-xl bg-white shadow overflow-hidden">
        <LaporanTable
          initial={initial}
          readOnly={readOnly}
          onEdit={(item) => handleOpenModal("edit", item)}
          onDelete={(item) => {
            setDeleteState({
              open: true,
              item,
            });
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
        open={deleteState.open}
        title="Hapus Transaksi"
        description={
          deleteState.item?.keterangan
            ? `Yakin ingin menghapus "${deleteState.item.keterangan}"?`
            : "Yakin ingin menghapus transaksi ini?"
        }
        cancelText="Batal"
        okText="Ya, Hapus"
        onCancel={() =>
          setDeleteState({
            open: false,
            item: null,
          })
        }
        onOk={async () => {
          if (!deleteState.item?.id) {
            setDeleteState({ open: false, item: null });
            return;
          }

          try {
            await actionDeleteEntry({ id: deleteState.item.id });
            show({
              title: "Terhapus",
              description: "Baris telah dihapus.",
            });
            setDeleteState({ open: false, item: null });
            router.refresh();
          } catch (e) {
            console.error(e);
            show({
              title: "Gagal",
              description: "Tidak dapat menghapus data.",
              variant: "error",
            });
          }
        }}
      />

      {filterOpen && (
        <FilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          anchorEl={filterBtnRef.current}
          align="right"
          bounds={setoranBounds}
          value={{
            typeIn: sp.get("type") === "IN",
            typeOut: sp.get("type") === "OUT",
            min: sp.get("min") ? Number(sp.get("min")) : undefined,
            max: sp.get("max") ? Number(sp.get("max")) : undefined,
          }}
          onApply={({ type, min, max }) => {
            const mappedType = type === "IN" || type === "OUT" ? type : "";
            pushWithParams({ type: mappedType, min, max });
          }}
        />
      )}

      {!readOnly && (
        <ConfirmDialog
          open={confirmExport}
          title="Konfirmasi"
          description="Apakah Anda yakin ingin mengunduh laporan kas ini?"
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

            window.location.href = `/api/proxy/kas/laporan/export?${params.toString()}`;
          }}
        />
      )}

      <PeriodModal
        open={newPeriodOpen}
        onClose={() => setNewPeriodOpen(false)}
        onSubmit={handleCreatePeriod}
      />
    </>
  );
}
