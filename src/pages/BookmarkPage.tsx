import { Link } from 'react-router-dom'
import { localStore } from '@/services/localStore'
import { useLocalVersion } from '@/hooks/useData'
import { EmptyState, PageHeader } from '@/components/common/States'
import { Bookmark, Trash } from '@/components/icons'

export default function BookmarkPage() {
  useLocalVersion()
  const bookmarks = localStore.bookmarks()

  return (
    <div className="space-y-5">
      <PageHeader title="Bookmark" subtitle="Ayat yang Anda tandai — tersimpan di perangkat ini" />

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-6 w-6" />}
          title="Belum ada ayat yang ditandai"
          description="Buka surah, lalu tekan ikon bookmark pada ayat yang ingin Anda simpan."
          action={
            <Link to="/surah" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500">
              Mulai membaca
            </Link>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {bookmarks.map((b) => (
            <div
              key={`${b.surahNumber}-${b.ayat}`}
              className="surface group flex items-start gap-3.5 rounded-2xl p-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-xs font-bold text-primary-700 dark:bg-ink-800 dark:text-primary-300">
                {b.surahNumber}:{b.ayat}
              </span>
              <Link to={`/surah/${b.surahNumber}#ayat-${b.ayat}`} className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-900 dark:text-primary-50">
                  {b.surahLatin} · ayat {b.ayat}
                </p>
                <p dir="rtl" lang="ar" className="font-arabic mt-1.5 text-right text-base leading-loose text-ink-800 dark:text-primary-100/90">
                  {b.arabicText.length > 120 ? b.arabicText.slice(0, 120) + '…' : b.arabicText}
                </p>
                {b.translationText && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-400">
                    {b.translationText}
                  </p>
                )}
              </Link>
              <button
                type="button"
                onClick={() => localStore.removeBookmark(b.surahNumber, b.ayat)}
                aria-label={`Hapus bookmark ${b.surahLatin} ayat ${b.ayat}`}
                className="shrink-0 rounded-lg p-2 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
