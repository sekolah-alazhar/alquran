# PRD --- Quran Digital

## Product Requirements Document

**Nama Produk:** Quran Digital\
**Jenis Produk:** Aplikasi web Al-Qur'an digital\
**Versi Dokumen:** 1.0\
**Tanggal:** 30 Oktober 2026\
**Status:** Draft untuk pengembangan\
**Platform:** Web responsif (mobile, tablet, desktop)

------------------------------------------------------------------------

## 1. Ringkasan Produk

Quran Digital adalah aplikasi web untuk membaca, mempelajari,
mendengarkan, dan menandai bacaan Al-Qur'an. Produk ini terinspirasi
dari pengalaman dan kelengkapan fitur Quran Kemenag, tetapi memiliki
identitas visual, struktur aplikasi, dan implementasi sendiri.

Aplikasi harus mengutamakan ketepatan teks Al-Qur'an, kenyamanan
membaca, aksesibilitas, performa, dan tampilan modern. Antarmuka
dirancang mobile-first dan tetap optimal pada layar komputer.

### 1.1 Tujuan Produk

1.  Memudahkan pengguna membaca Al-Qur'an kapan saja melalui browser.
2.  Menyediakan teks Arab, transliterasi, terjemahan Bahasa Indonesia,
    dan informasi surah/ayat.
3.  Mendukung pembelajaran melalui tafsir dan audio murottal.
4.  Membantu pengguna melanjutkan bacaan melalui bookmark dan riwayat.
5.  Menyediakan pengalaman yang ringan, mudah dipahami, dan bebas dari
    iklan yang mengganggu.
6.  Menggunakan sumber data yang jelas, dapat diverifikasi, dan sesuai
    ketentuan penggunaan.

### 1.2 Prinsip Produk

-   **Akurasi lebih penting daripada dekorasi:** teks Arab dan
    terjemahan tidak boleh diubah secara sembarangan.
-   **Mudah dibaca:** tipografi Arab, ukuran huruf, jarak baris, dan
    kontras menjadi prioritas.
-   **Mobile-first:** semua fitur inti nyaman digunakan pada ponsel.
-   **Transparan:** sumber teks, terjemahan, tafsir, dan audio
    dicantumkan.
-   **Tidak mengarang konten agama:** aplikasi hanya menampilkan data
    dari sumber yang dapat diverifikasi.
-   **Tanpa iklan mengganggu:** tidak ada pop-up iklan pada halaman
    membaca.

------------------------------------------------------------------------

## 2. Target Pengguna

  -----------------------------------------------------------------------
  Pengguna                            Kebutuhan
  ----------------------------------- -----------------------------------
  Pembaca harian                      Membaca surah dan melanjutkan
                                      bacaan terakhir

  Pelajar/pemula                      Melihat transliterasi dan
                                      terjemahan

  Penghafal Al-Qur'an                 Memutar audio berulang dan menandai
                                      ayat

  Pengkaji Al-Qur'an                  Membaca tafsir dan informasi ayat

  Pengguna desktop                    Membaca dengan ruang layar luas dan
                                      navigasi mudah
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 3. Ruang Lingkup Produk

### 3.1 Fitur MVP (wajib pada versi pertama)

1.  Beranda aplikasi.
2.  Daftar 114 surah.
3.  Detail surah dan daftar ayat.
4.  Tampilan teks Arab.
5.  Terjemahan Bahasa Indonesia.
6.  Transliterasi Latin apabila tersedia dari sumber tepercaya.
7.  Audio murottal per ayat atau per surah apabila tersedia.
8.  Pencarian surah dan ayat.
9.  Bookmark ayat.
10. Riwayat bacaan terakhir.
11. Pengaturan ukuran teks Arab dan terjemahan.
12. Tema terang dan gelap.
13. Responsif pada ponsel, tablet, dan desktop.
14. Penanganan loading, error, dan data kosong.

### 3.2 Fitur tahap berikutnya

