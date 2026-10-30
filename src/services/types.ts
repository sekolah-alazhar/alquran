// Tipe data internal aplikasi (normalized) — sesuai PRD §7.3

export type Surah = {
  number: number
  arabicName: string
  latinName: string
  translationName?: string
  totalAyah: number
  revelationPlace?: string
  description?: string
}

export type ReciterId = '01' | '02' | '03' | '04' | '05' | '06'

export type Ayah = {
  surahNumber: number
  numberInSurah: number
  arabicText: string
  latinText?: string
  translationText?: string
  audioUrls: Partial<Record<ReciterId, string>>
}

export type SurahDetail = Surah & {
  ayat: Ayah[]
  audioFull: Partial<Record<ReciterId, string>>
  next: { number: number; latinName: string } | null
  prev: { number: number; latinName: string } | null
}

export type TafsirEntry = {
  ayat: number
  text: string
}

export type TafsirSurah = {
  surahNumber: number
  latinName: string
  entries: TafsirEntry[]
}

export const RECITERS: { id: ReciterId; name: string }[] = [
  { id: '01', name: 'Abdullah Al-Juhany' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim' },
  { id: '03', name: 'Abdurrahman as-Sudais' },
  { id: '04', name: 'Ibrahim Al-Dossari' },
  { id: '05', name: 'Misyari Rasyid Al-Afasi' },
  { id: '06', name: 'Yasin Al-Jazairi' },
]
