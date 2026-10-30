import type { Ayah, ReciterId, Surah, SurahDetail, TafsirSurah } from '../types'
import { RECITERS } from '../types'

/**
 * Provider adapter: EQuran.id API v2
 * Sumber data: Kementerian Agama RI (via equran.id). Tanpa API key.
 * Dokumentasi: https://equran.id/apidev/v2
 */

const BASE = 'https://equran.id/api/v2'

const reciterById = new Map(RECITERS.map((r) => [r.id, r]))

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { signal })
  if (!res.ok) {
    throw new Error(res.status === 404 ? 'Data tidak ditemukan' : `Layanan data sedang bermasalah (${res.status})`)
  }
  const json = (await res.json()) as { code: number; message?: string; data: T }
  if (json.code !== 200) {
    throw new Error(json.message || 'Respons layanan data tidak valid')
  }
  return json.data
}

// ---- Raw shapes (API equran.id) ----
interface RawSurah {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
  tempatTurun: string
  arti: string
  deskripsi: string
}

interface RawAyah {
  nomorAyat: number
  teksArab: string
  teksLatin: string
  teksIndonesia: string
  audio: Record<string, string>
}

interface RawSurahDetail extends RawSurah {
  audioFull: Record<string, string>
  ayat: RawAyah[]
  suratSelanjutnya: false | { nomor: number; namaLatin: string }
  suratSebelumnya: false | { nomor: number; namaLatin: string }
}

interface RawTafsirAyat {
  ayat: number
  teks: string
}

function mapSurah(raw: RawSurah): Surah {
  return {
    number: raw.nomor,
    arabicName: raw.nama,
    latinName: raw.namaLatin,
    translationName: raw.arti,
    totalAyah: raw.jumlahAyat,
    revelationPlace: raw.tempatTurun,
    description: raw.deskripsi,
  }
}

/**
 * Audio diputar lewat proxy same-origin `/audio/...` (nginx -> cdn.equran.id).
 * Alasan: CSP `media-src 'self'` + menghindari pemeriksaan referer/CORS CDN.
 */
function localizeAudioUrl(url: string): string {
  const marker = 'https://cdn.equran.id/'
  return url.startsWith(marker) ? `/audio/${url.slice(marker.length)}` : url
}

function mapAyat(raw: RawAyah, surahNumber: number): Ayah {
  const audioUrls: Partial<Record<ReciterId, string>> = {}
  for (const [code, url] of Object.entries(raw.audio ?? {})) {
    const reciter = reciterById.get(code as ReciterId)
    if (reciter) audioUrls[reciter.id] = localizeAudioUrl(url)
  }
  return {
    surahNumber,
    numberInSurah: raw.nomorAyat,
    arabicText: raw.teksArab,
    latinText: raw.teksLatin || undefined,
    translationText: raw.teksIndonesia || undefined,
    audioUrls,
  }
}

function mapAudioFull(raw: Record<string, string>): Partial<Record<ReciterId, string>> {
  const out: Partial<Record<ReciterId, string>> = {}
  for (const [code, url] of Object.entries(raw ?? {})) {
    const reciter = reciterById.get(code as ReciterId)
    if (reciter) out[reciter.id] = localizeAudioUrl(url)
  }
  return out
}

/* ---------------- in-memory cache (PRD §8) ---------------- */
const surahListCache: (Surah[] | null)[] = [null]
const surahDetailCache = new Map<number, SurahDetail>()
const tafsirCache = new Map<number, TafsirSurah>()

export const quranApi = {
  async getSurahList(signal?: AbortSignal): Promise<Surah[]> {
    if (surahListCache[0]) return surahListCache[0]
    const raw = await request<RawSurah[]>('/surat', signal)
    const list = raw.map(mapSurah)
    surahListCache[0] = list
    return list
  },

  async getSurah(number: number, signal?: AbortSignal): Promise<SurahDetail> {
    const cached = surahDetailCache.get(number)
    if (cached) return cached
    const raw = await request<RawSurahDetail>(`/surat/${number}`, signal)
    const detail: SurahDetail = {
      ...mapSurah(raw),
      ayat: raw.ayat.map((a) => mapAyat(a, number)),
      audioFull: mapAudioFull(raw.audioFull),
      next: raw.suratSelanjutnya ? { number: raw.suratSelanjutnya.nomor, latinName: raw.suratSelanjutnya.namaLatin } : null,
      prev: raw.suratSebelumnya ? { number: raw.suratSebelumnya.nomor, latinName: raw.suratSebelumnya.namaLatin } : null,
    }
    surahDetailCache.set(number, detail)
    return detail
  },

  async getTafsir(number: number, signal?: AbortSignal): Promise<TafsirSurah> {
    const cached = tafsirCache.get(number)
    if (cached) return cached
    const raw = await request<{ nomor: number; namaLatin: string; tafsir: RawTafsirAyat[] }>(`/tafsir/${number}`, signal)
    const tafsir: TafsirSurah = {
      surahNumber: raw.nomor,
      latinName: raw.namaLatin,
      entries: raw.tafsir.map((t) => ({ ayat: t.ayat, text: t.teks })),
    }
    tafsirCache.set(number, tafsir)
    return tafsir
  },
}