-   Tampilan mushaf per halaman.
-   Navigasi berdasarkan juz dan halaman.
-   Tafsir Wajiz dan Tahlili.
-   Pilihan qari dan pengaturan kecepatan audio jika didukung.
-   Pengulangan audio untuk hafalan.
-   Target tilawah harian dan progres membaca.
-   PWA dan akses offline untuk data yang telah diunduh.
-   Kalender dan pengingat tilawah.
-   Jadwal salat dan arah kiblat, jika sumber data dan izin penggunaan
    sudah diverifikasi.
-   Akun pengguna dan sinkronisasi lintas perangkat.
-   Panel admin untuk pengelolaan konten non-ayat dan konfigurasi sumber
    API.

Fitur tahap berikutnya bukan syarat peluncuran MVP.

------------------------------------------------------------------------

## 4. Struktur Halaman dan Navigasi

### 4.1 Navigasi utama

**Desktop:** - Header: logo, pencarian, navigasi, tombol tema. - Sidebar
opsional: daftar surah, bookmark, riwayat, dan pengaturan. - Konten
utama: area membaca atau halaman yang dipilih. - Footer: informasi
aplikasi dan sumber data.

**Mobile:** - Header ringkas dengan logo dan tombol pencarian. - Konten
utama memenuhi lebar layar. - Bottom navigation: Beranda, Surah,
Bookmark, Pengaturan. - Audio player tetap mudah dijangkau ketika aktif.

### 4.2 Daftar halaman

  Route             Halaman        Fungsi
  ----------------- -------------- --------------------------------------------
  `/`               Beranda        Ringkasan, lanjutkan bacaan, surah populer
  `/surah`          Daftar Surah   Menampilkan seluruh 114 surah
  `/surah/:nomor`   Detail Surah   Menampilkan ayat dan terjemahan
  `/juz`            Daftar Juz     Navigasi berdasarkan 30 juz
  `/juz/:nomor`     Detail Juz     Ayat yang termasuk juz terpilih
  `/search`         Pencarian      Mencari surah dan ayat
  `/bookmark`       Bookmark       Ayat yang disimpan pengguna
  `/history`        Riwayat        Bacaan terakhir
  `/settings`       Pengaturan     Tema, tipografi, dan preferensi
  `/about`          Tentang        Informasi aplikasi dan sumber data

Route tambahan untuk tafsir, jika diimplementasikan, dapat menggunakan
`/surah/:nomor/ayat/:ayat/tafsir`.

------------------------------------------------------------------------

## 5. Persyaratan Fungsional

### FR-01 --- Beranda

Beranda menampilkan: - Sapaan dan identitas aplikasi. - Kartu
**Lanjutkan Membaca** berisi surah dan ayat terakhir. - Tombol **Mulai
Membaca**. - Daftar surah. - Ringkasan progres tilawah apabila fitur
progres sudah tersedia. - Akses cepat ke bookmark dan pencarian. - Ayat
pilihan hanya jika konten dan sumbernya dapat diverifikasi.

**Kriteria penerimaan:** - Pengguna dapat masuk ke bacaan terakhir dari
beranda. - Beranda tidak gagal ditampilkan ketika data riwayat belum
tersedia. - Tampilan tetap rapi pada lebar layar kecil.

### FR-02 --- Daftar Surah

Tampilkan 114 surah dengan: - Nomor surah. - Nama Arab. - Nama Latin. -
Arti nama surah. - Jumlah ayat. - Kategori Makkiyah/Madaniyah jika
tersedia dari sumber.

Fitur: - Pencarian berdasarkan nama atau nomor surah. - Pengurutan
sesuai urutan mushaf. - Klik kartu untuk membuka detail surah.

**Kriteria penerimaan:** - Jumlah surah yang ditampilkan sesuai data
sumber. - Tidak ada nomor atau nama surah yang tertukar. - Daftar dapat
digunakan dengan sentuhan dan keyboard.

### FR-03 --- Detail Surah dan Ayat

