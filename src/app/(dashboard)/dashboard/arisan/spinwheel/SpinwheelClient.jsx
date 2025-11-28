"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { actionPostSpinDraw } from "./actions";
import { useToast } from "@/components/ui/useToast";
import PeriodDropdown from "../../kas/rekapitulasi/PeriodDropdown";

const WHEEL_SIZE = 520;
const DURATION = 5; // detik
const POINTER_ANGLE = 270; // pointer di atas (270° dari arah kanan)

export default function SpinwheelClient({
  initialSegments,
  periodes,
  activePeriodeId,
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const { show } = useToast();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // ---------- PERIODE ----------
  const [periodeId, setPeriodeId] = React.useState(activePeriodeId ?? null);
  React.useEffect(() => {
    setPeriodeId(activePeriodeId ?? null);
  }, [activePeriodeId]);

  const handleChangePeriode = (id) => {
    const params = new URLSearchParams(sp.toString());
    if (id) params.set("periode", String(id));
    else params.delete("periode");
    router.push(`/dashboard/arisan/spinwheel?${params.toString()}`);
  };

  // ---------- DATA KANDIDAT ----------
  const [list, setList] = React.useState(
    Array.isArray(initialSegments) ? initialSegments : []
  );
  React.useEffect(() => {
    setList(Array.isArray(initialSegments) ? initialSegments : []);
  }, [initialSegments]);

  // ---------- STATE ANIMASI ----------
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [rotation, setRotation] = React.useState(0); // derajat total

  // ---------- DIALOG ----------
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [winnerName, setWinnerName] = React.useState("");

  const wheelRadius = WHEEL_SIZE / 2;
  const segmentAngle = list.length ? 360 / list.length : 360;
  const pointerColor = "#D9E2CF";

  // simpan ke BE
  async function persistWinner(winner) {
    if (!periodeId) throw new Error("Periode belum dipilih.");

    await actionPostSpinDraw({
      periode_id: periodeId,
      warga_id: winner.id,
    });

    // langsung hilangkan dari FE juga biar terasa
    setList((prev) => prev.filter((s) => s.id !== winner.id));
  }

  const handleSpin = () => {
    if (isSpinning || !list.length || !periodeId) return;

    setIsSpinning(true);

    // snapshot supaya konsisten selama 1 spin
    const snapshot = [...list];
    const segAngle = 360 / snapshot.length;

    // berapa banyak putaran penuh + offset random
    const spins = 5 + Math.random() * 5; // 5–10 putaran
    const randomOffset = Math.random() * 360; // 0–360°
    const deltaRotation = spins * 360 + randomOffset;

    // simpan rotation baru ke variabel, jangan baca dari state setelah setRotation
    const currentRotation = rotation;
    const newRotation = currentRotation + deltaRotation;
    setRotation(newRotation);

    window.setTimeout(async () => {
      setIsSpinning(false);

      // normalisasi rotation ke 0–360
      let totalRotation = newRotation % 360;
      if (totalRotation < 0) totalRotation += 360;

      /**
       * SEGMENT CALC:
       * - awalnya tiap segmen punya rentang [i*segAngle, (i+1)*segAngle)
       *   dihitung dari arah kanan searah jarum jam.
       * - setelah diputar clockwise 'totalRotation', semuanya geser +totalRotation.
       * - pointer diam di POINTER_ANGLE.
       * - supaya ketemu segmen mana yang kena pointer:
       *     angleRelative = (POINTER_ANGLE - totalRotation) (mod 360)
       *   lalu tinggal dibagi segAngle.
       */
      let angleRelative = POINTER_ANGLE - totalRotation;
      angleRelative = ((angleRelative % 360) + 360) % 360; // 0–360

      const winnerIdx =
        snapshot.length > 0
          ? Math.floor(angleRelative / segAngle) % snapshot.length
          : -1;

      const winner = winnerIdx >= 0 ? snapshot[winnerIdx] : null;
      if (!winner) return;

      try {
        await persistWinner(winner);
        setWinnerName(winner.label);
        setSuccessOpen(true);
        router.refresh(); // sync calon berikutnya + rekap
      } catch (err) {
        show({
          title: "Gagal",
          description: err.message || "Gagal menyimpan pemenang.",
          variant: "error",
        });
      }
    }, DURATION * 1000);
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
            <PeriodDropdown
              activeId={periodeId}
              options={periodes}
              onSelect={(id) => handleChangePeriode(id)}
            />
          </div>
        </div>

        {mounted && (
          <div className="flex flex-col items-center gap-6 py-8">
            <div
              style={{
                position: "relative",
                width: WHEEL_SIZE,
                height: WHEEL_SIZE,
              }}
            >
              <motion.div
                style={{
                  width: WHEEL_SIZE,
                  height: WHEEL_SIZE,
                  borderRadius: "50%",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                }}
                animate={{ rotate: rotation }}
                transition={{
                  duration: isSpinning ? DURATION : 0,
                  ease: isSpinning ? [0.17, 0.67, 0.12, 0.99] : "linear",
                }}
              >
                {list.map((segment, index) => {
                  const startAngle = index * segmentAngle;
                  const endAngle = (index + 1) * segmentAngle;

                  const sr = (startAngle * Math.PI) / 180;
                  const er = (endAngle * Math.PI) / 180;

                  const x1 = wheelRadius + wheelRadius * Math.cos(sr);
                  const y1 = wheelRadius + wheelRadius * Math.sin(sr);
                  const x2 = wheelRadius + wheelRadius * Math.cos(er);
                  const y2 = wheelRadius + wheelRadius * Math.sin(er);

                  const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                  const d = [
                    `M ${wheelRadius} ${wheelRadius}`,
                    `L ${x1} ${y1}`,
                    `A ${wheelRadius} ${wheelRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ");

                  const textAngle = startAngle + segmentAngle / 2;
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
                        width={WHEEL_SIZE}
                        height={WHEEL_SIZE}
                        style={{ position: "absolute" }}
                      >
                        <path d={d} fill={segment.color} stroke="none" />
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

              {/* pointer segitiga di atas */}
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
              disabled={isSpinning || list.length === 0 || !periodeId}
              className="rounded-2xl bg-[#6E8649] px-5 py-3 text-white disabled:opacity-60"
            >
              {!periodeId
                ? "Pilih periode dulu"
                : list.length
                ? "Putar Spinwheel"
                : "Semua sudah dapat"}
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

// "use client";

// import * as React from "react";
// import { motion } from "framer-motion";
// import { useRouter, useSearchParams } from "next/navigation";
// import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation";
// import ConfirmDialog from "@/components/ui/ConfirmDialog";
// import { actionPostSpinDraw } from "./actions";
// import { useToast } from "@/components/ui/useToast";
// import PeriodDropdown from "../../kas/rekapitulasi/PeriodDropdown";

// const POINTER_ANGLE = -90;
// const WHEEL_SIZE = 520;
// const DURATION = 5;

// export default function SpinwheelClient({
//   initialSegments,
//   periodes,
//   activePeriodeId,
// }) {
//   const router = useRouter();
//   const sp = useSearchParams();
//   const { show } = useToast();

//   const [mounted, setMounted] = React.useState(false);
//   React.useEffect(() => setMounted(true), []);

//   const [periodeId, setPeriodeId] = React.useState(activePeriodeId ?? null);
//   React.useEffect(() => {
//     setPeriodeId(activePeriodeId ?? null);
//   }, [activePeriodeId]);

//   const handleChangePeriode = (id) => {
//     const params = new URLSearchParams(sp.toString());
//     if (id) params.set("periode", String(id));
//     else params.delete("periode");
//     router.push(`/dashboard/arisan/spinwheel?${params.toString()}`);
//   };

//   // list kandidat spin, selalu ikut props dari server
//   const [list, setList] = React.useState(
//     Array.isArray(initialSegments) ? initialSegments : []
//   );
//   React.useEffect(() => {
//     setList(Array.isArray(initialSegments) ? initialSegments : []);
//   }, [initialSegments]);

//   const [isSpinning, setIsSpinning] = React.useState(false);
//   const [rotation, setRotation] = React.useState(0);

//   const [successOpen, setSuccessOpen] = React.useState(false);
//   const [winnerName, setWinnerName] = React.useState("");

//   const wheelRadius = WHEEL_SIZE / 2;
//   const segmentAngle = list.length ? 360 / list.length : 360;
//   const pointerColor = "#D9E2CF";

//   async function persistWinner(winner) {
//     if (!periodeId) {
//       throw new Error("Periode belum dipilih.");
//     }

//     await actionPostSpinDraw({
//       periode_id: periodeId,
//       warga_id: winner.id,
//     });
//     router.refresh();
//   }

//   const handleSpin = () => {
//     if (isSpinning || !list.length || !periodeId) return;

//     setIsSpinning(true);

//     const snapshot = [...list];
//     const segAngle = 360 / snapshot.length;

//     const winnerIdx = Math.floor(Math.random() * snapshot.length);
//     const winner = snapshot[winnerIdx];

//     const initialCenterAngle = winnerIdx * segAngle + segAngle / 2;

//     const TARGET_ANGLE = -90;

//     let requiredRotation = TARGET_ANGLE - initialCenterAngle;

//     const spins = 5 + Math.random() * 5;

//     offsetRotation = offsetRotation % 360;
//     if (offsetRotation < 0) {
//       offsetRotation += 360;
//     }

//     const finalRotationFixed = spins * -360 + requiredRotation;

//     setRotation(finalRotationFixed);

//     window.setTimeout(async () => {
//       setIsSpinning(false);
//       if (!winner) return;

//       try {
//         await persistWinner(winner);
//         setWinnerName(winner.label);
//         setSuccessOpen(true);
//         router.refresh();
//       } catch (err) {
//         show({
//           title: "Gagal",
//           description: err.message || "Gagal menyimpan pemenang.",
//           variant: "error",
//         });
//       }
//     }, DURATION * 1000);
//   };

//   return (
//     <>
//       <div className="space-y-4">
//         <div className="px-4 border-[#E2E7D7] flex items-center justify-between gap-3">
//           <TabNavigation className="h-6 leading-none -mb-px">
//             <TabNavigationLink
//               href="/dashboard/arisan/rekapitulasi"
//               className="inline-flex h-6 items-center px-2 text-sm font-medium text-gray-400 hover:text-gray-600"
//             >
//               Rekapitulasi Pembayaran
//             </TabNavigationLink>
//             <TabNavigationLink
//               href="/dashboard/arisan/spinwheel"
//               active
//               className="inline-flex h-6 items-center border-b-2 !border-[#6E8649] px-2 text-sm font-medium !text-[#6E8649]"
//             >
//               Spinwheel
//             </TabNavigationLink>
//           </TabNavigation>

//           <div className="flex items-center gap-2">
//             <PeriodDropdown
//               activeId={periodeId}
//               options={periodes}
//               onSelect={(id) => handleChangePeriode(id)}
//             />
//           </div>
//         </div>

//         {mounted && (
//           <div className="flex flex-col items-center gap-6 py-8">
//             <div
//               style={{
//                 position: "relative",
//                 width: WHEEL_SIZE,
//                 height: WHEEL_SIZE,
//               }}
//             >
//               <motion.div
//                 style={{
//                   width: WHEEL_SIZE,
//                   height: WHEEL_SIZE,
//                   borderRadius: "50%",
//                   position: "relative",
//                   overflow: "hidden",
//                   boxShadow: "0 10px 30px rgba(0,0,0,.08)",
//                 }}
//                 animate={{ rotate: rotation }}
//                 transition={{
//                   duration: isSpinning ? DURATION : 0,
//                   ease: isSpinning ? [0.17, 0.67, 0.12, 0.99] : "linear",
//                 }}
//               >
//                 {list.map((segment, index) => {
//                   const startAngle = index * segmentAngle;
//                   const endAngle = (index + 1) * segmentAngle;

//                   const sr = (startAngle * Math.PI) / 180;
//                   const er = (endAngle * Math.PI) / 180;

//                   const x1 = wheelRadius + wheelRadius * Math.cos(sr);
//                   const y1 = wheelRadius + wheelRadius * Math.sin(sr);
//                   const x2 = wheelRadius + wheelRadius * Math.cos(er);
//                   const y2 = wheelRadius + wheelRadius * Math.sin(er);

//                   const largeArcFlag = segmentAngle > 180 ? 1 : 0;
//                   const d = [
//                     `M ${wheelRadius} ${wheelRadius}`,
//                     `L ${x1} ${y1}`,
//                     `A ${wheelRadius} ${wheelRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
//                     "Z",
//                   ].join(" ");

//                   const textAngle = startAngle + segmentAngle / 2;
//                   const tr = (textAngle * Math.PI) / 180;
//                   const textR = wheelRadius * 0.65;
//                   const tx = wheelRadius + textR * Math.cos(tr);
//                   const ty = wheelRadius + textR * Math.sin(tr);

//                   return (
//                     <div
//                       key={segment.id ?? `${segment.label}-${index}`}
//                       style={{ position: "absolute", inset: 0 }}
//                     >
//                       <svg
//                         width={WHEEL_SIZE}
//                         height={WHEEL_SIZE}
//                         style={{ position: "absolute" }}
//                       >
//                         <path d={d} fill={segment.color} stroke="none" />
//                         <text
//                           x={tx}
//                           y={ty}
//                           textAnchor="middle"
//                           dominantBaseline="middle"
//                           fill="#fff"
//                           fontSize="18"
//                           fontWeight="600"
//                           transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
//                           style={{
//                             writingMode: "vertical-rl",
//                             textOrientation: "mixed",
//                           }}
//                         >
//                           {segment.label}
//                         </text>
//                       </svg>
//                     </div>
//                   );
//                 })}
//               </motion.div>

//               {/* pointer segitiga */}
//               <div
//                 style={{
//                   position: "absolute",
//                   top: -10,
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   width: 0,
//                   height: 0,
//                   borderLeft: "15px solid transparent",
//                   borderRight: "15px solid transparent",
//                   borderTop: `20px solid ${pointerColor}`,
//                   zIndex: 10,
//                   filter: "drop-shadow(0 2px 4px rgba(0,0,0,.2))",
//                 }}
//               />
//             </div>

//             <button
//               onClick={handleSpin}
//               disabled={isSpinning || list.length === 0 || !periodeId}
//               className="rounded-2xl bg-[#6E8649] px-5 py-3 text-white disabled:opacity-60"
//             >
//               {!periodeId
//                 ? "Pilih periode dulu"
//                 : list.length
//                 ? "Putar Spinwheel"
//                 : "Semua sudah dapat"}
//             </button>
//           </div>
//         )}
//       </div>

//       <ConfirmDialog
//         open={successOpen}
//         onOk={() => setSuccessOpen(false)}
//         hideCancel
//         variant="success"
//         okText="Tutup"
//         title="Selamat!"
//         description={`${winnerName} mendapatkan arisan.`}
//         autoCloseMs={1800}
//       />
//     </>
//   );
// }
