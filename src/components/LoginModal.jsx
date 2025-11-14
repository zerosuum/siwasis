"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/useToast";

export default function LoginModal({ open, onClose }) {
  const router = useRouter();
  const { show: toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || "Email atau password salah.";
        setError(msg);

        toast({
          variant: "error",
          title: "Gagal!",
          description: msg,
        });

        return;
      }

      const username =
        data?.user?.username ||
        data?.profile?.username ||
        data?.user?.email ||
        email;

      toast({
        variant: "success",
        title: "Sukses!",
        description: `Berhasil login ke akun @${username || "admin"}.`,
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("AUTH_STATE", { detail: { loggedIn: true } })
        );
      }

      onClose();

      router.refresh();
    } catch (err) {
      const msg = err.message || "Terjadi kesalahan saat login.";

      setError(msg);

      toast({
        variant: "error",
        title: "Gagal!",
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[420px] max-w-[90vw] bg-white rounded-2xl shadow-modal p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold font-rem text-wasis-pr80">
            Login Admin
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-10 px-6 rounded-lg bg-wasis-pr60 text-white font-semibold text-sm flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
