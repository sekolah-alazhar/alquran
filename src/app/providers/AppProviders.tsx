import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { localStore, type Preferences } from '@/services/localStore'

/**
 * Satu audio controller global (PRD §8): tidak ada dua audio aktif bersamaan.
 * Juga menyimpan preferensi tampilan + tema.
 */

interface AudioState {
  // Identitas ayat yang sedang diputar
  surahNumber: number | null
  ayat: number | null
  playing: boolean
  loading: boolean
  error: string | null
  // Untuk mode surah penuh
  surahMode: boolean
  currentAyatIndex: number
  totalAyat: number
  position: number
  duration: number
  repeat: boolean
}

interface AudioApi extends AudioState {
  playAyat: (surahNumber: number, ayat: number, url: string) => void
  playSurah: (surahNumber: number, urls: string[], startIndex?: number) => void
  toggle: () => void
  stop: () => void
  seek: (seconds: number) => void
  toggleRepeat: () => void
}

const AudioContext = createContext<AudioApi | null>(null)

export function useAudio(): AudioApi {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio harus dipakai di dalam AppProviders')
  return ctx
}

// ---------------- Preferensi ----------------

interface PrefsApi {
  prefs: Preferences
  setPrefs: (patch: Partial<Preferences>) => void
}

const PrefsContext = createContext<PrefsApi | null>(null)

export function usePrefs(): PrefsApi {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs harus dipakai di dalam AppProviders')
  return ctx
}

export function AppProviders({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stateRef = useRef<AudioState | null>(null)
  const playlistRef = useRef<{ surahNumber: number; urls: string[]; index: number } | null>(null)

  const [prefs, setPrefsState] = useState<Preferences>(() => localStore.preferences())
  const setPrefs = useCallback((patch: Partial<Preferences>) => {
    localStore.setPreferences(patch)
    setPrefsState(localStore.preferences())
  }, [])

  const [audio, setAudio] = useState<AudioState>({
    surahNumber: null,
    ayat: null,
    playing: false,
    loading: false,
    error: null,
    surahMode: false,
    currentAyatIndex: 0,
    totalAyat: 0,
    position: 0,
    duration: 0,
    repeat: false,
  })
  stateRef.current = audio

  /* ---- tema: terapkan ke <html> ---- */
  useEffect(() => {
    const root = document.documentElement
    if (prefs.theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [prefs.theme])

  /* ---- bootstrap audio element ---- */
  useEffect(() => {
    const el = new Audio()
    el.preload = 'none' // PRD NFR-02: jangan muat audio sebelum play
    audioRef.current = el

    const onPlay = () => setAudio((s) => ({ ...s, playing: true, loading: false, error: null }))
    const onPause = () => setAudio((s) => ({ ...s, playing: false }))
    const onWaiting = () => setAudio((s) => ({ ...s, loading: true }))
    const onPlaying = () => setAudio((s) => ({ ...s, loading: false }))
    const onTime = () => setAudio((s) => ({ ...s, position: el.currentTime }))
    const onMeta = () => setAudio((s) => ({ ...s, duration: Number.isFinite(el.duration) ? el.duration : 0 }))
    const onErr = () =>
      setAudio((s) => ({
        ...s,
        playing: false,
        loading: false,
        error: 'Audio tidak dapat dimuat. Periksa koneksi atau coba qari lain.',
      }))
    const onEnded = () => {
      const playlist = playlistRef.current
      const s = stateRef.current
      if (playlist && s?.surahMode) {
        const nextIndex = playlist.index + 1
        if (nextIndex < playlist.urls.length) {
          playlist.index = nextIndex
          setAudio((p) => ({ ...p, currentAyatIndex: nextIndex, ayat: nextIndex + 1, position: 0, duration: 0, loading: true }))
          el.src = playlist.urls[nextIndex]
          void el.play().catch(() => undefined)
          return
        }
        if (s.repeat) {
          playlist.index = 0
          setAudio((p) => ({ ...p, currentAyatIndex: 0, ayat: 1, position: 0, duration: 0, loading: true }))
          el.src = playlist.urls[0]
          void el.play().catch(() => undefined)
          return
        }
      } else if (s?.repeat && !s.surahMode) {
        el.currentTime = 0
        void el.play().catch(() => undefined)
        return
      }
      setAudio((p) => ({ ...p, playing: false, position: 0 }))
    }

    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('waiting', onWaiting)
    el.addEventListener('playing', onPlaying)
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('error', onErr)
    el.addEventListener('ended', onEnded)

    return () => {
      el.pause()
      el.src = ''
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('waiting', onWaiting)
      el.removeEventListener('playing', onPlaying)
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('error', onErr)
      el.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [])

  const playAyat = useCallback((surahNumber: number, ayat: number, url: string) => {
    const el = audioRef.current
    if (!el) return
    playlistRef.current = null
    el.src = url
    setAudio((s) => ({
      ...s,
      surahNumber,
      ayat,
      surahMode: false,
      currentAyatIndex: 0,
      totalAyat: 0,
      position: 0,
      duration: 0,
      loading: true,
      error: null,
    }))
    void el.play().catch(() => {
      setAudio((s) => ({ ...s, loading: false, error: 'Pemutaran diblokir browser. Tekan tombol putar lagi.' }))
    })
  }, [])

  const playSurah = useCallback((surahNumber: number, urls: string[], startIndex = 0) => {
    const el = audioRef.current
    if (!el || urls.length === 0) return
    const safe = Math.min(Math.max(0, startIndex), urls.length - 1)
    playlistRef.current = { surahNumber, urls, index: safe }
    el.src = urls[safe]
    setAudio((s) => ({
      ...s,
      surahNumber,
      ayat: safe + 1,
      surahMode: true,
      currentAyatIndex: safe,
      totalAyat: urls.length,
      position: 0,
      duration: 0,
      loading: true,
      error: null,
    }))
    void el.play().catch(() => {
      setAudio((s) => ({ ...s, loading: false, error: 'Pemutaran diblokir browser. Tekan tombol putar lagi.' }))
    })
  }, [])

  const toggle = useCallback(() => {
    const el = audioRef.current
    if (!el || !el.src) return
    if (el.paused) void el.play().catch(() => undefined)
    else el.pause()
  }, [])

  const stop = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    el.pause()
    el.currentTime = 0
    playlistRef.current = null
    setAudio((s) => ({ ...s, playing: false, position: 0, surahNumber: null, ayat: null, surahMode: false }))
  }, [])

  const seek = useCallback((seconds: number) => {
    const el = audioRef.current
    if (!el) return
    el.currentTime = seconds
    setAudio((s) => ({ ...s, position: seconds }))
  }, [])

  const toggleRepeat = useCallback(() => {
    setAudio((s) => ({ ...s, repeat: !s.repeat }))
  }, [])

  const audioApi = useMemo<AudioApi>(
    () => ({ ...audio, playAyat, playSurah, toggle, stop, seek, toggleRepeat }),
    [audio, playAyat, playSurah, toggle, stop, seek, toggleRepeat],
  )
  const prefsApi = useMemo<PrefsApi>(() => ({ prefs, setPrefs }), [prefs, setPrefs])

  return (
    <PrefsContext.Provider value={prefsApi}>
      <AudioContext.Provider value={audioApi}>{children}</AudioContext.Provider>
    </PrefsContext.Provider>
  )
}
