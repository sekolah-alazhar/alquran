import { RECITERS } from '@/services/types'
import { PageHeader } from '@/components/common/States'
import { BookOpen, Mic } from '@/components/icons'

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Tentang Quran Digital" />

      <div className="surface rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-teal-700 text-white">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-ink-900 dark:text-primary-50">Quran Digital</p>
            <p className="text-xs text-ink-400">Versi 1.0 · MVP · 2026</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-primary-100/80">
          Aplikasi web untuk membaca, mempelajari, dan mendengarkan Al-Qur'an. Terinspirasi kemudahan Quran Kemenag dengan
          implementasi dan identitas visual sendiri. Terbuka tanpa iklan, tanpa login — bookmark dan riwayat tersimpan lokal
          di perangkat Anda.
        </p>
      </div>

      <div className="surface rounded-2xl p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink-900 dark:text-primary-50">
          <BookOpen className="h-4 w-4 text-primary-600" /> Sumber Data
        </h2>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-600 dark:text-primary-100/80">
          <li>
            <strong>Teks Arab, terjemahan & tafsir:</strong> Mushaf dan terjemahan Kementerian Agama RI, diakses melalui
            EQuran.id API v2 (equran.id). Tidak dimodifikasi.
          </li>
          <li>
            <strong>Audio murottal:</strong> rekaman qari dari CDN EQuran.id, diputar streaming (tidak diunduh/disimpan).
          </li>
        </ul>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {RECITERS.map((r) => (
            <span key={r.id} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] text-primary-700 dark:bg-ink-800 dark:text-primary-300">
              <Mic className="h-3 w-3" /> {r.name}
            </span>
          ))}
        </div>
      </div>

      <div className="surface rounded-2xl p-5">
        <h2 className="text-sm font-bold text-ink-900 dark:text-primary-50">Teknologi</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-primary-100/80">
          React 19 · TypeScript · Vite · Tailwind CSS · React Router. Font Arab: Amiri (SIL OFL). Tanpa pelacakan pengguna.
        </p>
      </div>

      <div className="rounded-2xl border border-gold-500/30 bg-gold-500/[0.05] p-5">
        <p className="text-sm leading-relaxed text-ink-600 dark:text-primary-100/80">
          <strong className="text-ink-900 dark:text-primary-50">Catatan akurasi:</strong> meski telah berupaya menampilkan
          data apa adanya dari sumber resmi, silakan verifikasi teks dan terjemahan terhadap mushaf/edisi resmi untuk
          keperluan pengajian atau publikasi.
        </p>
      </div>
    </div>
  )
}