Setiap ayat menampilkan: - Nomor ayat. - Teks Arab. - Transliterasi
Latin (dapat disembunyikan). - Terjemahan Bahasa Indonesia. - Tombol
audio jika tersedia. - Tombol bookmark. - Tombol tafsir jika tersedia. -
Tombol salin teks dengan sumber dan penanda ayat yang jelas.

Fitur tambahan: - Navigasi surah sebelumnya dan berikutnya. - Navigasi
ke ayat tertentu. - Pengaturan ukuran teks. - Tampilkan/sembunyikan
transliterasi dan terjemahan. - Pilihan tampilan ringkas atau lengkap.

**Kriteria penerimaan:** - Ayat ditampilkan sesuai urutan. - Nomor ayat
dan nomor surah selalu terlihat jelas. - Teks Arab menggunakan arah
kanan-ke-kiri (`dir="rtl"`). - Teks Arab tidak terpotong pada layar
ponsel. - Jika transliterasi atau audio tidak tersedia, bagian tersebut
disembunyikan atau diberi keterangan; jangan membuat data pengganti.

### FR-04 --- Audio Murottal

-   Memutar audio per ayat atau satu surah sesuai dukungan sumber.
-   Play, pause, resume, dan stop.
-   Indikator ayat yang sedang diputar.
-   Progress bar dan durasi jika metadata tersedia.
-   Kontrol volume melalui kemampuan browser.
-   Pengulangan ayat atau surah jika didukung.
-   Menangani kegagalan pemuatan audio.
-   Tidak memutar otomatis tanpa tindakan pengguna.

**Kriteria penerimaan:** - Audio tidak memblokir pengguna membaca
teks. - Jika URL audio tidak tersedia atau gagal dimuat, tampilkan pesan
yang jelas. - Perpindahan surah tidak meninggalkan audio lama yang terus
berjalan.

### FR-05 --- Pencarian

Pengguna dapat mencari: - Nama surah. - Nomor surah. - Nomor ayat. -
Kata dalam terjemahan, jika endpoint mendukung pencarian.

Hasil menampilkan nama surah, nomor ayat, dan cuplikan terjemahan. Klik
hasil membuka ayat terkait.

**Kriteria penerimaan:** - Pencarian memiliki status loading, hasil
kosong, dan error. - Input dapat digunakan melalui keyboard mobile dan
desktop. - Hasil pencarian tidak menampilkan teks yang tidak berasal
dari sumber data.

### FR-06 --- Bookmark

-   Pengguna dapat menandai dan membatalkan tanda ayat.
-   Bookmark menyimpan surah dan nomor ayat.
-   Daftar bookmark dapat dibuka dari navigasi.
-   Pengguna dapat menghapus bookmark.
-   Data lokal tetap tersedia setelah halaman dimuat ulang.

Untuk MVP, bookmark dapat disimpan menggunakan `localStorage`.
Sinkronisasi lintas perangkat memerlukan backend dan akun pengguna pada
tahap berikutnya.

### FR-07 --- Riwayat Bacaan

-   Simpan surah dan ayat terakhir yang dibuka.
-   Tampilkan bacaan terakhir di beranda.
-   Pengguna dapat menghapus riwayat.
-   Simpan waktu pembaruan terakhir.

Riwayat lokal tidak boleh diklaim tersinkronisasi ke perangkat lain.

### FR-08 --- Pengaturan Tampilan

-   Tema terang dan gelap.
-   Ukuran teks Arab.
-   Ukuran teks terjemahan.
-   Tampilkan/sembunyikan transliterasi.
-   Tampilkan/sembunyikan terjemahan.
-   Preferensi disimpan secara lokal.

### FR-09 --- Tafsir

Jika sumber tafsir tersedia dan izin penggunaannya jelas: - Tampilkan
tafsir berdasarkan surah dan ayat. - Bedakan jenis tafsir, misalnya
Wajiz dan Tahlili. - Cantumkan nama sumber dan edisi. - Tampilkan
catatan kaki bila disediakan sumber.

Tafsir tidak boleh diringkas, diubah, atau digabungkan seolah-olah
merupakan teks resmi tanpa proses editorial yang jelas.

