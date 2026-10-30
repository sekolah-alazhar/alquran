import { Link } from 'react-router-dom'
import { Alert } from '@/components/icons'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-400 dark:bg-ink-800">
          <Alert className="h-6 w-6" />
        </span>
        <p className="text-5xl font-black tracking-tight text-primary-200 dark:text-ink-700">404</p>
        <h1 className="mt-2 text-xl font-bold text-ink-900 dark:text-primary-50">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-ink-400">
          Tautan mungkin salah, atau halaman sudah dipindahkan.
        </p>
        <div className="mt-6 flex justify-center gap-2.5">
          <Link to="/" className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-500">
            Beranda
          </Link>
          <Link to="/surah" className="rounded-full border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50 dark:border-ink-700 dark:text-primary-300 dark:hover:bg-ink-800">
            Daftar surah
          </Link>
        </div>
      </div>
    </div>
  )
}
