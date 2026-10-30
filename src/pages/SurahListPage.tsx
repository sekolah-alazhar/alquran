import { useMemo, useState } from 'react'
import { quranApi } from '@/services/api/quranProvider'
import { useAsyncData, useDebounced } from '@/hooks/useData'
import { SurahCard } from '@/components/quran/SurahCard'
import { ErrorPanel, SurahSkeletonList, PageHeader, EmptyState } from '@/components/common/States'
import { Search, Close } from '@/components/icons'

export default function SurahListPage() {
  const [term, setTerm] = useState('')
  const debounced = useDebounced(term, 200)
  const { data, loading, error, retry } = useAsyncData((signal) => quranApi.getSurahList(signal), [])
  const surahs = data ?? []

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return surahs
    return surahs.filter(
      (s) =>
        s.latinName.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        s.translationName?.toLowerCase().includes(q) ||
        String(s.number) === q,
    )
  }, [surahs, debounced])

  return (
    <div className="space-y-5">
      <PageHeader title="Daftar Surah" subtitle="114 surah, urutan mushaf" />

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Cari nama atau nomor surah…"
          aria-label="Cari surah"
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

      {error && <ErrorPanel message={error} onRetry={retry} />}

      {loading ? (
        <SurahSkeletonList />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="Surah tidak ditemukan"
          description={`Tidak ada surah yang cocok dengan "${debounced}".`}
        />
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {filtered.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      )}
    </div>
  )
}
