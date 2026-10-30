import { usePrefs } from '@/app/providers/AppProviders'
import { localStore } from '@/services/localStore'
import { RECITERS } from '@/services/types'
import { PageHeader } from '@/components/common/States'
import { Sun, Moon, Text, Mic, Trash } from '@/components/icons'

function Row({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="surface flex items-center justify-between gap-4 rounded-2xl p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-800 dark:text-primary-50">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-ink-400">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { prefs, setPrefs } = usePrefs()

  return (
    <div className="space-y-5">
      <PageHeader title="Pengaturan" subtitle="Tampilan & preferensi — tersimpan otomatis di perangkat ini" />

      {/* Tema */}
      <section className="space-y-2.5">
        <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-ink-400">Tampilan</h2>
        <Row label="Tema" hint={prefs.theme === 'dark' ? 'Gelap aktif' : 'Terang aktif'}>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setPrefs({ theme: 'light' })}
              aria-label="Tema terang"
              aria-pressed={prefs.theme === 'light'}
              className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                prefs.theme === 'light' ? 'bg-primary-600 text-white' : 'bg-primary-50 text-ink-500 dark:bg-ink-800 dark:text-ink-400'
              }`}
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPrefs({ theme: 'dark' })}
              aria-label="Tema gelap"
              aria-pressed={prefs.theme === 'dark'}
              className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                prefs.theme === 'dark' ? 'bg-primary-600 text-white' : 'bg-primary-50 text-ink-500 dark:bg-ink-800 dark:text-ink-400'
              }`}
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>
        </Row>

        <Row label="Tampilkan transliterasi Latin">
          <button
            type="button"
            role="switch"
            aria-checked={prefs.showLatin}
            onClick={() => setPrefs({ showLatin: !prefs.showLatin })}
            className={`relative h-6 w-11 rounded-full transition-colors ${prefs.showLatin ? 'bg-primary-600' : 'bg-primary-100 dark:bg-ink-700'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                prefs.showLatin ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
        </Row>

        <Row label="Tampilkan terjemahan">
          <button
            type="button"
            role="switch"
            aria-checked={prefs.showTranslation}
            onClick={() => setPrefs({ showTranslation: !prefs.showTranslation })}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              prefs.showTranslation ? 'bg-primary-600' : 'bg-primary-100 dark:bg-ink-700'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                prefs.showTranslation ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
        </Row>
      </section>

      {/* Tipografi */}
      <section className="space-y-2.5">
        <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-ink-400">Ukuran teks</h2>

        <div className="surface rounded-2xl p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-sm font-medium text-ink-800 dark:text-primary-50">Teks Arab</p>
            <span className="text-xs tabular-nums text-ink-400">{Math.round(prefs.arabicScale * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.8}
            max={1.8}
            step={0.05}
            value={prefs.arabicScale}
            onChange={(e) => setPrefs({ arabicScale: Number(e.target.value) })}
            aria-label="Ukuran teks Arab"
            className="w-full accent-primary-600"
          />
          <p dir="rtl" lang="ar" style={{ fontSize: `${1.4 * prefs.arabicScale}rem` }} className="font-arabic mt-3 text-right text-ink-800 dark:text-primary-100">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </div>

        <div className="surface rounded-2xl p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-sm font-medium text-ink-800 dark:text-primary-50">Teks terjemahan</p>
            <span className="text-xs tabular-nums text-ink-400">{Math.round(prefs.translationScale * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.8}
            max={1.5}
            step={0.05}
            value={prefs.translationScale}
            onChange={(e) => setPrefs({ translationScale: Number(e.target.value) })}
            aria-label="Ukuran teks terjemahan"
            className="w-full accent-primary-600"
          />
        </div>
      </section>

      {/* Audio */}
      <section className="space-y-2.5">
        <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-ink-400">Murottal</h2>
        <Row label="Qari" hint="Digunakan untuk audio per ayat & per surah">
          <select
            value={prefs.reciter}
            onChange={(e) => setPrefs({ reciter: e.target.value })}
            aria-label="Pilihan qari"
            className="max-w-[190px] rounded-lg border border-primary-100 bg-white px-2.5 py-2 text-sm text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-primary-100"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </Row>
      </section>

      {/* Data lokal */}
      <section className="space-y-2.5">
        <h2 className="px-1 text-xs font-bold uppercase tracking-wider text-ink-400">Data lokal</h2>
        <Row label="Riwayat bacaan" hint={`${localStore.history().length} entri tersimpan`}>
          <button
            type="button"
            onClick={() => {
              if (confirm('Hapus semua riwayat bacaan?')) localStore.clearHistory()
            }}
            className="flex items-center gap-1.5 rounded-lg border border-primary-100 px-3 py-2 text-xs font-medium text-ink-500 transition-colors hover:border-red-200 hover:text-red-600 dark:border-ink-700 dark:text-ink-400"
          >
            <Trash className="h-3.5 w-3.5" /> Hapus
          </button>
        </Row>
        <div className="rounded-2xl border border-primary-100/70 bg-primary-50/50 p-4 text-xs leading-relaxed text-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-400">
          <p className="flex items-center gap-1.5 font-semibold text-ink-700 dark:text-primary-200">
            <Text className="h-3.5 w-3.5" /> Privasi
          </p>
          <p className="mt-1">
            Bookmark, riwayat, dan preferensi hanya tersimpan di browser perangkat ini (localStorage). Tidak ada data yang
            dikirim ke server aplikasi. Sumber data: Kementerian Agama RI via EQuran.id; audio murottal dari CDN EQuran.id.
          </p>
        </div>
      </section>
    </div>
  )
}
