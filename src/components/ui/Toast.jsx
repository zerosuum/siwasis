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
      className={`
        pointer-events-none
        fixed inset-x-0 top-4 sm:top-6
        z-[11000]
        flex justify-center px-4
        lg:justify-end lg:pr-8
      `}
    >
      <div
        className={`
          w-full max-w-sm sm:max-w-md
          rounded-[20px] border shadow-card
          px-4 sm:px-[25px] py-4 sm:py-[25px] gap-3 sm:gap-4
          flex items-center
          ${currentStyle}
          pointer-events-auto
          animate-slide-up-and-fade
        `}
        role="status"
        aria-live="polite"
      >
        <Image
          src={currentIcon}
          alt={variant}
          width={56}
          height={56}
          className="shrink-0 sm:w-[72px] sm:h-[72px]"
        />

        <div className="flex flex-col gap-1 text-left">
          {title && (
            <p className="font-rem text-[16px] sm:text-[20px] leading-[22px] sm:leading-[26px] font-bold text-[#222]">
              {title}
            </p>
          )}
          {description && (
            <p className="font-rem text-[14px] sm:text-[16px] leading-[20px] sm:leading-[22px] text-[#222]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
