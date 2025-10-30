"use client";
import * as React from "react";
import { ToastProvider } from "@/components/ui/useToast";
import Toast from "@/components/ui/Toast";

export default function DashboardToastProvider({ children }) {
  return (
    <ToastProvider>
      {children}
      <Toast />
    </ToastProvider>
  );
}
