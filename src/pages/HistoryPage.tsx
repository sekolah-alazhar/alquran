import { Link } from 'react-router-dom'
import { localStore } from '@/services/localStore'
import { useLocalVersion } from '@/hooks/useData'
import { EmptyState, PageHeader } from '@/components/common/States'
import { Trash, Clock } from '@/components/icons'

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoryPage() {
  useLocalVersion()
  const history = localStore.history()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <PageHeader title="Riwayat Bacaan" subtitle="Tersimpan di perangkat ini, tidak tersinkronisasi" />
        {history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm('Hapus semua riwayat bacaan?')) localStore.clearHistory()
            }}
            className="flex items-center gap-1.5 self-start rounded-lg border border-primary-100 px-3 py-2 text-xs font-medium text-ink-500 transition-colors hover:border-red-200 hover:text-red-600 dark:border-ink-700 dark:text-ink-400 dark:hover:text-red-400"
          >
            <Trash className="h-3.5 w-3.5" /> Hapus semua
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-6 w-6" />}
          title="Riwayat masih kosong"
          description="Setiap kali Anda membuka surah, posisi bacaan terakhir akan tercatat di sini."
          action={
            <Link to="/surah" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500">
              Mulai membaca
            </Link>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {history.map((h) => (
            <Link
              key={`${h.surahNumber}-${h.updatedAt}`}
              to={`/surah/${h.surahNumber}#ayat-${h.ayat}`}
              className="surface flex items-center gap-3.5 rounded-2xl p-4 transition-colors hover:border-primary-300"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-600 text-white">
                <Clock className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink-900 dark:text-primary-50">{h.surahLatin}</span>
                <span className="text-xs text-ink-400">Terakhir dibaca: ayat {h.ayat}</span>
              </span>
              <span className="shrink-0 text-[11px] text-ink-400/80">{formatTime(h.updatedAt)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
