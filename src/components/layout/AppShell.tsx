import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAudio } from '@/app/providers/AppProviders'
import { usePrefs } from '@/app/providers/AppProviders'
import { Play, Pause, Stop, Sun, Moon, Search, Home, Book, Bookmark, Settings, Info } from '@/components/icons'

const NAV = [
  { to: '/', label: 'Beranda', icon: Home, end: true },
  { to: '/surah', label: 'Surah', icon: Book },
  { to: '/bookmark', label: 'Bookmark', icon: Bookmark },
  { to: '/settings', label: 'Pengaturan', icon: Settings },
]

const MOBILE_NAV = [
  { to: '/', label: 'Beranda', icon: Home, end: true },
  { to: '/surah', label: 'Surah', icon: Book },
  { to: '/bookmark', label: 'Bookmark', icon: Bookmark },
  { to: '/settings', label: 'Atur', icon: Settings },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Quran Digital — Beranda">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-teal-700 shadow-md shadow-primary-500/20">
        <Book className="h-[18px] w-[18px] text-white" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] font-bold tracking-tight text-primary-800 dark:text-primary-200">Quran Digital</span>
        <span className="text-[10px] font-medium text-primary-600/80 dark:text-primary-400/80">Baca · Dengar · Markah</span>
      </span>
    </Link>
  )
}

function ThemeToggle() {
  const { prefs, setPrefs } = usePrefs()
  return (
    <button
      type="button"
      onClick={() => setPrefs({ theme: prefs.theme === 'dark' ? 'light' : 'dark' })}
      aria-label={prefs.theme === 'dark' ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'}
      className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-primary-300"
    >
      {prefs.theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  )
}

/** Player strip muncul saat ada audio aktif. */
function AudioBar() {
  const audio = useAudio()
  const { surahNumber, ayat, playing, loading, error, toggle, stop, surahMode, currentAyatIndex, totalAyat } = audio
  if (surahNumber === null || ayat === null) return null

  return (
    <div className="fixed bottom-[57px] inset-x-0 z-40 border-t border-primary-100 glass lg:bottom-0 dark:border-ink-700">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-primary-800 dark:text-primary-200">
            Surah {surahNumber} · Ayat {surahMode ? `${currentAyatIndex + 1}/${totalAyat}` : ayat}
          </p>
          <p className="truncate text-[11px] text-ink-400">
            {loading ? 'Memuat audio…' : error ? error : playing ? 'Sedang diputar' : 'Dijeda'}
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Jeda audio' : 'Lanjutkan audio'}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-500"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : playing ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={stop}
          aria-label="Hentikan audio"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-400 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-ink-800 dark:hover:text-primary-300"
        >
          <Stop className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function AppShell() {
  const location = useLocation()
  const audio = useAudio()
  const hasAudio = audio.surahNumber !== null

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  const padClass = hasAudio ? 'pb-[150px] lg:pb-[92px]' : 'pb-[70px] lg:pb-8'

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary-100/70 glass dark:border-ink-700">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 lg:h-16 lg:px-6">
          <Logo />
          <div className="flex items-center gap-1">
            <Link
              to="/search"
              aria-label="Cari"
              className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-primary-300"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Desktop nav strip */}
      <nav className="hidden border-b border-primary-100/60 glass lg:block dark:border-ink-700" aria-label="Navigasi utama">
        <div className="mx-auto flex max-w-5xl items-center gap-1 px-6">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-100/70 text-primary-800 dark:bg-ink-800 dark:text-primary-300'
                    : 'text-ink-500 hover:bg-primary-50 hover:text-primary-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-primary-300'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-primary-100/70 text-primary-800 dark:bg-ink-800 dark:text-primary-300'
                  : 'text-ink-500 hover:bg-primary-50 hover:text-primary-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-primary-300'
              }`
            }
          >
            Riwayat
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `ml-auto flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-primary-100/70 text-primary-800 dark:bg-ink-800 dark:text-primary-300'
                  : 'text-ink-500 hover:bg-primary-50 hover:text-primary-700 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-primary-300'
              }`
            }
          >
            <Info className="h-4 w-4" /> Tentang
          </NavLink>
        </div>
      </nav>

      <main className={`mx-auto max-w-5xl px-4 pt-5 lg:px-6 lg:pt-7 ${padClass}`}>
        <Outlet />
      </main>

      <AudioBar />

      {/* Mobile bottom nav */}
      <nav
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-primary-100/70 glass lg:hidden dark:border-ink-700 ${
          hasAudio ? 'bottom-auto' : ''
        }`}
        style={hasAudio ? { bottom: 0 } : undefined}
        aria-label="Navigasi bawah"
      >
        <div className="grid grid-cols-5">
          {MOBILE_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-ink-400'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-ink-400'
              }`
            }
          >
            <ClockIcon />
            Riwayat
          </NavLink>
        </div>
      </nav>
    </div>
  )
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}
