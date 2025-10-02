// src/store/session.js
import { create } from "zustand";

export const useSession = create((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  clear: () => set({ user: null }),
}));