------------------------------------------------------------------------

## 6. Desain UI/UX

### 6.1 Arah visual

Gunakan gaya modern, bersih, elegan, dan bernuansa Islami tanpa terlalu
banyak ornamen.

**Palet warna yang disarankan:** - Primary: emerald/deep green. -
Secondary: teal. - Background terang: off-white atau warm gray. -
Surface: putih. - Dark background: charcoal/near-black. - Accent: gold
lembut untuk aksen seperlunya.

Warna harus memiliki kontras yang cukup untuk keterbacaan.

### 6.2 Tipografi

-   UI: Inter, Plus Jakarta Sans, atau font sans-serif setara.
-   Arab: gunakan font Naskh/Quranic yang mendukung tanda baca dan
    harakat secara benar, misalnya Noto Naskh Arabic atau font Quran
    yang lisensinya sesuai.
-   Terjemahan: sans-serif yang nyaman dibaca.
-   Teks Arab harus memiliki line-height lega dan ukuran yang dapat
    diatur.

Jangan mengandalkan font dekoratif untuk teks mushaf.

### 6.3 Komponen UI

-   Header responsif.
-   Sidebar desktop.
-   Bottom navigation mobile.
-   Surah card.
-   Ayah card.
-   Audio player.
-   Search input.
-   Bookmark button.
-   Theme toggle.
-   Skeleton loading.
-   Empty state.
-   Error state.
-   Toast/notifikasi.
-   Dialog konfirmasi penghapusan.

### 6.4 Prinsip pengalaman membaca

-   Area teks Arab menjadi fokus utama.
-   Hindari animasi berlebihan.
-   Jangan menampilkan iklan, pop-up, atau elemen promosi di antara
    ayat.
-   Jarak antar ayat cukup luas.
-   Kontrol audio dan bookmark mudah ditemukan.
-   Pertahankan posisi bacaan ketika pengguna kembali dari halaman
    pengaturan atau bookmark.

------------------------------------------------------------------------

## 7. Teknologi dan Arsitektur

### 7.1 Stack wajib

  -----------------------------------------------------------------------
  Teknologi                           Penggunaan
  ----------------------------------- -----------------------------------
  React                               UI dan komponen

  Vite                                Build tool dan development server

  React Router                        Routing halaman

  Tailwind CSS                        Styling responsif

  JavaScript atau TypeScript          Logika aplikasi; TypeScript
                                      direkomendasikan

  Fetch API                           Komunikasi REST API

  localStorage                        Bookmark, riwayat, dan preferensi
                                      MVP

  Lucide React                        Ikon antarmuka
  -----------------------------------------------------------------------

Pilih satu versi stabil yang kompatibel ketika proyek mulai dibuat dan
kunci versinya di lockfile.

### 7.2 Struktur folder yang disarankan

``` text
src/
├── app/
│   ├── App.jsx
│   ├── router.jsx
│   └── providers/
├── assets/
│   ├── fonts/
│   └── images/
├── components/
│   ├── common/
│   ├── layout/
│   ├── quran/
│   └── audio/
├── pages/
│   ├── HomePage.jsx
│   ├── SurahListPage.jsx
│   ├── SurahDetailPage.jsx
│   ├── JuzPage.jsx
│   ├── SearchPage.jsx
│   ├── BookmarkPage.jsx
│   ├── HistoryPage.jsx
│   ├── SettingsPage.jsx
│   └── AboutPage.jsx
├── services/
│   ├── api/
│   │   ├── client.js
│   │   ├── quranProvider.js
│   │   └── audioProvider.js
│   └── mappers/
├── hooks/
├── store/
├── utils/
├── styles/
└── main.jsx
```

### 7.3 Arsitektur integrasi API

Gunakan pola provider/adapter. Komponen React tidak boleh memanggil
endpoint API secara langsung. Semua data diakses melalui service yang
mengubah respons provider menjadi format internal aplikasi.

Alur:

