"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useToast } from "./useToast";

export default function Toast() {
  const { toast, dismiss } = useToast();

  // auto-dismiss 2.5 detik
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dismiss(), 2500);
    return () => clearTimeout(t);
  }, [toast, dismiss]);

  const normalized = useMemo(() => {
    if (!toast) return null;
    const v = toast.variant === "destructive" ? "error" : toast.variant;
    return { ...toast, variant: v || "success" };
  }, [toast]);

  if (!normalized) return null;

  const { variant, title, description } = normalized;

  const styles = {
    success: "border-[#81A242] bg-[#FBFEF5]",
    error: "border-[#DD1122] bg-[#FCE7E9]",
    warning: "border-[#A1993B] bg-[#FFFEF4]",
  };

  const icon = {
    success: "/toast/success.svg",
    error: "/toast/error.svg",
    warning: "/toast/warning.svg",
  };

  const currentStyle = styles[variant] || styles.success;
  const currentIcon = icon[variant] || icon.success;

  return (
    <div
      className="
        fixed inset-0 
        z-[11000] 
        flex items-center justify-center 
        pointer-events-none
      "
    >
      <div
        className={`
          inline-flex min-w-[480px] max-w-[90vw]
          rounded-[20px] border shadow-card
          px-[25px] py-[25px] gap-4 items-center
          animate-slide-up-and-fade
          ${currentStyle}
          pointer-events-auto
        `}
        role="status"
        aria-live="polite"
      >
        <Image
          src={currentIcon}
          alt={variant}
          width={72}
          height={72}
          className="shrink-0"
        />

        <div className="flex flex-col gap-1 text-center">
          {title && (
            <p className="font-rem text-[20px] leading-[26px] font-bold text-[#222]">
              {title}
            </p>
          )}
          {description && (
            <p className="font-rem text-[16px] leading-[22px] text-[#222]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
