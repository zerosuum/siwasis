"use client";
import * as React from "react";

const Ctx = React.createContext({ show: () => {} });

export function ToastProvider({ children }) {
 const [stack, setStack] = React.useState([]);
 const show = ({ title, description, variant = "success" }) => {
 const id = Math.random().toString(36).slice(2);
 setStack((s) => [...s, { id, title, description, variant }]);
 setTimeout(() => setStack((s) => s.filter((x) => x.id !== id)), 2500);
 };
 return (
 <Ctx.Provider value={{ show }}>
 {children}
 <div className="fixed inset-0 pointer-events-none">
 {stack.map((t) => (
 <div
 key={t.id}
 className="pointer-events-auto absolute left-1/2 top-24 -translate-x-1/2 rounded-lg px-4 py-3 shadow-xl"
 style={{ background: "rgba(212, 255, 191, 0.9)" }}
 >
 <div className="font-semibold">{t.title}</div>
 {t.description && <div className="text-sm">{t.description}</div>}
 </div>
 ))}
 </div>
 </Ctx.Provider>
 );
}
export const useToast = () => React.useContext(Ctx);
