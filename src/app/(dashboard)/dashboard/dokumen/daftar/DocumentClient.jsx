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
import { API_BASE } from "@/server/queries/_api";

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

const downloadURL = (id) => `${BE_ORIGIN}/api/documents/${id}/download`;

export default function DocumentClient({ initial }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

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
  const [viewer, setViewer] = React.useState({ open: false, url: null });

  const pushWithParams = React.useCallback(
    (extra = {}) => {
      const params = new URLSearchParams(sp.toString());

      if (search) params.set("q", search);
      else params.delete("q");

      if (range?.from && range?.to) {
        params.set("from", range.from.toISOString().slice(0, 10));
        params.set("to", range.to.toISOString().slice(0, 10));
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
    [sp, search, range?.from, range?.to, router]
  );

  React.useEffect(() => {
    if (range?.from && range?.to) pushWithParams();
  }, [range?.from, range?.to, pushWithParams]);

  const onCreate = async (form) => {
    try {
      const res = await fetch(`${API_BASE}/documents`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setModalState({ open: false, data: null });
      show({ title: "Sukses", description: "Dokumen diunggah." });
      router.refresh();
    } catch (e) {
      console.error(e);
      show({ title: "Gagal", description: "Upload gagal.", variant: "error" });
    }
  };

  const onUpdate = async (id, form) => {
    try {
      const res = await fetch(`${API_BASE}/documents/${id}`, {
        method: "POST",
        body: form,
        headers: { "X-HTTP-Method-Override": "PUT" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setModalState({ open: false, data: null });
      show({ title: "Sukses", description: "Dokumen diperbarui." });
      router.refresh();
    } catch (e) {
      console.error(e);
      show({ title: "Gagal", description: "Update gagal.", variant: "error" });
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await fetch(`${BE_ORIGIN}/api/documents/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        const errMsg = ct.includes("application/json")
          ? (await res.json())?.message || "Delete gagal"
          : await res.text();
        throw new Error(errMsg);
      }
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
      <div className="flex items-center justify-between gap-3 px-4">
        <TabNavigation className="!mb-0 h-6">
          <TabNavigationLink
            href="/dashboard/dokumen/daftar"
            active
            className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
          >
            Daftar Dokumen
          </TabNavigationLink>
        </TabNavigation>

        <div className="flex items-center gap-2">
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
                searchOpen || search ? "w-56" : "w-6"
              }`}
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                const root = document.getElementById("doc-range-root");
                const trigger = root?.querySelector(
                  'button, [role="button"], input'
                );
                trigger?.click();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white hover:bg-[#F8FAF5]"
              title="Pilih rentang tanggal"
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

          <button
            onClick={() => setModalState({ open: true, data: null })}
            className="flex h-8 items-center gap-1 rounded-[10px] bg-[#6E8649] px-3 text-sm text-white"
          >
            <IconPlus size={16} /> Upload
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow overflow-hidden">
        <DocumentTable
          initial={initial}
          onView={(row) =>
            setViewer({ open: true, url: publicFileURL(row.file_path) })
          }
          onEdit={(row) => setModalState({ open: true, data: row })}
          onDelete={(row) => setConfirmDelete(row)}
          onDownload={(row) => (window.location.href = downloadURL(row.id))}
        />
      </div>

      <div className="flex items-center justify-center px-4 py-3">
        <Pagination
          page={initial.page}
          limit={initial.perPage}
          total={initial.total}
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
          onClose={() => setViewer({ open: false, url: null })}
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
    </>
  );
}
