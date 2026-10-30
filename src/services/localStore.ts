/**
 * Penyimpanan lokal — bookmark, riwayat, preferensi (PRD §8)
 * Validasi + fallback aman jika JSON rusak / storage tidak tersedia.
 */

export interface Bookmark {
  surahNumber: number
  surahLatin: string
  ayat: number
  arabicText: string
  translationText: string
  savedAt: number
}

export interface HistoryEntry {
  surahNumber: number
  surahLatin: string
  ayat: number
  updatedAt: number
}

export interface Preferences {
  theme: 'light' | 'dark'
  arabicScale: number // 1 = normal
  translationScale: number
  showLatin: boolean
  showTranslation: boolean
  reciter: string // ReciterId
}

const KEYS = {
  bookmarks: 'quran_bookmarks',
  history: 'quran_reading_history',
  prefs: 'quran_preferences',
  lastRead: 'quran_last_read',
} as const

export const DEFAULT_PREFS: Preferences = {
  theme: 'light',
  arabicScale: 1,
  translationScale: 1,
  showLatin: true,
  showTranslation: true,
  reciter: '01',
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage penuh / mode privat — fitur lokal non-kritis, abaikan */
  }
}

type Listener = () => void
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((l) => l())
}

export const localStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  // ---- Bookmark ----
  bookmarks(): Bookmark[] {
    const list = read<Bookmark[]>(KEYS.bookmarks, [])
    return Array.isArray(list) ? list : []
  },

  isBookmarked(surahNumber: number, ayat: number): boolean {
    return this.bookmarks().some((b) => b.surahNumber === surahNumber && b.ayat === ayat)
  },

  toggleBookmark(item: Omit<Bookmark, 'savedAt'>): boolean {
    const list = this.bookmarks()
    const exists = list.some((b) => b.surahNumber === item.surahNumber && b.ayat === item.ayat)
    const next = exists
      ? list.filter((b) => !(b.surahNumber === item.surahNumber && b.ayat === item.ayat))
      : [{ ...item, savedAt: Date.now() }, ...list]
    write(KEYS.bookmarks, next)
    emit()
    return !exists
  },

  removeBookmark(surahNumber: number, ayat: number): void {
    write(KEYS.bookmarks, this.bookmarks().filter((b) => !(b.surahNumber === surahNumber && b.ayat === ayat)))
    emit()
  },

  // ---- Riwayat / last read ----
  history(): HistoryEntry[] {
    const list = read<HistoryEntry[]>(KEYS.history, [])
    return Array.isArray(list) ? list : []
  },

  lastRead(): HistoryEntry | null {
    return this.history()[0] ?? null
  },

  recordReading(surahNumber: number, surahLatin: string, ayat: number): void {
    const entry: HistoryEntry = { surahNumber, surahLatin, ayat, updatedAt: Date.now() }
    const list = [entry, ...this.history().filter((h) => h.surahNumber !== surahNumber)].slice(0, 30)
    write(KEYS.history, list)
    write(KEYS.lastRead, entry)
    emit()
  },

  clearHistory(): void {
    write(KEYS.history, [])
    write(KEYS.lastRead, null)
    emit()
  },

  // ---- Preferensi ----
  preferences(): Preferences {
    return { ...DEFAULT_PREFS, ...read<Partial<Preferences>>(KEYS.prefs, {}) }
  },

  setPreferences(patch: Partial<Preferences>): void {
    write(KEYS.prefs, { ...this.preferences(), ...patch })
    emit()
  },
}
