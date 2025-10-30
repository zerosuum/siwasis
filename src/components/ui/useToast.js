"use client";
import React from "react";
import Toast from "./Toast";

const Ctx = React.createContext(null);

export function ToastProvider({ children }) {
  const [state, setState] = React.useState({
    open: false,
    title: "",
    description: "",
    variant: "success",
    duration: 2400,
  });

  const show = React.useCallback(
    ({ title, description, variant = "success", duration = 2400 }) => {
      setState({ open: true, title, description, variant, duration });
    },
    []
  );
  const hide = React.useCallback(
    () => setState((s) => ({ ...s, open: false })),
    []
  );

  return (
    <Ctx.Provider value={{ show, hide }}>
      {children}
      <Toast
        open={state.open}
        onClose={hide}
        title={state.title}
        desc={state.description}
        variant={state.variant}
        duration={state.duration}
      />
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
