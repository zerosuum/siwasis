"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
// import { getSpinCandidates } from "@/server/queries/arisan";
import { actionPostSpinDraw } from "./actions";
import { useToast } from "@/components/ui/useToast";

export default function SpinwheelClient({ initialSegments }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  // Hydration guard
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // URL state
  const [year, setYear] = React.useState(
    Number(sp.get("year")) || new Date().getFullYear()
  );
  const [rt, setRt] = React.useState(sp.get("rt") || "all");

  // Data & UI state
  const [list, setList] = React.useState(
    Array.isArray(initialSegments) ? initialSegments : []
  );
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);

  // Modal sukses
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [winnerName, setWinnerName] = React.useState("");

  // Refresh kandidat saat year/rt berubah
  React.useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/arisan/spin-candidates?year=${year}&rt=${rt || "all"}`,
          { cache: "no-store" }
        );
        const segs = await res.json();
        if (!aborted) setList(Array.isArray(segs) ? segs : []);
      } catch {}
    })();
    return () => {
      aborted = true;
    };
  }, [year, rt]);

  // Sinkronkan URL
  React.useEffect(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("year", String(year));
    params.set("rt", rt || "all");
    router.replace(`/dashboard/arisan/spinwheel?${params.toString()}`);
  }, [year, rt]);

  const wheelSize = 520;
  const borderColor = "#000";
  const pointerColor = "#D9E2CF";
  const duration = 5;
  const segmentAngle = list.length ? 360 / list.length : 360;
  const wheelRadius = wheelSize / 2;

  async function persistWinner(winner) {
    await actionPostSpinDraw({
      wargaId: winner.id,
      tanggal: new Date().toISOString().slice(0, 10),
      year,
    });

    setList((prev) => prev.filter((s) => s.id !== winner.id));
  }

  const handleSpin = () => {
    if (isSpinning || !list.length) return;
    setIsSpinning(true);

    const spins = 5 + Math.random() * 5;
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + finalAngle;
    setRotation(totalRotation);

    window.setTimeout(async () => {
      const normalized = (360 - (totalRotation % 360)) % 360;
      const idx = Math.floor(
        normalized / (list.length ? 360 / list.length : 360)
      );
      const winner = list[idx];
      setIsSpinning(false);

      if (winner) {
        try {
          await persistWinner(winner);
          setWinnerName(winner.label);
          setSuccessOpen(true);
        } catch (err) {
          show({
            title: "Gagal",
            description: err.message || "Gagal menyimpan pemenang.",
            variant: "error",
          });
        }
      }
    }, duration * 1000);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="px-4 border-[#E2E7D7] flex items-center justify-between gap-3">
          <TabNavigation className="h-6 leading-none -mb-px">
            <TabNavigationLink
              href="/dashboard/arisan/rekapitulasi"
              className="inline-flex h-6 items-center px-2 text-sm font-medium text-gray-400 hover:text-gray-600"
            >
              Rekapitulasi Pembayaran
            </TabNavigationLink>
            <TabNavigationLink
              href="/dashboard/arisan/spinwheel"
              active
              className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
            >
              Spinwheel
            </TabNavigationLink>
          </TabNavigation>

          <div className="flex items-center gap-2">
            <select
              className="h-8 w-[180px] rounded-[12px] border border-[#E2E7D7] bg-white px-3 text-sm"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {Array.from({ length: 6 }).map((_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <option key={y} value={y}>
                    Periode {y}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {mounted && (
          <div className="flex flex-col items-center gap-6 py-8">
            <div
              style={{
                position: "relative",
                width: wheelSize,
                height: wheelSize,
              }}
            >
              <motion.div
                style={{
                  width: wheelSize,
                  height: wheelSize,
                  borderRadius: "50%",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                }}
                animate={{ rotate: rotation }}
                transition={{
                  duration: isSpinning ? duration : 0,
                  ease: isSpinning ? [0.17, 0.67, 0.12, 0.99] : "linear",
                }}
              >
                {list.map((segment, index) => {
                  const startAngle = index * (360 / list.length);
                  const endAngle = (index + 1) * (360 / list.length);

                  const sr = (startAngle * Math.PI) / 180;
                  const er = (endAngle * Math.PI) / 180;

                  const x1 = wheelRadius + wheelRadius * Math.cos(sr);
                  const y1 = wheelRadius + wheelRadius * Math.sin(sr);
                  const x2 = wheelRadius + wheelRadius * Math.cos(er);
                  const y2 = wheelRadius + wheelRadius * Math.sin(er);

                  const largeArcFlag = 360 / list.length > 180 ? 1 : 0;
                  const d = [
                    `M ${wheelRadius} ${wheelRadius}`,
                    `L ${x1} ${y1}`,
                    `A ${wheelRadius} ${wheelRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ");

                  const textAngle = startAngle + 360 / list.length / 2;
                  const tr = (textAngle * Math.PI) / 180;
                  const textR = wheelRadius * 0.65;
                  const tx = wheelRadius + textR * Math.cos(tr);
                  const ty = wheelRadius + textR * Math.sin(tr);

                  return (
                    <div
                      key={segment.id ?? `${segment.label}-${index}`}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <svg
                        width={wheelSize}
                        height={wheelSize}
                        style={{ position: "absolute" }}
                      >
                        <path
                          d={d}
                          fill={segment.color}
                          stroke={borderColor}
                          strokeWidth="2"
                        />
                        <text
                          x={tx}
                          y={ty}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#fff"
                          fontSize="18"
                          fontWeight="600"
                          transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                          style={{
                            writingMode: "vertical-rl",
                            textOrientation: "mixed",
                          }}
                        >
                          {segment.label}
                        </text>
                      </svg>
                    </div>
                  );
                })}
              </motion.div>

              <div
                style={{
                  position: "absolute",
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "15px solid transparent",
                  borderRight: "15px solid transparent",
                  borderTop: `20px solid ${pointerColor}`,
                  zIndex: 10,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,.2))",
                }}
              />
            </div>

            <button
              onClick={handleSpin}
              disabled={isSpinning || list.length === 0}
              className="rounded-2xl bg-[#6E8649] px-5 py-3 text-white disabled:opacity-60"
            >
              {list.length ? "Putar Spinwheel" : "Semua sudah dapat"}
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={successOpen}
        onOk={() => setSuccessOpen(false)}
        hideCancel
        variant="success"
        okText="Tutup"
        title="Selamat!"
        description={`${winnerName} mendapatkan arisan.`}
        autoCloseMs={1800}
      />
    </>
  );
}
