import { Inter, REM } from "next/font/google";
import "@/styles/globals.css";

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
        {children}
      </body>
    </html>
  );
}