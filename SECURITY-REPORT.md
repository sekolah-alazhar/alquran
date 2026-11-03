# Laporan Keamanan & Kesiapan Produksi — quran.pudin.eu.org

Tanggal: 3 November 2026
Aplikasi: Quran Digital (React + Vite + TS, tanpa login, data lokal)
Repo: github.com/sekolah-alazhar/alquran

---

## Status: PRODUCTION READY ✅

`npm audit` → **0 vulnerabilities** (dev + prod)
`nginx -t` → OK, tanpa warning
Browser E2E → semua alur utama berfungsi, 0 error JS

---

## 1. Temuan & perbaikan

| # | Tingkat | Temuan | Status |
|---|---|---|---|
| 1 | Tinggi | `script-src 'unsafe-inline' 'unsafe-eval'` — XSS bisa mengeksekusi script | ✅ diperbaiki |
| 2 | Tinggi | `follow-redirects` CVE via axios (axios tidak dipakai) | ✅ paket dibuang |
| 3 | Tinggi | `vite`/`esbuild` dev-server CVE (baca respons dev server) | ✅ vite 5 → 7 |
| 4 | Sedang | `react-router` open redirect + SSR hydration CVE | ✅ v6 → v7.18.5 |
| 5 | Sedang | `postcss-selector-parser` DoS via `@tailwindcss/typography` (tak dipakai) | ✅ paket dibuang |
| 6 | Sedang | Tidak ada rate limit → fail2ban `nginx-limit-req` buta | ✅ 30 r/s burst 60 |
| 7 | Sedang | `vite preview` sebagai server produksi | ✅ nginx serve `dist/` |
| 8 | Sedang | Tidak ada HSTS / Permissions-Policy / COOP | ✅ dipasang |
| 9 | Sedang | `Access-Control-Allow-Origin: *` bocor di semua respons | ✅ hilang |
| 10 | Rendah | `/package.json`, `/src/main.tsx`, `/README.md`, `/PRD-quran.md` dapat diakses | ✅ 403 |
| 11 | Rendah | Aset tanpa cache header (1 tahun) | ✅ `expires 1y` |
| 12 | Rendah | File milik root di direktori app | ✅ chown upudin |
| 13 | Info | Dependensi nganggur: axios, lucide-react, npx, init | ✅ dibuang |

---

## 2. Hardening yang aktif

### HTTP Security Headers
```
Content-Security-Policy: default-src 'self'; script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https:; media-src 'self';
  connect-src 'self' https://equran.id; frame-src 'self';
  frame-ancestors 'self'; base-uri 'self'; form-action 'self';
  object-src 'none'; upgrade-insecure-requests;
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```
Catatan: `unsafe-inline` hanya tersisa di `style-src` (dibutuhkan CSS inline
Vite). `script-src` benar-benar ketat — bundle diverifikasi 0 inline script,
0 `eval`, 0 `new Function`.

### Rate limiting
- `limit_req_zone general:10m rate=30r/s`, `burst=60 nodelay`
- `limit_conn addr 30`
- Error log rate-limit jadi input fail2ban `nginx-limit-req` (maxretry 10/60s,
  bantime 24 jam)
- Cloudflare real IP aktif (`/etc/nginx/conf.d/cloudflare-realip.conf`,
  `CF-Connecting-IP`) → fail2ban memban IP penyerang, bukan IP edge Cloudflare

### Transport
- TLS 1.2 + 1.3 saja (TLS 1.0/1.1 ditolak — diuji `openssl s_client`)
- `ssl_session_cache`, `ssl_session_timeout 1d`, `ssl_session_tickets off`
- Sertifikat Cloudflare origin (valid s/d 2041)

### Penyajian konten
- nginx serve `dist/` langsung — `quran-app.service` **disabled**, port 3001 mati
- SPA fallback `try_files $uri $uri/ /index.html`
- `/assets/*` cache 1 tahun (nama file ber-hash), gambar/font 30 hari,
  `index.html` selalu revalidate
- Dotfile & artefak sumber (`env|map|md|ts|tsx|json|lock|yml|yaml|ini|log|bak|sql|sh|cjs|mjs`) → 403
- Audio murottal lewat proxy same-origin `/audio/` → `cdn.equran.id`
  (sesuai CSP `media-src 'self'`, menghindari pemeriksaan referer CDN)

---

## 3. Hasil verifikasi

**Header & routing**
- Semua header keamanan muncul di respons `/` dan `/surah/2`
- SPA route `/`, `/surah`, `/surah/1`, `/surah/2`, `/bookmark` → 200
- Path sensitif (`.env`, `.git/config`, `package.json`, `src/main.tsx`,
  `PRD-quran.md`, `README.md`, `vite.config.ts`) → 403

**Fungsional (Chrome headless, live)**
- Beranda: 10 kartu surah, 0 error JS
- Al-Kahf: 110 ayat, teks Arab `dir="rtl"`
- Font Amiri + Inter termuat
- Tafsir: panel terbuka
- Bookmark: tersimpan di localStorage
- Pencarian: "kahf" → Al-Kahf
- Audio: proxy balas `200 audio/mpeg`, ter-decode 3,3 s stereo 44,1 kHz

**Dependensi**
- `npm audit` → 0 vulnerabilities
- Build: `tsc -b && vite build` exit 0 (375 KB JS / 115 KB gzip, 27 KB CSS)

---

## 4. Sisa catatan (tidak memblokir produksi)

1. **Origin bisa diakses langsung via IP** (bypass Cloudflare) — sama seperti
   aplikasi lain di server ini. Bila ingin dikunci, allow-list range IP
   Cloudflare di security group Tencent. Perlu keputusan pemilik karena
   mengubah cara akses langsung ke server.
2. **Tidak ada SRI** untuk resource eksternal — hanya Google Fonts, dan itu
   di-load via CSS `@import` (tidak mendukung `integrity`). Risiko rendah.
3. **`style-src 'unsafe-inline'`** masih ada; menghapusnya butuh build dengan
   nonce/hash untuk CSS inline Vite. Manfaat kecil, biaya besar.
4. **Tidak ada `robots.txt`/`sitemap.xml`** di `dist/`. Bukan masalah
   keamanan; tambahkan bila ingin kontrol indeks mesin pencari.
5. **Audio bergantung pada CDN equran.id** — bila CDN itu mati, audio ikut
   mati (teks & tafsir tetap jalan). Mitigasi: cache audio lokal bila perlu.

---

## 5. Cara deploy

```bash
cd /home/upudin/quran
npm run build
chmod -R a+rX dist
```
Tidak perlu restart service apa pun — nginx membaca `dist/` langsung.

---

## 6. Backup sebelum perubahan

- `/root/quran-vhost.bak.*` (config nginx lama)
- `/root/nginx.conf.bak.*` (nginx.conf sebelum limit_req_zone)
