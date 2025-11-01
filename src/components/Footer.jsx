import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-wasis-pr00 shadow-[0_-4px_6px_-4px_rgba(24,39,75,.12),0_-8px_8px_-4px_rgba(24,39,75,.08)]">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-8">
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-[64px] text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <Image
                src="/logo-siwasis.png"
                alt="Logo Siwasis"
                width={160}
                height={160}
                className="rounded-full"
                priority
              />
            </div>

            <div className="flex flex-col items-center md:items-start max-w-[420px]">
              <h4 className="font-rem font-bold text-[20px] leading-[26px] text-wasis-pr80">
                Warga Anom Siwalan Sentolo
              </h4>
              <p className="mt-3 text-wasis-pr80/90 text-sm md:text-base">
                Jl. Raya Yogya-Wates Km 18, Kelurahan Siwalan,
                <br className="hidden md:block" />
                Kecamatan Sentolo, Kabupaten Kulon Progo,
                <br className="hidden md:block" />
                Provinsi DI Yogyakarta
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start max-w-[420px]">
              <h4 className="font-rem font-bold text-[20px] leading-[26px] text-wasis-pr80">
                Hubungi Kami
              </h4>
              <div className="mt-3 flex items-center gap-2 text-wasis-pr80/90">
                <Phone size={16} />
                <span>081234567898</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-wasis-pr80/90">
                <Mail size={16} />
                <span>wasis@gmail.com</span>
              </div>
              <div className="mt-4 flex items-center justify-center md:justify-start gap-3 text-wasis-pr80/90">
                <Link href="#" aria-label="Twitter">
                  <Twitter size={18} />
                </Link>
                <Link href="#" aria-label="Facebook">
                  <Facebook size={18} />
                </Link>
                <Link href="#" aria-label="Instagram">
                  <Instagram size={18} />
                </Link>
                <Link href="#" aria-label="YouTube">
                  <Youtube size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="h-12 flex items-center justify-center rounded-t-[100px] bg-wasis-pr40 shadow-[0_-2px_4px_-2px_rgba(24,39,75,.12),0_-4px_4px_-2px_rgba(24,39,75,.08)]">
        <p className="text-wasis-nt80 text-sm text-center">© 2025 SIWASIS.</p>
      </div>
    </footer>
  );
}
