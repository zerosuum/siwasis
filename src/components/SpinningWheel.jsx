"use client";

import { useState, useRef, startTransition } from "react";
import { motion } from "framer-motion";

/**
 * SpinningWheel – komponen roda undian simpel (client component).
 *
 * Props:
 * - segments: Array<{ label: string, color?: string, id?: number|string }>
 * - wheelSize?: number (default 420)
 * - duration?: number detik (default 5)
 * - pointerColor?: string (default "#111")
 * - onFinish?: (winner) => void // dipanggil setelah animasi selesai
 */
export default function SpinningWheel({
 segments = [
 { label: "A", color: "#FF6B6B" },
 { label: "B", color: "#4ECDC4" },
 { label: "C", color: "#FFD93D" },
 { label: "D", color: "#6C5CE7" },
 { label: "E", color: "#45B7D1" },
 ],
 wheelSize = 420,
 duration = 5,
 pointerColor = "#111",
 onFinish,
}) {
 const [isSpinning, setIsSpinning] = useState(false);
 const [rotation, setRotation] = useState(0);
 const [result, setResult] = useState(null);
 const wheelRef = useRef(null);

 const safeSegments =
 Array.isArray(segments) && segments.length > 0
 ? segments
 : [{ label: "—", color: "#E5E7EB" }];
 const wheelRadius = wheelSize / 2;
 const segmentAngle = 360 / safeSegments.length;

 const spinRandom = () => {
 if (isSpinning) return;

 setResult(null);
 startTransition(() => setIsSpinning(true));

 // 5–10 putaran + sudut acak
 const spins = 5 + Math.random() * 5;
 const finalAngle = Math.random() * 360;
 const total = rotation + spins * 360 + finalAngle;

 startTransition(() => setRotation(total));

 // selesai setelah duration
 window.setTimeout(() => {
 const normalized = (360 - (total % 360)) % 360; // pointer di atas
 const index = Math.floor(normalized / segmentAngle) % safeSegments.length;
 const winner = safeSegments[index];

 setResult(winner);
 setIsSpinning(false);
 onFinish?.(winner);
 }, duration * 1000);
 };

 return (
 <div className="flex flex-col items-center gap-4">
 <div
 style={{ position: "relative", width: wheelSize, height: wheelSize }}
 >
 {/* Wheel */}
 <motion.div
 ref={wheelRef}
 style={{
 width: wheelSize,
 height: wheelSize,
 borderRadius: "50%",
 overflow: "hidden",
 position: "relative",
 boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
 background: "#fff",
 }}
 animate={{ rotate: rotation }}
 transition={{
 duration: isSpinning ? duration : 0,
 ease: isSpinning ? [0.17, 0.67, 0.12, 0.99] : "linear",
 }}
 >
 {/* iris tiap segmen */}
 {safeSegments.map((seg, i) => {
 const start = i * segmentAngle;
 const end = (i + 1) * segmentAngle;

 const startRad = (start * Math.PI) / 180;
 const endRad = (end * Math.PI) / 180;

 const x1 = wheelRadius + wheelRadius * Math.cos(startRad);
 const y1 = wheelRadius + wheelRadius * Math.sin(startRad);
 const x2 = wheelRadius + wheelRadius * Math.cos(endRad);
 const y2 = wheelRadius + wheelRadius * Math.sin(endRad);
 const largeArcFlag = segmentAngle > 180 ? 1 : 0;

 const d = [
 `M ${wheelRadius} ${wheelRadius}`,
 `L ${x1} ${y1}`,
 `A ${wheelRadius} ${wheelRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
 "Z",
 ].join(" ");

 // posisi teks
 const textAngle = start + segmentAngle / 2;
 const textRad = (textAngle * Math.PI) / 180;
 const rText = wheelRadius * 0.65;
 const tx = wheelRadius + rText * Math.cos(textRad);
 const ty = wheelRadius + rText * Math.sin(textRad);

 return (
 <svg
 key={i}
 width={wheelSize}
 height={wheelSize}
 style={{ position: "absolute", inset: 0 }}
 >
 <path
 d={d}
 fill={seg.color ?? "#E5E7EB"}
 stroke="#F3F4F6"
 strokeWidth="2"
 />
 <text
 x={tx}
 y={ty}
 textAnchor="middle"
 dominantBaseline="middle"
 fill="#111827"
 fontSize="14"
 fontWeight="600"
 transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
 style={{
 writingMode: "vertical-rl",
 textOrientation: "mixed",
 }}
 >
 {seg.label}
 </text>
 </svg>
 );
 })}
 </motion.div>

 {/* Pointer */}
 <div
 style={{
 position: "absolute",
 top: -10,
 left: "50%",
 transform: "translateX(-50%)",
 width: 0,
 height: 0,
 borderLeft: "14px solid transparent",
 borderRight: "14px solid transparent",
 borderTop: `20px solid ${pointerColor}`,
 zIndex: 10,
 }}
 aria-hidden
 />
 </div>

 <button
 onClick={spinRandom}
 disabled={isSpinning || safeSegments.length <= 1}
 className="rounded-md bg-brand px-4 py-2 text-white text-sm disabled:opacity-50"
 >
 {isSpinning ? "Memutar…" : "Putar"}
 </button>

 {result && (
 <div className="text-sm">
 Pemenang: <b>{result.label}</b>
 </div>
 )}
 </div>
 );
}
