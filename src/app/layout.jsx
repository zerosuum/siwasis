import { REM } from "next/font/google";
import "@/styles/globals.css";

const rem = REM({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rem",
});

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=REM:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}

