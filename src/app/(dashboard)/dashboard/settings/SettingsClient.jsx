"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/useToast";

import {
  actionCreateAdmin,
  actionUpdateProfile,
  actionChangePassword,
} from "./actions";

import ProfileCard from "./ProfileCard";
import AccountDetails from "./AccountDetails";
import AdminList from "./AdminList";
import AddAdminModal from "./AddAdminModal";
import ChangePasswordModal from "./ChangePasswordModal";
import EditProfileModal from "./EditProfileModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function Button({ variant = "solid", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm transition disabled:opacity-60";
  const map = {
    solid: "bg-[#6E8649] text-white hover:bg-[#61753f]",
    ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    soft: "bg-[#E2E7D7] text-[#46552D] hover:bg-[#d6dec4]",
  };
  return (
    <button {...props} className={`${base} ${map[variant]} ${className}`} />
  );
}

function AccountActions({ onAdd, onPwd, onDelete }) {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <Button variant="soft" onClick={onAdd}>
        Tambah Admin
      </Button>
      <Button variant="ghost" onClick={onPwd}>
        Ubah Password
      </Button>
      <Button variant="danger" onClick={onDelete}>
        Hapus Akun
      </Button>
    </div>
  );
}

function PageInner({ initialProfile, initialAdmins }) {
  const { show } = useToast();
  const router = useRouter();

  const [profile, setProfile] = React.useState(initialProfile);
  const [admins, setAdmins] = React.useState(initialAdmins);
  const [isMutating, setIsMutating] = React.useState(false);

  const [openAdd, setOpenAdd] = React.useState(false);
  const [openPwd, setOpenPwd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  const [openDelete, setOpenDelete] = React.useState(false);

  async function handleCreateAdmin(p) {
    setIsMutating(true);
    try {
      await actionCreateAdmin(p);
      setOpenAdd(false);
      show({
        title: "Sukses!",
        description: "Berhasil menambahkan admin baru.",
      });
      router.refresh();
    } catch (e) {
      show({ title: "Gagal", description: e.message, variant: "error" });
    } finally {
      setIsMutating(false);
    }
  }

  async function handleUpdateProfile(p) {
    setIsMutating(true);
    try {
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("name", p.name);
      fd.append("email", p.email);
      if (p.photo) fd.append("photo", p.photo);

      const updated = await actionUpdateProfile(fd);
      const updatedProfile = updated?.data ?? updated ?? {};

      setProfile((old) => ({ ...old, ...updatedProfile }));

      router.refresh();

      show({ title: "Sukses!", description: "Profil berhasil diperbarui." });
    } catch (e) {
      show({ title: "Gagal", description: e.message, variant: "error" });
    } finally {
      setIsMutating(false);
    }
  }
  async function handleChangePassword(p) {
    setIsMutating(true);
    try {
      await actionChangePassword(p);
      setOpenPwd(false);
      show({ title: "Sukses!", description: "Password berhasil diubah." });
    } catch (e) {
      show({ title: "Gagal", description: e.message, variant: "error" });
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
        <ProfileCard profile={profile} onEdit={() => setOpenEdit(true)} />

        <div>
          <h2 className="mb-3 text-2xl font-semibold">Detail Akun</h2>
          <AccountDetails profile={profile} />
          <AccountActions
            onAdd={() => setOpenAdd(true)}
            onPwd={() => setOpenPwd(true)}
            onDelete={() => setOpenDelete(true)}
          />
        </div>
      </div>

      <div className="col-span-12 lg:col-span-5">
        <h2 className="mb-3 text-2xl font-semibold">Daftar Admin</h2>
        <AdminList admins={admins} />
      </div>

      <AddAdminModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleCreateAdmin}
        loading={isMutating}
      />
      <ChangePasswordModal
        open={openPwd}
        onClose={() => setOpenPwd(false)}
        onSubmit={handleChangePassword}
        loading={isMutating}
      />
      <EditProfileModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleUpdateProfile}
        initial={{ name: profile?.name ?? "", email: profile?.email ?? "" }}
        loading={isMutating}
      />

      <ConfirmDialog
        open={openDelete}
        title="Konfirmasi"
        description="Apakah Anda yakin ingin menghapus akun ini?"
        cancelText="Batal"
        okText="Ya, Hapus"
        onCancel={() => setOpenDelete(false)}
        onOk={() => {
          setOpenDelete(false);
          alert("TODO: panggil action hapus akun ke backend");
        }}
      />
    </div>
  );
}

export default function SettingsClient(props) {
  return <PageInner {...props} />;
}
