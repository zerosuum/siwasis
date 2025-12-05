"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function TopLoader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(18);

    const step1 = setTimeout(() => setProgress(55), 120);
    const step2 = setTimeout(() => setProgress(82), 260);
    const done = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }, 480);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(done);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[100] h-[3px] w-full">
      <div
        className={`
          h-full rounded-r-full
          bg-gradient-to-r from-wasis-pr80 via-wasis-pr60 to-wasis-pr40
          shadow-[0_0_14px_rgba(110,134,73,0.65)]
          transition-all duration-300 ease-out
        `}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
