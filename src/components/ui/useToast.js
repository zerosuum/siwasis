"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((options) => {
    if (!options) return;

    const {
      title = "",
      description = "",
      variant = "success", // "success" | "error" | "warning" | "destructive"
    } = options;

    setToast({
      id: Date.now(),
      title,
      description,
      variant,
    });
  }, []);

  const dismiss = useCallback(() => {
    setToast(null);
  }, []);

  const value = useMemo(
    () => ({
      toast,
      show,
      dismiss,
    }),
    [toast, show, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider />");
  }
  return ctx;
}
