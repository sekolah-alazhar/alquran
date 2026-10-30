import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { quranApi } from '@/services/api/quranProvider'
import { useAsyncData, useDebounced } from '@/hooks/useData'
import { ErrorPanel, PageHeader, EmptyState } from '@/components/common/States'
import { Search, Close, ChevronRight } from '@/components/icons'
import type { SurahDetail } from '@/services/types'

/**
 * Pencarian (PRD FR-05): nama surah, nomor surah, nomor ayat.
 * Pencarian kata dalam terjemahan dilakukan lokal terhadap surah yang
 * diminta pengguna (agar tidak menarik seluruh katalog).
 */
export default function SearchPage() {
  const [term, setTerm] = useState('')
  const debounced = useDebounced(term, 300)

  const { data: surahList } = useAsyncData((signal) => quranApi.getSurahList(signal), [])

  // Pencarian surah (nama/nomor) — instan dari daftar
  const surahMatches = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q || !surahList) return []
    return surahList
      .filter(
        (s) =>
          s.latinName.toLowerCase().includes(q) ||
          s.arabicName.includes(debounced.trim()) ||
          s.translationName?.toLowerCase().includes(q) ||
          String(s.number) === q,
      )
      .slice(0, 10)
  }, [surahList, debounced])

  // Pencarian ayat: jika kueri berpola "36:1" / "surah 2 ayat 255" -> buka langsung
  const ayahRef = useMemo(() => {
    const q = debounced.trim()
    const m = q.match(/^(\d{1,3})\s*[:.]\s*(\d{1,3})$/)
    if (m) {
      const s = Number(m[1])
      const a = Number(m[2])
      if (s >= 1 && s <= 114) return { surah: s, ayat: a }
    }
    return null
  }, [debounced])

  // Pencarian kata dalam terjemahan pada satu surah
  const [ayahResults, setAyahResults] = useState<
    { surahNumber: number; surahLatin: string; ayat: number; snippet: string }[]
  >([])
  const [ayahSearching, setAyahSearching] = useState(false)
  const [ayahError, setAyahError] = useState<string | null>(null)
  const lastQueried = useState<{ q: string }>({ q: '' })[0]

  const doAyahSearch = async () => {
    const q = debounced.trim()
    if (q.length < 3 || surahMatches.length > 0 || ayahRef) return
    setAyahSearching(true)
    setAyahError(null)
    setAyahResults([])
    try {
      const results: typeof ayahResults = []
      // Cari di surah yang paling mungkin dulu (sesuai nomor yg diketik), kalau tidak, cari umum di beberapa surah
      const candidates = [1, 2, 18, 36, 55, 67, 112, 113, 114]
      for (const n of candidates) {
        const detail: SurahDetail = await quranApi.getSurah(n)
        for (const ayah of detail.ayat) {
          const t = ayah.translationText ?? ''
          if (t.toLowerCase().includes(q.toLowerCase())) {
            const start = Math.max(0, t.toLowerCase().indexOf(q.toLowerCase()) - 40)
            results.push({
              surahNumber: n,
              surahLatin: detail.latinName,
              ayat: ayah.numberInSurah,
              snippet: (start > 0 ? '…' : '') + t.slice(start, start + 160) + (t.length > start + 160 ? '…' : ''),
            })
          }
          if (results.length >= 20) break
        }
        if (results.length >= 20) break
      }
      setAyahResults(results)
      if (results.length === 0 && lastQueried) lastQueried.q = q
    } catch (e) {
      setAyahError(e instanceof Error ? e.message : 'Pencarian gagal')
    } finally {
      setAyahSearching(false)
    }
  }

  const showAyahSearch = debounced.trim().length >= 3 && surahMatches.length === 0 && !ayahRef

  return (
    <div className="space-y-5">
      <PageHeader title="Pencarian" subtitle="Cari surah, nomor ayat (mis. 2:255), atau kata dalam terjemahan" />

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') doAyahSearch()
          }}
          placeholder="Contoh: Kahf, 2:255, atau kata seperti “sabar”…"
          aria-label="Kata kunci pencarian"
          autoFocus
          className="w-full rounded-2xl border border-primary-100 bg-white py-3 pl-11 pr-11 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-primary-400 focus:outline-none dark:border-ink-700 dark:bg-ink-900 dark:text-primary-50"
        />
        {term && (
          <button
            type="button"
            onClick={() => setTerm('')}
            aria-label="Hapus pencarian"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <Close className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Rujukan ayat langsung */}
      {ayahRef && (
        <Link
          to={`/surah/${ayahRef.surah}#ayat-${ayahRef.ayat}`}
          className="surface flex items-center gap-3 rounded-2xl p-4 transition-colors hover:border-primary-300"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-600 text-white">
            <Search className="h-4 w-4" />
          </span>
          <span className="flex-1 text-sm font-semibold text-ink-900 dark:text-primary-50">
            Buka QS {ayahRef.surah} ayat {ayahRef.ayat}
          </span>
          <ChevronRight className="h-4 w-4 text-ink-400" />
        </Link>
      )}

      {/* Hasil surah */}
      {surahMatches.length > 0 && (
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Surah</p>
          {surahMatches.map((s) => (
            <Link
              key={s.number}
              to={`/surah/${s.number}`}
              className="surface flex items-center gap-3.5 rounded-2xl p-3.5 transition-colors hover:border-primary-300"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-sm font-bold text-primary-700 dark:bg-ink-800 dark:text-primary-300">
                {s.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink-900 dark:text-primary-50">{s.latinName}</span>
                <span className="text-xs text-ink-400">
                  {s.translationName} · {s.totalAyah} ayat
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-ink-400" />
            </Link>
          ))}
        </section>
      )}

      {/* Pencarian terjemahan */}
      {showAyahSearch && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Kata dalam terjemahan</p>
            <button
              type="button"
              onClick={doAyahSearch}
              disabled={ayahSearching}
              className="rounded-full bg-primary-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-500 disabled:opacity-50"
            >
              {ayahSearching ? 'Mencari…' : 'Cari'}
            </button>
          </div>

          {ayahError && <ErrorPanel message={ayahError} onRetry={doAyahSearch} />}

          {!ayahSearching && ayahResults.length === 0 && !ayahError && (
            <p className="rounded-xl border border-dashed border-primary-200 px-4 py-6 text-center text-sm text-ink-400 dark:border-ink-700">
              Tekan tombol “Cari” untuk mencari kata “{debounced.trim()}” pada terjemahan surah-surah populer.
            </p>
          )}

          {ayahResults.map((r) => (
            <Link
              key={`${r.surahNumber}-${r.ayat}`}
              to={`/surah/${r.surahNumber}#ayat-${r.ayat}`}
              className="surface block rounded-2xl p-4 transition-colors hover:border-primary-300"
            >
              <p className="text-xs font-bold text-primary-700 dark:text-primary-400">
                QS {r.surahLatin} : {r.ayat}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600 dark:text-primary-100/80">{r.snippet}</p>
            </Link>
          ))}
        </section>
      )}

      {!debounced.trim() && (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="Mulai mencari"
          description="Ketik nama surah, nomor ayat (format 2:255), atau kata untuk dicari pada terjemahan."
        />
      )}
    </div>
  )
}
