"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import { DateRangePicker } from "@/components/DatePicker";
import Pagination from "@/components/Pagination";
import { useToast } from "@/components/ui/useToast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import DocumentTable from "./DocumentTable";
import DocumentModal from "./DocumentModal";
import ViewerModal from "./ViewerModal";
import {
  Calendar as IconCalendar,
  Search as IconSearch,
  Plus as IconPlus,
} from "lucide-react";
import { API_BASE } from "@/lib/config";

import { actionUploadDocument, actionUpdate, actionDelete } from "./actions";

const BE_ORIGIN = (() => {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return "http://127.0.0.1:8000";
  }
})();

const publicFileURL = (file_path) =>
  `${BE_ORIGIN}/storage/${String(file_path)
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

const downloadURL = (id) => `/api/proxy/documents/${id}/download`;

export default function DocumentClient({ initial, readOnly }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  const currentPage = initial?.current_page || 1;
  const totalItems = initial?.total || 0;
  const itemsPerPage = initial?.per_page || 15;

  const [search, setSearch] = React.useState(sp.get("q") || "");
  const [searchOpen, setSearchOpen] = React.useState(false);

  const initRange =
    sp.get("from") && sp.get("to")
      ? { from: new Date(sp.get("from")), to: new Date(sp.get("to")) }
      : undefined;
  const [range, setRange] = React.useState(initRange);

  const [confirmDelete, setConfirmDelete] = React.useState(null);
  const [modalState, setModalState] = React.useState({
    open: false,
    data: null,
  });
  const [viewer, setViewer] = React.useState({
    open: false,
    url: null,
    title: "",
  });

  const [confirmDownload, setConfirmDownload] = React.useState(null);

  const toLocalYMD = React.useCallback((d) => {
    if (!d) return "";
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  }, []);
  const pushWithParams = React.useCallback(
    (extra = {}) => {
      const params = new URLSearchParams(sp.toString());

      if (search) params.set("q", search);
      else params.delete("q");

      if (range?.from && range?.to) {
        params.set("from", toLocalYMD(range.from));
        params.set("to", toLocalYMD(range.to));
      } else {
        params.delete("from");
        params.delete("to");
      }

      params.set("page", "1");

      Object.entries(extra).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") params.delete(k);
        else params.set(k, String(v));
      });

      router.push(`/dashboard/dokumen/daftar?${params.toString()}`);
    },
    [sp, search, range?.from, range?.to, router, toLocalYMD]
  );

  React.useEffect(() => {
    if (range?.from && range?.to) pushWithParams();
  }, [range?.from, range?.to, pushWithParams]);

  const onCreate = async (form) => {
    try {
      await actionUploadDocument(form);

      setModalState({ open: false, data: null });
      show({ title: "Sukses", description: "Dokumen diunggah." });
      router.refresh();
    } catch (e) {
      console.error(e);
      show({
        title: "Gagal",
        description: String(e?.message || e),
        variant: "error",
      });
    }
  };

  const onUpdate = async (id, form) => {
    try {
      await actionUpdate(id, form);
      setModalState({ open: false, data: null });
      show({ title: "Sukses", description: "Dokumen diperbarui." });
      router.refresh();
    } catch (e) {
      console.error(e);
      show({
        title: "Gagal",
        description: String(e?.message || e),
        variant: "error",
      });
    }
  };

  const onDelete = async (id) => {
    try {
      await actionDelete(id);
      setConfirmDelete(null);
      show({
        title: "Terhapus",
        description: "Dokumen dihapus.",
        duration: 2500,
      });
      router.refresh();
    } catch (e) {
      console.error(e);
      show({
        title: "Gagal",
        description: String(e?.message || e),
        variant: "error",
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4">
        <TabNavigation className="!mb-0 h-6">
          <TabNavigationLink
            href="/dashboard/dokumen/daftar"
            active
            className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
          >
            Daftar Dokumen
          </TabNavigationLink>
        </TabNavigation>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end mt-2 md:mt-0">
          <div
            className="relative"
            onMouseEnter={() => setSearchOpen(true)}
            onMouseLeave={() => !search && setSearchOpen(false)}
          >
            <IconSearch
              size={16}
              className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                if (val === "") pushWithParams({ q: "" });
              }}
              onKeyDown={(e) => e.key === "Enter" && pushWithParams()}
              placeholder="Cari nama/keterangan…"
              className={`h-8 rounded-[10px] border border-gray-300 bg-white pl-7 pr-2 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-gray-200 ${
                searchOpen || search ? "w-48" : "w-24"
              } md:${searchOpen || search ? "w-56" : "w-6"}`}
            />
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (range?.from && range?.to) {
                  setRange(undefined);
                  pushWithParams({ from: "", to: "" });
                  return;
                }

                const root = document.getElementById("doc-range-root");
                const trigger = root?.querySelector(
                  'button, [role="button"], input'
                );
                trigger?.click();
              }}
              className={[
                "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-[10px] border",
                range?.from && range?.to
                  ? "border-[#6E8649] bg-[#EEF0E8] text-[#2B3A1D]"
                  : "border-[#E2E7D7] bg-white hover:bg-[#F8FAF5] text-gray-700",
              ].join(" ")}
              title={
                range?.from && range?.to
                  ? "Klik untuk hapus filter tanggal"
                  : "Pilih rentang tanggal"
              }
            >
              <IconCalendar size={16} />
            </button>

            <div
              id="doc-range-root"
              className="absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0"
              aria-hidden="true"
            >
              <DateRangePicker
                value={range}
                onChange={(val) => {
                  setRange(val);
                }}
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
              onClick={() => setModalState({ open: true, data: null })}
              className="flex h-8 sm:h-9 items-center gap-1 rounded-[10px] bg-[#6E8649] px-3 sm:px-4 text-xs sm:text-sm text-white"
            >
              <IconPlus size={16} /> Upload
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden md:rounded-xl md:bg-white md:shadow">
        <DocumentTable
          initial={initial}
          readOnly={readOnly}
          onView={(row) =>
            setViewer({ open: true, url: publicFileURL(row.file_path), title: row.title })
          }
          onEdit={(row) => setModalState({ open: true, data: row })}
          onDelete={(row) => setConfirmDelete(row)}
          onDownload={(row) => {
            setConfirmDownload(row);
          }}
        />
      </div>

      <div className="flex items-center justify-center px-4 py-3">
        <Pagination
          page={currentPage}
          limit={itemsPerPage}
          total={totalItems}
        />
      </div>

      {modalState.open && (
        <DocumentModal
          open={modalState.open}
          onClose={() => setModalState({ open: false, data: null })}
          initial={modalState.data}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      )}
      
      {viewer.open && (
        <ViewerModal
          url={viewer.url}
          title={viewer.title}
          onClose={() => setViewer({ open: false, url: null, title: "" })}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Hapus Dokumen"
        description={`Hapus "${confirmDelete?.title}"?`}
        cancelText="Batal"
        okText="Ya, Hapus"
        onCancel={() => setConfirmDelete(null)}
        onOk={() => onDelete(confirmDelete.id)}
      />

      <ConfirmDialog
        open={!!confirmDownload}
        title="Unduh Dokumen"
        description={
          confirmDownload
            ? `Anda yakin ingin mengunduh "${confirmDownload.title}"?`
            : "Anda yakin ingin mengunduh dokumen ini?"
        }
        cancelText="Batal"
        okText="Ya, Unduh"
        onCancel={() => setConfirmDownload(null)}
        onOk={() => {
          const row = confirmDownload;
          setConfirmDownload(null);

          show({
            variant: "warning",
            title: "Mengunduh dokumen",
            description:
              "Jika unduhan tidak mulai otomatis, coba ulangi beberapa saat lagi.",
          });

          if (row?.id) {
            window.location.href = downloadURL(row.id);
          }
        }}
      />
    </>
  );
}
