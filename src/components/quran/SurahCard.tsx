import { Link } from 'react-router-dom'
import type { Surah } from '@/services/types'

export function SurahCard({ surah }: { surah: Surah }) {
  return (
    <Link
      to={`/surah/${surah.number}`}
      className="surface group flex items-center gap-3.5 rounded-2xl p-3.5 transition-all hover:border-primary-300 hover:shadow-sm sm:gap-4 sm:p-4"
      aria-label={`Surah ${surah.latinName}, ${surah.totalAyah} ayat, ${surah.revelationPlace ?? ''}`}
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center">
        {/* ornamen bintang delapan */}
        <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full text-primary-100 dark:text-ink-700" aria-hidden="true">
          <path
            d="M22 2l4.3 5.1 6.5-1.7 1.7 6.5L39.6 16l-3.3 6 3.3 6-5.1 4.1-1.7 6.5-6.5-1.7L22 42l-4.3-5.1-6.5 1.7-1.7-6.5L4.4 28l3.3-6-3.3-6 5.1-4.1 1.7-6.5 6.5 1.7L22 2z"
            fill="currentColor"
          />
        </svg>
        <span className="relative text-sm font-bold text-primary-700 dark:text-primary-300">{surah.number}</span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink-900 group-hover:text-primary-700 dark:text-primary-50 dark:group-hover:text-primary-300">
          {surah.latinName}
        </span>
        <span className="mt-0.5 block truncate text-xs text-ink-400">
          {surah.translationName} · {surah.totalAyah} ayat · {surah.revelationPlace}
        </span>
      </span>

      <span dir="rtl" lang="ar" className="font-arabic shrink-0 text-lg text-primary-600 dark:text-primary-400">
        {surah.arabicName}
      </span>
    </Link>
  )
}