``` text
React Pages & Components
          |
          v
     Custom Hooks
          |
          v
   Quran Data Service
          |
          v
    Provider Adapter
      /          \
     v            v
EQuran.id     Kemenag API
   (awal)    (jika disetujui)
          |
          v
   Normalized Data
```

Buat format data internal yang konsisten, misalnya:

``` ts
type Surah = {
  number: number;
  arabicName: string;
  latinName: string;
  translationName?: string;
  totalAyah: number;
  revelationPlace?: string;
};

type Ayah = {
  surahNumber: number;
  numberInSurah: number;
  arabicText: string;
  latinText?: string;
  translationText?: string;
  audioUrl?: string;
};
```

Nama field tersebut merupakan format internal aplikasi, bukan klaim
bahwa API menyediakan properti dengan nama yang sama.

### 7.4 Sumber API yang direkomendasikan

**A. EQuran.id API v2**

-   Dokumentasi: https://equran.id/apidev/v2
-   Base URL: `https://equran.id/api/v2`
-   Dokumentasi menyediakan endpoint daftar surah, detail surah beserta
    ayat dan audio, serta tafsir.
-   Dokumentasi menyatakan sumber data Al-Qur'an berasal dari
    Kementerian Agama RI.
-   Tidak memerlukan API key menurut dokumentasi.

Contoh endpoint: - `GET https://equran.id/api/v2/surat` -
`GET https://equran.id/api/v2/surat/1` -
`GET https://equran.id/api/v2/tafsir/1`

**B. API Qur'an Kemenag resmi**

-   Portal: https://quran-api.lpmqkemenag.id/
-   API menyediakan data Mushaf Standar Indonesia, termasuk teks Rasm
    Usmani, terjemahan edisi 2019, tafsir ringkas, tafsir tahlili, dan
    transliterasi.
-   Akses memerlukan pendaftaran dan prosedur permohonan kepada LPMQ.
    Jangan mengasumsikan endpoint atau token dapat digunakan tanpa
    persetujuan.
-   Gunakan sebagai provider resmi setelah memperoleh akses dan memahami
    ketentuan penggunaannya.

**C. Alternatif data dan audio**

-   Quranpedia: https://api.quranpedia.net/
-   Al Furqan: https://alfurqan.online/docs
-   Quran Foundation: https://api-docs.quran.com/

Alternatif ini harus dievaluasi per jenis konten. Jangan menggabungkan
teks, terjemahan, tafsir, atau audio dari sumber berbeda tanpa mencatat
asal dan lisensinya.

### 7.5 Kebijakan penggunaan API dan lisensi

-   Gratis diakses tidak selalu berarti seluruh konten bebas disalin,
    di-host ulang, atau digunakan secara komersial.
-   Periksa Terms of Use, lisensi teks terjemahan, hak audio qari, batas
    request, dan ketentuan atribusi setiap provider.
-   Simpan informasi sumber data dan versi dataset.
-   Jangan menghapus atribusi atau catatan hak cipta dari provider.
-   Jangan melakukan scraping situs Kemenag sebagai pengganti akses API
    resmi.
-   Jangan menjanjikan ketersediaan API pihak ketiga tanpa SLA.
-   Siapkan provider cadangan yang telah diverifikasi.
-   Untuk penggunaan produksi, lakukan pemeriksaan teks Arab dan
    terjemahan terhadap sumber tepercaya sebelum rilis.

------------------------------------------------------------------------

## 8. Pengelolaan State dan Penyimpanan

Untuk MVP: - `localStorage` menyimpan bookmark, riwayat, dan
preferensi. - State audio dikelola melalui satu audio controller agar
tidak ada beberapa audio aktif bersamaan. - Data API disimpan dalam
cache memori dan/atau cache HTTP sesuai kebutuhan. - Data API tidak
perlu disalin seluruhnya ke localStorage.

Contoh key lokal: - `quran_bookmarks` - `quran_reading_history` -
`quran_preferences` - `quran_last_read`

Buat helper untuk membaca dan menulis data lokal, termasuk penanganan
JSON rusak dan storage yang tidak tersedia.

