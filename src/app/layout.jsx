import { Inter, REM } from "next/font/google";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/ui/useToast";
import Toast from "@/components/ui/Toast";
import TopLoader from "@/components/TopLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const rem = REM({
  subsets: ["latin"],
  variable: "--font-rem",
  weight: ["400", "500", "700"],
  display: "swap",
});


export const metadata = {
  title: "SiWASIS",
  description: "Sistem Informasi Warga Siwalan Sentolo",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${rem.variable} bg-wasis-pr00`}
    >
      <body className="min-h-screen bg-wasis-pr00 text-wasis-pr80 antialiased">
        <ToastProvider>
          <TopLoader />
          {children}
          <Toast /> {/* <- renderer global */}
        </ToastProvider>
      </body>
    </html>
  );
}