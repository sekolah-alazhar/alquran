import { Link } from 'react-router-dom'
import { quranApi } from '@/services/api/quranProvider'
import { localStore } from '@/services/localStore'
import { useAsyncData, useLocalVersion } from '@/hooks/useData'
import { SurahCard } from '@/components/quran/SurahCard'
import { ErrorPanel, SurahSkeletonList } from '@/components/common/States'
import { BookOpen, Bookmark, Search, ChevronRight, Play } from '@/components/icons'
import { useAudio } from '@/app/providers/AppProviders'

export default function HomePage() {
  useLocalVersion()
  const lastRead = localStore.lastRead()
  const bookmarkCount = localStore.bookmarks().length
  const { data, loading, error, retry } = useAsyncData((signal) => quranApi.getSurahList(signal), [])
  const surahs = data ?? []

  const popular = [1, 2, 18, 36, 55, 67, 112, 113, 114]
    .map((n) => surahs.find((s) => s.number === n))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  const gotoSurah = (n: number) => `/surah/${n}#ayat-${lastRead?.surahNumber === n ? lastRead.ayat : 1}`

  return (
    <div className="space-y-8">
      {/* Sapaan */}
      <section className="relative overflow-hidden rounded-3xl border border-primary-100 dark:border-ink-700">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-teal-800" />
        <div className="absolute -right-8 -top-10 opacity-[0.07]">
          <svg viewBox="0 0 200 200" className="h-56 w-56" fill="none" stroke="white" strokeWidth="3" aria-hidden="true">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="60" />
            <path d="M100 20v160M20 100h160" />
          </svg>
        </div>
        <div className="relative p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-200">Assalamu'alaikum</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">Selamat membaca Al-Qur'an</h1>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-primary-100/85">
            Teks Kemenag RI, terjemahan resmi, tafsir, dan murottal 6 qari — dalam satu aplikasi yang ringan.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to={lastRead ? gotoSurah(lastRead.surahNumber) : '/surah/1'}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-800 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <BookOpen className="h-4 w-4" /> {lastRead ? 'Lanjutkan bacaan' : 'Mulai membaca'}
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <Search className="h-4 w-4" /> Cari ayat
            </Link>
          </div>
        </div>
      </section>

      {/* Lanjutkan membaca */}
      {lastRead && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-400">Lanjutkan membaca</h2>
          <Link
            to={gotoSurah(lastRead.surahNumber)}
            className="surface group flex items-center gap-4 rounded-2xl p-4 transition-all hover:border-primary-300"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/25">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-ink-900 dark:text-primary-50">{lastRead.surahLatin}</span>
              <span className="mt-0.5 block text-xs text-ink-400">Ayat {lastRead.ayat}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      )}

      {/* Akses cepat */}
      <section className="grid grid-cols-3 gap-3">
        <Link to="/surah" className="surface flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors hover:border-primary-300">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600 dark:bg-ink-800 dark:text-primary-400">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="text-xs font-semibold text-ink-700 dark:text-primary-100">114 Surah</span>
        </Link>
        <Link to="/bookmark" className="surface flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors hover:border-primary-300">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600 dark:bg-ink-800 dark:text-primary-400">
            <Bookmark className="h-5 w-5" />
          </span>
          <span className="text-xs font-semibold text-ink-700 dark:text-primary-100">Bookmark{bookmarkCount > 0 ? ` (${bookmarkCount})` : ''}</span>
        </Link>
        <Link to="/history" className="surface flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors hover:border-primary-300">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-600 dark:bg-ink-800 dark:text-primary-400">
            <Play className="h-5 w-5" />
          </span>
          <span className="text-xs font-semibold text-ink-700 dark:text-primary-100">Riwayat</span>
        </Link>
      </section>

      {/* Surah populer */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-400">Sering dibaca</h2>
          <Link to="/surah" className="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Lihat semua 114 →
          </Link>
        </div>
        {error ? (
          <ErrorPanel message={error} onRetry={retry} />
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="surface animate-pulse rounded-2xl p-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 rounded-xl bg-primary-100/60 dark:bg-ink-800" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 rounded bg-primary-100/60 dark:bg-ink-800" />
                        <div className="h-3 w-1/2 rounded bg-primary-50 dark:bg-ink-800/70" />
                      </div>
                    </div>
                  </div>
                ))
              : popular.map((surah) => <SurahCard key={surah.number} surah={surah} />)}
          </div>
        )}
      </section>

      <p className="pb-2 text-center text-[11px] leading-relaxed text-ink-400/70">
        Sumber teks, terjemahan, tafsir & audio: Kementerian Agama RI via EQuran.id.
      </p>
    </div>
  )
}