Tahap akun pengguna memerlukan backend, autentikasi, database, dan
kebijakan privasi tersendiri.

------------------------------------------------------------------------

## 9. Persyaratan Non-Fungsional

### NFR-01 --- Responsif

-   Mendukung lebar layar mulai dari 320 px hingga layar desktop besar.
-   Tidak ada horizontal overflow.
-   Kontrol sentuh memiliki area interaksi yang memadai.
-   Layout desktop dan mobile disesuaikan, bukan sekadar diperkecil.

### NFR-02 --- Performa

Target awal: - Beranda dapat digunakan tanpa menunggu seluruh data
Al-Qur'an dimuat. - Lazy-load halaman dan komponen yang tidak
diperlukan. - Gunakan pagination atau pemuatan bertahap jika respons API
besar. - Optimalkan font dan aset. - Hindari memuat audio sebelum
pengguna menekan play. - Target Core Web Vitals yang baik pada perangkat
dan jaringan yang representatif.

### NFR-03 --- Keandalan

-   Tangani timeout, offline, HTTP error, dan rate limit.
-   Sediakan tombol coba lagi.
-   Cache data yang aman untuk mengurangi request berulang.
-   Jangan menampilkan data parsial seolah-olah lengkap.
-   Tampilkan sumber data jika terjadi pergantian provider.

### NFR-04 --- Aksesibilitas

-   Navigasi keyboard.
-   Label tombol yang jelas.
-   Kontras warna memadai.
-   Semantic HTML.
-   ARIA hanya ketika diperlukan.
-   Hormati preferensi reduced motion.
-   Pastikan pembaca layar dapat membedakan nomor surah dan ayat.

### NFR-05 --- Keamanan dan Privasi

-   Jangan menyimpan API secret di frontend.
-   Jangan mengumpulkan data pribadi yang tidak diperlukan.
-   Validasi input pencarian.
-   Hindari memasukkan konten API mentah sebagai HTML.
-   Jika backend ditambahkan, gunakan HTTPS, validasi server-side, dan
    proteksi rate limit.
-   Jelaskan bahwa bookmark MVP disimpan di perangkat pengguna.

------------------------------------------------------------------------

## 10. Penanganan Error dan Kondisi Khusus

  -----------------------------------------------------------------------
  Kondisi                             Perilaku aplikasi
  ----------------------------------- -----------------------------------
  API tidak tersedia                  Tampilkan pesan dan tombol coba
                                      lagi

  Koneksi offline                     Tampilkan data cache yang tersedia
                                      dan status offline

  Surah tidak ditemukan               Tampilkan halaman 404 yang ramah

  Audio gagal diputar                 Tampilkan pesan audio tidak
                                      tersedia

  Bookmark kosong                     Tampilkan panduan untuk menandai
                                      ayat

  Pencarian kosong                    Tampilkan pesan tidak ada hasil

  Rate limit                          Beri jeda request dan tampilkan
                                      pesan yang sesuai

  Data tidak lengkap                  Tandai data tidak tersedia, jangan
                                      mengarang

  localStorage gagal                  Aplikasi tetap dapat membaca
                                      Al-Qur'an tanpa fitur lokal
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 11. SEO dan PWA

### SEO

-   Gunakan title dan description yang relevan pada setiap halaman.
-   URL surah harus mudah dibaca.
-   Tambahkan Open Graph metadata.
-   Gunakan semantic HTML.
-   Pastikan halaman penting dapat diakses crawler jika strategi
    rendering mendukungnya.

### PWA (tahap berikutnya)

-   Web app manifest.
-   Service worker.
-   Installable experience.
-   Cache shell aplikasi.
-   Offline reading untuk data yang telah diunduh dan hak penyimpanannya
    mengizinkan.
-   Berikan indikator kapan konten terakhir diperbarui.

------------------------------------------------------------------------

## 12. Analitik dan Metrik Keberhasilan

