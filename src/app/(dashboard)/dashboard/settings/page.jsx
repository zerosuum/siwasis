"use client";
import * as React from "react";
import {
  getAdmins,
  createAdmin,
  getProfile,
  updateProfile,
  changePassword,
} from "@/server/queries/settings";

import ProfileCard from "./ProfileCard";
import AccountDetails from "./AccountDetails";
import AdminList from "./AdminList";
import AddAdminModal from "./AddAdminModal";
import ChangePasswordModal from "./ChangePasswordModal";
import EditProfileModal from "./EditProfileModal";
import { ToastProvider, useToast } from "@/components/ui/useToast";

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

function PageInner() {
  const { show } = useToast();

  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState({
    name: "",
    email: "",
    created_at: "",
    avatar_url: "",
  });
  const [admins, setAdmins] = React.useState([]);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openPwd, setOpenPwd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const [pf, ad] = await Promise.all([
        getProfile(),
        getAdmins({ page: 1, perPage: 50 }),
      ]);
      setProfile(pf);
      setAdmins(ad.rows ?? []);
      setLoading(false);
    })();
  }, []);

  async function handleCreateAdmin(p) {
    await createAdmin(p);
    const ad = await getAdmins({ page: 1, perPage: 50 });
    setAdmins(ad.rows ?? []);
    setOpenAdd(false);
    show({ title: "Sukses!", description: "Berhasil menambahkan admin baru." });
  }
async function handleUpdateProfile(p) {
  const curId = profile?.id;
  const updated = await updateProfile(p);

  setProfile((old) => ({ ...old, ...updated }));

  if (curId) {
    setAdmins((prev) =>
      (prev ?? []).map((a) =>
        a.id === curId ? { ...a, name: updated.name, email: updated.email } : a
      )
    );
  } else if (profile?.email) {
    const oldEmail = profile.email;
    setAdmins((prev) =>
      (prev ?? []).map((a) =>
        a.email === oldEmail
          ? { ...a, name: updated.name, email: updated.email }
          : a
      )
    );
  }

  setOpenEdit(false);
  show({ title: "Sukses!", description: "Profil berhasil diperbarui." });
}
  async function handleChangePassword(p) {
    await changePassword(p);
    setOpenPwd(false);
    show({ title: "Sukses!", description: "Password berhasil diubah." });
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Kolom kiri: profil + detail SELALU satu kolom (tanpa jarak aneh) */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
        <ProfileCard
          profile={profile}
          loading={loading}
          onEdit={() => setOpenEdit(true)}
        />

        <div>
          <h2 className="mb-3 text-2xl font-semibold">Detail Akun</h2>
          <AccountDetails profile={profile} />
          {/* Tombol DI LUAR card */}
          <AccountActions
            onAdd={() => setOpenAdd(true)}
            onPwd={() => setOpenPwd(true)}
            onDelete={() => alert("TODO: Hapus akun")}
          />
        </div>
      </div>

      {/* Kolom kanan: daftar admin, TANPA tombol hapus */}
      <div className="col-span-12 lg:col-span-5">
        <h2 className="mb-3 text-2xl font-semibold">Daftar Admin</h2>
        <AdminList admins={admins} loading={loading} />
      </div>

      {/* Modals */}
      <AddAdminModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleCreateAdmin}
      />
      <ChangePasswordModal
        open={openPwd}
        onClose={() => setOpenPwd(false)}
        onSubmit={handleChangePassword}
      />
      <EditProfileModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleUpdateProfile}
        initial={{ name: profile.name, email: profile.email }}
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <PageInner />
    </ToastProvider>
  );
}
