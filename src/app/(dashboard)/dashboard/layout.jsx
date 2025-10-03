// server component
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
 return (
 <html lang="id">
 {/* full screen, nggak center-centeran */}
 <body className="min-h-dvh bg-neutral-50 antialiased">
 <div className="flex min-h-dvh">
 {/* sidebar fixed width */}
 <Sidebar />
 {/* area konten melebar penuh */}
 <main className="grow">
 {/* gutter kanan-kiri kecil biar lega */}
 <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
 </main>
 </div>
 </body>
 </html>
 );
}
