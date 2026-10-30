# 📖 Quran Digital

Aplikasi web Al-Qur'an untuk **membaca, mendengarkan, dan menandai** bacaan — teks Arab, transliterasi, terjemahan Kemenag RI, tafsir, dan murottal 6 qari.

> **Live:** https://quran.pudin.eu.org

Dibangun ulang mengikuti `PRD-quran.md` (v1.0). Identitas, komponen, dan implementasi orisinal — bukan salinan Quran Kemenag.

---

## Fitur (MVP — semua terpenuhi)

| Fitur | Status | Keterangan |
|---|---|---|
| Beranda | ✅ | Sapaan, **Lanjutkan Membaca**, akses cepat, surah populer |
| Daftar 114 surah | ✅ | Filter nama/nomor/arti, kartu dengan nama Arab |
| Detail surah + ayat | ✅ | Teks Arab RTL, latin, terjemahan, per ayat |
| Audio murottal | ✅ | Per ayat + per surah, 6 qari, repeat |
| Tafsir | ✅ | Panel per ayat, teks utuh dari Kemenag (tidak diringkas) |
| Pencarian | ✅ | Nama surah, `2:255` langsung, kata dalam terjemahan |
| Bookmark | ✅ | Ayat bertanda, tersimpan lokal, halaman khusus |
| Riwayat bacaan | ✅ | 30 terakhir + "lanjutkan membaca" di beranda |
| Pengaturan tipografi | ✅ | Ukuran teks Arab & terjemahan, toggle latin/terjemahan |
| Tema terang/gelap | ✅ | Tersimpan, hormati `prefers-reduced-motion` |
| Responsif | ✅ | 320 px → desktop, tanpa horizontal overflow |
| Loading/error/empty | ✅ | Skeleton, panel error + coba lagi, empty state |

## Sumber Data