Metrik yang dapat diukur tanpa mengumpulkan data sensitif: -
Keberhasilan pemuatan daftar surah. - Keberhasilan membuka detail
surah. - Tingkat kegagalan request API. - Keberhasilan pemutaran
audio. - Waktu pemuatan halaman. - Penggunaan fitur bookmark secara
agregat jika analitik diaktifkan dengan transparan.

Target penerimaan MVP: - 114 surah dapat ditampilkan dari sumber
terverifikasi. - Pengguna dapat membuka detail setiap surah. - Nomor dan
urutan ayat benar. - Bookmark dan riwayat bertahan setelah reload pada
browser yang sama. - Tema dan ukuran font dapat diubah. - Tidak ada
horizontal overflow pada viewport 320 px, tablet, dan desktop. - Tidak
ada error kritis pada alur membaca utama.

Jangan mengirim teks ayat, pencarian pribadi, atau data sensitif
pengguna ke layanan analitik.

------------------------------------------------------------------------

## 13. Rencana Pengembangan

  -----------------------------------------------------------------------
  Tahap                   Pekerjaan               Hasil
  ----------------------- ----------------------- -----------------------
  1\. Fondasi             Setup Vite, React,      Kerangka aplikasi
                          Router, Tailwind,       
                          struktur folder         

  2\. Integrasi data      Provider API, mapper,   Data surah dan ayat
                          error handling, cache   

  3\. Fitur membaca       Beranda, daftar surah,  Alur membaca berfungsi
                          detail surah            

  4\. Fitur personal      Bookmark, riwayat,      Preferensi lokal
                          pengaturan              

  5\. Audio dan pencarian Audio player, pencarian Fitur interaktif
                          ayat                    

  6\. UI/UX               Responsive, dark mode,  Antarmuka siap uji
                          aksesibilitas           

  7\. QA dan rilis        Validasi konten, tes    MVP siap dirilis
                          browser, build,         
                          deployment              
  -----------------------------------------------------------------------

Urutan dapat disesuaikan berdasarkan kapasitas tim dan kesiapan API.

------------------------------------------------------------------------

## 14. Testing dan Quality Assurance

### Functional testing

-   Daftar 114 surah.
-   Detail surah dan urutan ayat.
-   Pencarian.
-   Bookmark tambah/hapus.
-   Riwayat bacaan.
-   Pengaturan tema dan ukuran font.
-   Audio play/pause dan error handling.

### Responsive testing

Uji setidaknya: - 320 × 640 px. - 375 × 812 px. - 768 × 1024 px. - 1366
× 768 px. - 1920 × 1080 px.

### Browser testing

-   Chrome.
-   Firefox.
-   Safari.
-   Edge.
-   Browser Android dan iOS yang umum.

### Content validation

-   Bandingkan jumlah surah dan ayat dengan sumber rujukan.
-   Periksa beberapa surah pendek dan panjang.
-   Periksa harakat, tanda waqaf, dan karakter Arab.
-   Periksa kecocokan nomor ayat dan audio.
-   Verifikasi terjemahan dan tafsir terhadap edisi sumber.
-   Catat versi dan tanggal validasi dataset.

------------------------------------------------------------------------

## 15. Risiko dan Mitigasi

  -----------------------------------------------------------------------
  Risiko                              Mitigasi
  ----------------------------------- -----------------------------------
  API gratis berubah atau berhenti    Provider adapter dan alternatif
                                      terverifikasi

  Batas request                       Cache, debounce, dan pengendalian
                                      request

  Perbedaan teks antarprovider        Tetapkan satu sumber utama dan
                                      validasi

  Lisensi konten tidak jelas          Audit Terms of Use sebelum rilis

  Audio lambat                        Lazy loading dan indikator pemuatan

  Font Arab tidak tepat               Uji font dengan harakat dan tanda
                                      mushaf

  Data lokal terhapus                 Jelaskan penyimpanan lokal;
                                      sinkronisasi akun pada fase
                                      berikutnya

  Kesalahan konten agama              Validasi sumber dan pemeriksaan
                                      sebelum publikasi
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 16. Kriteria Definition of Done

