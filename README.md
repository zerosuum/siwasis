# SiWASIS — Sistem Informasi Warga Anom Siwalan Sentolo  
### Frontend Repository (Next.js 15 · Tailwind CSS 4 · Tremor · Server Actions)

**SiWASIS** adalah platform informasi dan administrasi warga Dusun Anom Siwalan, Sentolo.  
Proyek ini dikembangkan sebagai bagian dari mata kuliah **Proyek Aplikasi Dasar (PAD)** TRPL UGM periode semester ganjil tahun ajaran 2025/2026.

Repository ini berisi **seluruh implementasi Frontend**: dashboard admin, publik page, dokumentasi video, kas, arisan, jimpitan, sampah, dokumen, settings, dan modul lain yang terkait.

## 1. Tujuan Proyek

- Membangun aplikasi web terintegrasi untuk administrasi kas, arisan, jimpitan, bank sampah, dan dokumentasi kegiatan warga.  
- Menghadirkan dashboard modern yang mudah dipakai warga dan pengurus.  
- Menyediakan sistem publik (company profile) dan sistem admin (protected dashboard).  
- Menjadi landasan digitalisasi proses administrasi desa.

## 2. Peran dalam Proyek

**Della Nurizki — Frontend Developer**

Implementasi yang dikerjakan di sisi frontend mencakup:

### a. Struktur & Arsitektur Frontend
- Menyusun App Router Next.js 15 dengan folder modular.  
- Dua layout utama: Public & Dashboard.  
- Sistem Proxy API dengan timeout, abort controller, token injection, dan error handling.

### b. Sistem UI/UX Reusable
- Toast system (success/error/warning).  
- ConfirmDialog global.  
- Search bar auto-expand.  
- Filtering modal, dropdown periode, tab navigation, pagination.  
- Global breadcrumbs, responsive layout.

### c. Modul Dashboard

#### **1) Kas**
- Rekap kas per-periode.  
- Checkbox pembayaran per warga per tanggal.  
- Filter RT, min/max, tanggal.  
- Download laporan.  
- KPI dashboard via Tremor.

#### **2) Arisan**
- Rekap arisan (checkbox status hadir/bayar).  
- Spinwheel (undian giliran).  
- Status “Sudah/Belum Dapat”.  
- Download rekap.

#### **3) Jimpitan**
- Rekap harian.  
- Nominal adjustable.  
- Tabel + filter tanggal.

#### **4) Sampah**
- Rekap harian.  
- Nominal adjustable.  
- Resume total pemasukan.

#### **5) Dokumen**
- Upload dokumen (PDF).  
- Hapus, preview.  
- Validasi client+server.

#### **6) Warga**
- Tambah/Edit warga.  
- Assign role (kas/arisan).  
- Filter RT, status, role.

#### **7) Settings**
- Update nama, foto profil admin.  
- Auto reload + toast.

#### **8) Dokumentasi Video**
- Upload link YouTube.  
- Validasi format.  
- Public page display.

#### **9) Public Landing Page**
- Hero section, statistik desa, CTA.  
- Blog/info kegiatan (company profile).  
- Navigasi responsif modern.

## 3. Tech Stack

| Kategori | Teknologi |
|---------|-----------|
| Framework | Next.js 15 |
| UI | Tailwind CSS v4, Shadcn UI, Tremor |
| Icons | Lucide |
| Font | Inter, REM |
| Backend | Laravel 11 (Sanctum) |
| Deploy | Vercel, Vercel |

## 4. Instalasi

```bash
git clone https://github.com/zerosuum/siwasis.git
cd siwasis
bun install
bun dev
```

Akses aplikasi via:  
http://localhost:3000

## 5. Environment Variables

```
NEXT_PUBLIC_SITE_ORIGIN=http://localhost:3000
BACKEND_BASE=https://siwasis.novarentech.web.id/api
```

## 6. Struktur Direktori

```
src/
 ├── app/(public)/
 ├── app/(dashboard)/
 ├── components/
 ├── server/queries/
 └── lib/
```

## 7. Proxy API Layer

- Mengambil token dari cookies  
- Timeout & abort controller  
- Konsisten JSON response  
- Logging untuk dev  

## 8. Kontak

**Della Nurizki — Frontend Developer**  
GitHub: https://github.com/zerosuum  
Email: dellanurizki@mail.ugm.ac.id