| Konten | Sumber |
|---|---|
| Teks Arab, terjemahan, tafsir | Kementerian Agama RI via **[EQuran.id API v2](https://equran.id/apidev/v2)** |
| Audio murottal | CDN EQuran.id (streaming, tidak disimpan) |
| Qari | Abdullah Al-Juhany, Abdul Muhsin Al-Qasim, Abdurrahman as-Sudais, Ibrahim Al-Dossari, Misyari Rasyid Al-Afasi, Yasin Al-Jazairi |

Tidak ada API key. Tidak ada pelacakan pengguna. Bookmark, riwayat, dan preferensi hanya di `localStorage`.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3001
npm run build    # type-check + build ke dist/
npm run preview  # serve hasil build
```

**Requirement:** Node ≥ 20.

## Struktur

```
src/
├── app/
│   ├── router.tsx                    # semua rute (nested di AppShell)
│   └── providers/AppProviders.tsx    # audio controller global + preferensi/tema
├── components/
│   ├── layout/AppShell.tsx           # header, nav desktop, bottom-nav mobile, audio bar
│   ├── quran/AyahCard.tsx            # kartu ayat + kontrol surah
│   ├── quran/SurahCard.tsx           # kartu surah (ornamen bintang 8)
│   ├── common/States.tsx             # skeleton, error, empty, page header
│   └── icons.tsx                     # ikon SVG internal
├── hooks/useData.ts                  # useAsyncData, useDebounced, useLocalVersion
├── pages/                            # Home, SurahList, SurahDetail, Search,
│                                     # Bookmark, History, Settings, About, NotFound
├── services/
│   ├── api/quranProvider.ts          # adapter EQuran.id + normalisasi + cache memori
│   ├── localStore.ts                 # bookmark, riwayat, preferensi (validasi + pub-sub)
│   └── types.ts                      # Surah, Ayah, SurahDetail, TafsirSurah, RECITERS
└── styles/globals.css                # Tailwind + utilitas (font-arabic, glass, surface)
```

## Arsitektur

```
Pages ──▶ useAsyncData ──▶ quranProvider (adapter) ──▶ EQuran.id API v2
                                    │
                                    ▼
                          Normalized: Surah / Ayah / TafsirSurah
                                    │
Pages ──▶ AppProviders (AudioController + Prefs) ──▶ <audio> tunggal
                                    │
                          localStore (localStorage)
```

**Aturan penting:**

1. **Satu audio controller global.** Hanya satu `<audio>` di seluruh aplikasi — dibuat di `AppProviders`, tidak pernah di komponen halaman. Ini mencegah dua audio berjalan bersamaan (PRD §8).
2. **Komponen tidak memanggil API langsung.** Semua lewat `quranApi` (adapter pattern, PRD §7.3).
3. **Audio lewat proxy same-origin** `/audio/...` (nginx → `cdn.equran.id`). Wajib: CSP `media-src 'self'` dan CDN memeriksa referer.
4. **Jangan mengarang data.** Jika latin/terjemahan/audio tidak tersedia dari sumber, elemen disembunyikan (PRD §17.7).
5. **Teks Arab selalu `dir="rtl"` + `font-arabic`** (Amiri, mendukung harakat).
6. **`stateRef` di AppProviders** adalah penangkal stale closure di event listener audio — jangan dihapus.

## Skema Data Internal

```ts
type Surah = { number, arabicName, latinName, translationName?, totalAyah, revelationPlace?, description? }
type Ayah  = { surahNumber, numberInSurah, arabicText, latinText?, translationText?, audioUrls: Partial<Record<ReciterId,string>> }
type SurahDetail = Surah & { ayat: Ayah[], audioFull, next, prev }
type TafsirSurah = { surahNumber, latinName, entries: { ayat, text }[] }
```

## Penyimpanan Lokal

| Key | Isi |
|---|---|
| `quran_bookmarks` | `Bookmark[]` — surah, ayat, teks Arab, terjemahan, waktu |
| `quran_reading_history` | `HistoryEntry[]` — max 30, terbaru dulu |
| `quran_last_read` | `HistoryEntry` terakhir (untuk beranda) |
| `quran_preferences` | tema, `arabicScale`, `translationScale`, `showLatin`, `showTranslation`, `reciter` |

Semua baca/tulis lewat helper dengan try/catch — JSON rusak atau storage penuh tidak membuat aplikasi crash.

## Deployment

Static build di-serve `vite preview` (port 3001) di belakang nginx.

```bash
cd /home/upudin/quran && npm run build && systemctl restart quran-app.service
```

nginx (`/etc/nginx/sites-available/quran.pudin.eu.org`) memuat:

```nginx
# CSP
connect-src 'self' https://equran.id; media-src 'self';

# Proxy audio (same-origin)
location /audio/ {
    proxy_pass https://cdn.equran.id/;
    proxy_ssl_server_name on;
    proxy_set_header Host cdn.equran.id;
}
```

**Jika menambah sumber eksternal:** tambahkan domainnya ke `connect-src` / `media-src` **dan** ke `proxy` jika perlu. Tanpa itu, browser akan memblokir dengan CSP.

## Verifikasi yang Sudah Dilakukan

- ✅ Build produksi (`tsc -b && vite build`) sukses — 347 KB JS (105 KB gzip), 27 KB CSS
- ✅ 114 surah tampil, Al-Baqarah 286 ayat, Yasin 83 ayat, Al-Kahf 110 ayat
- ✅ Teks Arab `dir=rtl` di semua kartu, font Amiri termuat
- ✅ Tafsir terbuka dengan teks utuh 5.160 karakter + atribusi Kemenag
- ✅ Bookmark bertahan setelah pindah halaman + reload
- ✅ Riwayat + "Lanjutkan membaca" di beranda berfungsi
- ✅ Tema gelap/terang tersimpan di `quran_preferences`
- ✅ Tanpa horizontal overflow di 320 px dan 390 px
- ✅ 404 route dan nomor surah invalid ditangani
- ⚠️ **Audio:** URL & data terverifikasi (MP3 ter-decode 3.3 s stereo 44.1 kHz via WebAudio, proxy balas `206 audio/mpeg`). Output suara tidak bisa diuji di Chrome headless lingkungan ini (tidak ada audio device) — perlu dicek manual di browser biasa.

## Roadmap (PRD §3.2)

- [ ] Tampilan mushaf per halaman + navigasi juz
- [ ] Tafsir Wajiz vs Tahlili terpisah
- [ ] Pengulangan audio untuk hafalan (x kali, jeda)
- [ ] Target tilawah harian + progres
- [ ] PWA + cache offline
- [ ] Akun & sinkronisasi lintas perangkat

## Lisensi

Kode: MIT. Teks Al-Qur'an, terjemahan, tafsir, dan audio mengikuti ketentuan sumber (Kemenag RI / EQuran.id) — bukan milik proyek ini. Font Amiri: SIL OFL.
