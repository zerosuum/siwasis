"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import Pagination from "@/components/Pagination";
import { useToast } from "@/components/ui/useToast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import WargaTable from "./WargaTable";
import WargaFormModal from "./WargaFormModal";
import AnggotaArisanModal from "../modals/AnggotaArisanModal";
import AnggotaKasModal from "../modals/AnggotaKasModal";
import {
  Search as IconSearch,
  SlidersHorizontal as IconFilter,
  UsersRound as IconArisan,
  IdCard as IconKas,
} from "lucide-react";
import {
  API_BASE,
  addArisanMember,
  addKasMember,
} from "@/server/queries/warga";

import FilterModal from "./FilterModal";

export default function WargaClient({ initial }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  const [search, setSearch] = React.useState(sp.get("q") || "");
  const [searchOpen, setSearchOpen] = React.useState(false);

  const [rt, setRt] = React.useState(sp.get("rt") || "all");
  const [role, setRole] = React.useState(sp.get("role") || "");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [kasOnly, setKasOnly] = React.useState(sp.get("kas_only") === "1");
  const [arisanOnly, setArisanOnly] = React.useState(
    sp.get("arisan_only") === "1"
  );

  const [kasMin, setKasMin] = React.useState(sp.get("kas_min") || "");
  const [kasMax, setKasMax] = React.useState(sp.get("kas_max") || "");
  const [ariMin, setAriMin] = React.useState(sp.get("arisan_min") || "");
  const [ariMax, setAriMax] = React.useState(sp.get("arisan_max") || "");

  const [createModal, setCreateModal] = React.useState({
    open: false,
    variant: "WARGA",
  });
  const [editRow, setEditRow] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(null);
  const [kasModal, setKasModal] = React.useState({ open: false, warga: null });
  const [arisanModal, setArisanModal] = React.useState({
    open: false,
    warga: null,
  });

  const filterBtnRef = React.useRef(null);
  async function onCreate(values, variant) {
    try {
      const res = await fetch(`${API_BASE}/warga`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values), 
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const data = await res.json();
          if (res.status === 422 && data?.errors) {
            msg =
              Object.entries(data.errors)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
                .join(" | ") || msg;
          } else if (data?.message) {
            msg = data.message;
          }
        } catch {}
        throw new Error(msg);
      }

      const created = await res.json();

      if (variant === "KAS") await addKasMember(created.id);
      if (variant === "ARISAN") await addArisanMember(created.id);

      setCreateModal({ open: false, variant: "WARGA" });
      show({
        title: "Sukses",
        description:
          variant === "KAS"
            ? "Warga ditambahkan & ditandai anggota Kas."
            : variant === "ARISAN"
            ? "Warga ditambahkan & ditandai anggota Arisan."
            : "Warga ditambahkan.",
      });
      router.refresh();
    } catch (e) {
      show({
        title: "Gagal",
        description: String(e?.message || e),
        variant: "error",
        duration: 4000,
      });
    }
  }

  async function onUpdate(id, values) {
    try {
      const res = await fetch(`${API_BASE}/warga/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEditRow(null);
      show({ title: "Sukses", description: "Data warga diperbarui." });
      router.refresh();
    } catch {
      show({
        title: "Gagal",
        description: "Tidak bisa update warga.",
        variant: "error",
      });
    }
  }

  async function onDelete(id) {
    try {
      const res = await fetch(`${API_BASE}/warga/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setConfirmDelete(null);
      show({
        title: "Terhapus",
        description: "Warga dihapus.",
        duration: 2500,
      });
      router.refresh();
    } catch {
      show({
        title: "Gagal",
        description: "Tidak bisa hapus.",
        variant: "error",
      });
    }
  }

  const currentFilter = {
    rt: sp.get("rt") || "all",
    arisan_status: sp.get("arisan_status") || "",
    kas_min: sp.get("kas_min") || "",
    kas_max: sp.get("kas_max") || "",
    arisan_min: sp.get("arisan_min") || "",
    arisan_max: sp.get("arisan_max") || "",
  };

  function pushParams(extra = {}) {
    const params = new URLSearchParams(sp.toString());
    search ? params.set("q", search) : params.delete("q");
    rt && rt !== "all" ? params.set("rt", rt) : params.delete("rt");
    role ? params.set("role", role) : params.delete("role");
    kasOnly ? params.set("kas_only", "1") : params.delete("kas_only");
    arisanOnly ? params.set("arisan_only", "1") : params.delete("arisan_only");
    Object.entries(extra).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") params.delete(k);
      else params.set(k, String(v));
    });
    params.set("page", "1");
    router.push(`/dashboard/warga/tambah-warga?${params.toString()}`);
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-4 border-b border-gray-100">
        <TabNavigation className="!mb-0 h-6">
          <TabNavigationLink
            href="/dashboard/warga/tambah-warga"
            active
            className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
          >
            Data Warga
          </TabNavigationLink>
        </TabNavigation>

        <div className="flex items-center gap-2">
          {/* Search */}
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
                const v = e.target.value;
                setSearch(v);
                if (v === "") pushParams({ q: "" });
              }}
              onKeyDown={(e) => e.key === "Enter" && pushParams()}
              className={`h-8 rounded-[10px] border border-gray-300 bg-white pl-7 pr-2 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-gray-200 ${
                searchOpen || search ? "w-56" : "w-8"
              }`}
            />
          </div>

          {/* Filter */}
          <button
            ref={filterBtnRef}
            type="button"
            onClick={() => setFilterOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#E2E7D7] bg-white hover:bg-[#F8FAF5]"
            aria-haspopup="dialog"
            aria-expanded={filterOpen}
          >
            <IconFilter size={16} />
          </button>

          {/* Tambah Anggota Arisan */}
          <button
            type="button"
            onClick={() => setCreateModal({ open: true, variant: "ARISAN" })}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:opacity-90"
          >
            <IconArisan size={16} />
          </button>

          {/* Tambah Anggota Kas */}
          <button
            type="button"
            onClick={() => setCreateModal({ open: true, variant: "KAS" })}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#6E8649] text-white hover:opacity-90"
          >
            <IconKas size={16} />
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="rounded-xl bg-white shadow overflow-hidden">
        <WargaTable
          initial={initial}
          onEdit={(row) => setEditRow(row)}
          onDelete={(row) => setConfirmDelete(row)}
          onAddArisan={(row) => setArisanModal({ open: true, warga: row })}
        />
      </div>
      <div className="flex items-center justify-center px-4 py-3">
        <Pagination
          page={initial.page}
          limit={initial.perPage}
          total={initial.total}
        />
      </div>
      {createModal.open && (
        <WargaFormModal
          variant={createModal.variant}
          onClose={() => setCreateModal({ open: false, variant: "WARGA" })}
          onSubmit={(vals) => onCreate(vals, createModal.variant)}
        />
      )}
      {editRow && (
        <WargaFormModal
          variant="WARGA"
          title="Edit Warga"
          initial={editRow}
          onClose={() => setEditRow(null)}
          onSubmit={(vals) => onUpdate(editRow.id, vals)}
        />
      )}
      {kasModal.open && (
        <AnggotaKasModal
          warga={kasModal.warga}
          onClose={() => setKasModal({ open: false, warga: null })}
          onSuccess={() => {
            show({ title: "OK", description: "Ditandai anggota kas." });
            router.refresh();
          }}
        />
      )}
      {arisanModal.open && (
        <AnggotaArisanModal
          warga={arisanModal.warga}
          onClose={() => setArisanModal({ open: false, warga: null })}
          onSuccess={() => {
            show({ title: "OK", description: "Ditandai anggota arisan." });
            router.refresh();
          }}
        />
      )}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Hapus Warga"
        description={`Hapus "${confirmDelete?.nama}"?`}
        cancelText="Batal"
        okText="Ya, Hapus"
        onCancel={() => setConfirmDelete(null)}
        onOk={() => onDelete(confirmDelete.id)}
      />{" "}
      {/* Modal Filter */}
      {filterOpen && (
        <FilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          anchorEl={filterBtnRef.current}
          value={{
            rt,
            arisan_status: sp.get("arisan_status") || "",
            kas_min: sp.get("kas_min") || "",
            kas_max: sp.get("kas_max") || "",
            arisan_min: sp.get("arisan_min") || "",
            arisan_max: sp.get("arisan_max") || "",
          }}
          onApply={(v) => {
            setFilterOpen(false);
            setRt(v.rt ?? "all");
            pushParams({
              rt: v.rt && v.rt !== "all" ? v.rt : undefined,
              arisan_status: v.arisan_status || undefined,
              kas_min: v.kas_min || undefined,
              kas_max: v.kas_max || undefined,
              arisan_min: v.arisan_min || undefined,
              arisan_max: v.arisan_max || undefined,
            });
          }}
        />
      )}
    </>
  );
}
