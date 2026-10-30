import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quranApi } from '@/services/api/quranProvider'
import { localStore } from '@/services/localStore'
import { useAsyncData } from '@/hooks/useData'
import { AyahCard, SurahAudioControls } from '@/components/quran/AyahCard'
import { AyahSkeletonList, ErrorPanel, EmptyState } from '@/components/common/States'
import { ChevronLeft, ChevronRight, Text, Close } from '@/components/icons'
import type { TafsirSurah } from '@/services/types'

export default function SurahDetailPage() {
  const { nomor } = useParams<{ nomor: string }>()
  const surahNumber = Number(nomor)
  const isValid = Number.isInteger(surahNumber) && surahNumber >= 1 && surahNumber <= 114

  const { data: surah, loading, error, retry } = useAsyncData(
    (signal) => quranApi.getSurah(surahNumber, signal),
    [surahNumber],
    { enabled: isValid },
  )

  const [tafsirAyat, setTafsirAyat] = useState<number | null>(null)
  const { data: tafsir, loading: tafsirLoading } = useAsyncData<TafsirSurah>(
    (signal) => quranApi.getTafsir(surahNumber, signal),
    [surahNumber],
    { enabled: isValid && tafsirAyat !== null },
  )

  // Catat riwayat bacaan saat surah dibuka
  useEffect(() => {
    if (surah) {
      localStore.recordReading(surah.number, surah.latinName, 1)
    }
  }, [surah])

  // Lompat ke anchor ayat (dari beranda "lanjutkan")
  useEffect(() => {
    if (surah && window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1))
      el?.scrollIntoView({ block: 'start' })
    }
  }, [surah])

  const activeTafsir = useMemo(() => {
    if (tafsirAyat === null || !tafsir) return null
    return tafsir.entries.find((e) => e.ayat === tafsirAyat) ?? null
  }, [tafsir, tafsirAyat])

  if (!isValid) {
    return (
      <EmptyState
        icon={<Text className="h-6 w-6" />}
        title="Surah tidak ditemukan"
        description={`Nomor surah "${nomor}" tidak valid. Pilih antara 1–114.`}
        action={
          <Link to="/surah" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500">
            Lihat daftar surah
          </Link>
        }
      />
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorPanel message={error} onRetry={retry} />
        <Link to="/surah" className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
          <ChevronLeft className="h-4 w-4" /> Kembali ke daftar surah
        </Link>
      </div>
    )
  }

  if (loading || !surah) {
    return (
      <div className="space-y-5">
        <div className="surface animate-pulse rounded-3xl p-6">
          <div className="h-6 w-40 rounded bg-primary-100/60 dark:bg-ink-800" />
          <div className="mt-3 h-4 w-64 rounded bg-primary-50 dark:bg-ink-800/70" />
        </div>
        <AyahSkeletonList />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header surah */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-teal-800 p-6 text-center sm:p-8">
        <div className="absolute -right-10 -top-10 opacity-[0.06]">
          <svg viewBox="0 0 200 200" className="h-52 w-52" fill="none" stroke="white" strokeWidth="3" aria-hidden="true">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="55" />
          </svg>
        </div>
        <div className="relative">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85">
            Surah ke-{surah.number} · {surah.revelationPlace} · {surah.totalAyah} ayat
          </div>
          <h1 dir="rtl" lang="ar" className="font-arabic text-3xl font-bold text-white sm:text-4xl">
            {surah.arabicName}
          </h1>
          <p className="mt-1 text-lg font-semibold text-white/95">{surah.latinName}</p>
          <p className="mt-0.5 text-xs text-primary-100/80">“{surah.translationName}”</p>
          <div className="gold-line mx-auto mt-4 w-40" />
        </div>
      </header>

      {/* Navigasi prev/next + audio */}
      <div className="flex items-center gap-2">
        {surah.prev ? (
          <Link
            to={`/surah/${surah.prev.number}`}
            className="surface flex min-w-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-ink-500 transition-colors hover:border-primary-300 hover:text-primary-700 dark:text-ink-400 dark:hover:text-primary-300"
          >
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{surah.prev.latinName}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {surah.next && (
          <Link
            to={`/surah/${surah.next.number}`}
            className="surface ml-auto flex min-w-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-ink-500 transition-colors hover:border-primary-300 hover:text-primary-700 dark:text-ink-400 dark:hover:text-primary-300"
          >
            <span className="truncate">{surah.next.latinName}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
        )}
      </div>

      <SurahAudioControls surah={surah} />

      {/* Ayat */}
      <div className="space-y-4">
        {surah.ayat.map((ayah) => (
          <AyahCard
            key={ayah.numberInSurah}
            ayah={ayah}
            surah={surah}
            showTafsir
            onOpenTafsir={(ayat) => setTafsirAyat(ayat)}
          />
        ))}
      </div>

      {/* Panel tafsir */}
      {tafsirAyat !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Tafsir ayat ${tafsirAyat}`}
          onClick={() => setTafsirAyat(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl float-in sm:rounded-3xl dark:bg-ink-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky -top-5 -mx-5 mb-4 flex items-center justify-between border-b border-primary-100 bg-white px-5 pb-3 pt-5 dark:border-ink-700 dark:bg-ink-900">
              <p className="text-sm font-bold text-ink-900 dark:text-primary-50">
                Tafsir · {surah.latinName} : {tafsirAyat}
              </p>
              <button
                type="button"
                onClick={() => setTafsirAyat(null)}
                aria-label="Tutup tafsir"
                className="rounded-full p-1.5 text-ink-400 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-ink-800"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            {tafsirLoading ? (
              <div className="space-y-2 py-4">
                <div className="h-3 animate-pulse rounded bg-primary-100/60 dark:bg-ink-800" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-primary-100/60 dark:bg-ink-800" />
                <div className="h-3 w-10/12 animate-pulse rounded bg-primary-100/60 dark:bg-ink-800" />
              </div>
            ) : activeTafsir ? (
              <>
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700 dark:text-primary-100/85">{activeTafsir.text}</p>
                <p className="mt-5 border-t border-primary-100 pt-3 text-[11px] text-ink-400 dark:border-ink-700">
                  Sumber tafsir: Kementerian Agama RI (via EQuran.id). Tidak diubah atau diringkas.
                </p>
              </>
            ) : (
              <p className="py-4 text-sm text-ink-400">Tafsir untuk ayat ini tidak tersedia pada sumber.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
