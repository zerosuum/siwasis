"use client";
import * as React from "react";
import DashboardChartWrapper from "./DashboardChartWrapper";

export default function DashboardSyncRow({ chartData, arisan }) {
  const rightRef = React.useRef(null);
  const [rightH, setRightH] = React.useState(null);

  React.useEffect(() => {
    if (!rightRef.current) return;
    const update = () =>
      setRightH(rightRef.current.getBoundingClientRect().height);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(rightRef.current);
    return () => ro.disconnect();
  }, []);

  const isSudah = (statusTypeOrLabel) => {
    const v = String(statusTypeOrLabel || "").toLowerCase();
    if (v === "sudah") return true;
    if (v === "belum") return false;
    return v.includes("sudah");
  };

  return (
    <div className="grid items-start grid-cols-1 gap-4 lg:grid-cols-12">
      <div
        className="lg:col-span-8 rounded-2xl shadow-sm"
        style={rightH ? { height: rightH } : undefined}
      >
        <DashboardChartWrapper chartData={chartData} fillContainer />
      </div>

      <div
        ref={rightRef}
        className="lg:col-span-4 rounded-2xl bg-white border border-[#EEF0E8] shadow-sm overflow-hidden"
      >
        <div className="overflow-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-[#F4F6EE] sticky top-0 z-10">
              <tr className="text-left text-gray-600">
                <th className="py-3 px-3 w-[56px]">No</th>
                <th className="py-3 px-3">Nama</th>
                <th className="py-3 px-3 w-[140px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {arisan.slice(0, 5).map((r, i) => {
                const activeType = r.statusType ?? r.status;
                const label = r.status ?? r.statusLabel ?? "-";

                return (
                  <tr
                    key={r.id}
                    className={i % 2 ? "bg-[#FAFBF7]" : "bg-white"}
                  >
                    <td className="py-3 px-3 text-gray-500">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3.5 px-3">{r.nama}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          isSudah(activeType)
                            ? "bg-[#EEF0E8] text-[#2B3A1D]"
                            : "bg-[#FFF6E5] text-[#B0892E]"
                        }`}
                      >
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!arisan?.length && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