MVP dinyatakan selesai jika: 1. Aplikasi berjalan dengan React + Vite.
2. React Router menangani seluruh route utama. 3. Tailwind CSS digunakan
untuk styling. 4. Beranda dan daftar surah tampil responsif. 5. Pengguna
dapat membaca seluruh surah dan ayat yang disediakan provider
terverifikasi. 6. Teks Arab, terjemahan, dan transliterasi ditampilkan
hanya jika datanya tersedia. 7. Bookmark dan riwayat berfungsi pada
perangkat yang sama. 8. Audio dan pencarian berfungsi sesuai kemampuan
API. 9. Dark mode dan pengaturan tipografi berfungsi. 10. Loading,
error, dan empty state tersedia. 11. Tidak ada error kritis pada console
dalam alur utama. 12. Build produksi berhasil. 13. Sumber data dan
ketentuan penggunaannya dicatat. 14. Konten Al-Qur'an telah melewati
pemeriksaan akurasi sebelum rilis.

------------------------------------------------------------------------

## 17. Instruksi Implementasi untuk Developer / AI Coding Agent

Bangun aplikasi sesuai PRD ini dengan ketentuan berikut:

1.  Gunakan React + Vite, React Router, dan Tailwind CSS.
2.  Buat desain orisinal yang modern, bersih, elegan, dan terinspirasi
    dari kemudahan penggunaan Quran Kemenag. Jangan menyalin logo, aset,
    atau identitas visual resmi.
3.  Terapkan mobile-first responsive design.
4.  Buat komponen reusable dan pisahkan UI dari service API.
5.  Gunakan provider adapter agar API dapat diganti tanpa mengubah
    komponen halaman.
6.  Mulai integrasi dengan EQuran.id API v2 setelah memverifikasi
    respons endpoint. Sediakan konfigurasi untuk provider Kemenag resmi
    jika akses sudah disetujui.
7.  Jangan mengarang endpoint, data ayat, tafsir, transliterasi, audio,
    atau jadwal salat.
8.  Jangan memasukkan API secret ke source code frontend.
9.  Gunakan localStorage hanya untuk data preferensi dan progres lokal
    MVP.
10. Buat loading, error, empty state, dan fallback yang jelas.
11. Gunakan font Arab yang mendukung harakat dan lakukan pengujian
    tampilan.
12. Prioritaskan akurasi teks Al-Qur'an di atas efek visual.
13. Jangan menambahkan fitur yang belum didukung data seolah-olah sudah
    berfungsi.
14. Pastikan `npm run dev` dan `npm run build` berjalan dengan baik.
15. Sertakan README berisi cara instalasi, konfigurasi API, perintah
    pengembangan, dan build.

### Perintah awal proyek

``` bash
npm create vite@latest quran-digital -- --template react
cd quran-digital
npm install
npm install react-router-dom lucide-react
npm install tailwindcss @tailwindcss/vite
npm run dev
```

Sesuaikan konfigurasi Tailwind dengan versi yang dipasang. Untuk
Tailwind CSS v4, integrasikan plugin `@tailwindcss/vite` dan import
`tailwindcss` pada stylesheet utama.

------------------------------------------------------------------------

## 18. Referensi

-   Quran Kemenag: https://quran.kemenag.go.id/
-   Portal API Qur'an Kemenag: https://quran-api.lpmqkemenag.id/
-   EQuran.id API v2: https://equran.id/apidev/v2
-   Quranpedia API: https://api.quranpedia.net/
-   Al Furqan API: https://alfurqan.online/docs
-   Quran Foundation API: https://api-docs.quran.com/

**Catatan akhir:** Seluruh API, data, font, dan audio wajib diperiksa
kembali ketentuan lisensi, atribusi, batas penggunaan, serta keakuratan
kontennya sebelum aplikasi dipublikasikan. Dokumen ini menjadi acuan
kebutuhan produk dan bukan pernyataan bahwa semua layanan pihak ketiga
menjamin ketersediaan tanpa batas.
