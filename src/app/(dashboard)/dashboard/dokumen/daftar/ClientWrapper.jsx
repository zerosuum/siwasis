"use client";
import * as React from "react";
import DocumentModal from "./DocumentModal";
import { API_BASE } from "@/server/queries/_api";

export default function ClientWrapper() {
  const [open, setOpen] = React.useState(false);
  const [initial, setInitial] = React.useState(null);

  const onCreate = async (formData) => {
    await fetch(`${API_BASE}/documents`, { method: "POST", body: formData });
    setOpen(false);
  };
  const onUpdate = async (id, formData) => {
    await fetch(`${API_BASE}/documents/${id}`, {
      method: "PUT",
      body: formData,
    });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => {
          setInitial(null);
          setOpen(true);
        }}
        className="hidden"
        aria-hidden
      />
      <DocumentModal
        open={open}
        onClose={() => setOpen(false)}
        initial={initial}
        onCreate={onCreate}
        onUpdate={onUpdate}
      />
    </>
  );
}
