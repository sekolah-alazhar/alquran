import { useAudio, usePrefs } from '@/app/providers/AppProviders'
import { localStore } from '@/services/localStore'
import { RECITERS, type Ayah, type SurahDetail } from '@/services/types'
import { useLocalVersion } from '@/hooks/useData'
import { Play, Pause, Bookmark, Copy, Text } from '@/components/icons'
import { useState } from 'react'

function AyatNumberBadge({ number, active }: { number: number; active: boolean }) {
  return (
    <span
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : 'bg-primary-50 text-primary-700 dark:bg-ink-800 dark:text-primary-300'
      }`}
      aria-label={`Ayat ${number}`}
    >
      {number}
    </span>
  )
}

function IconButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string
  onClick?: () => void
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
        active
          ? 'bg-primary-100 text-primary-700 dark:bg-ink-700 dark:text-primary-300'
          : 'text-ink-400 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-ink-800 dark:hover:text-primary-300'
      }`}
    >
      {children}
    </button>
  )
}

export function AyahCard({
  ayah,
  surah,
  showTafsir,
  onOpenTafsir,
}: {
  ayah: Ayah
  surah: SurahDetail
  showTafsir?: boolean
  onOpenTafsir?: (ayat: number) => void
}) {
  const audio = useAudio()
  const { prefs } = usePrefs()
  useLocalVersion()
  const [copied, setCopied] = useState(false)

  const bookmarked = localStore.isBookmarked(ayah.surahNumber, ayah.numberInSurah)
  const isPlayingAyat =
    audio.surahNumber === ayah.surahNumber &&
    (audio.surahMode
      ? audio.currentAyatIndex + 1 === ayah.numberInSurah
      : audio.ayat === ayah.numberInSurah)
  const isThisLoading = isPlayingAyat && audio.loading

  const audioUrl = ayah.audioUrls[prefs.reciter as keyof typeof ayah.audioUrls]

  const copy = async () => {
    const text = [
      ayah.arabicText,
      ayah.latinText ? `\n"${ayah.latinText.trim()}"` : '',
      ayah.translationText ? `\n"${ayah.translationText}"` : '',
      `\n— QS. ${surah.latinName}: ${ayah.numberInSurah} (Sumber: Kemenag RI via EQuran.id)`,
    ]
      .filter(Boolean)
      .join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard tidak tersedia */
    }
  }

  const arabicStyle = { fontSize: `${1.55 * prefs.arabicScale}rem` }

  return (
    <article
      id={`ayat-${ayah.numberInSurah}`}
      className={`surface scroll-mt-24 rounded-2xl p-4 transition-shadow sm:p-5 ${
        isPlayingAyat ? 'ring-1 ring-primary-400' : ''
      }`}
    >
      {/* toolbar */}
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AyatNumberBadge number={ayah.numberInSurah} active={isPlayingAyat} />
          {audioUrl && (
            <IconButton
              label={isPlayingAyat && audio.playing ? `Jeda audio ayat ${ayah.numberInSurah}` : `Putar audio ayat ${ayah.numberInSurah}`}
              onClick={() => {
                if (isPlayingAyat) audio.toggle()
                else audio.playAyat(ayah.surahNumber, ayah.numberInSurah, audioUrl)
              }}
            >
              {isThisLoading ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-300 border-t-primary-600" />
              ) : isPlayingAyat && audio.playing ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
            </IconButton>
          )}
          {showTafsir && (
            <IconButton label={`Tafsir ayat ${ayah.numberInSurah}`} onClick={() => onOpenTafsir?.(ayah.numberInSurah)}>
              <Text className="h-3.5 w-3.5" />
            </IconButton>
          )}
        </div>

        <div className="flex items-center gap-1">
          <IconButton label={copied ? 'Tersalin' : `Salin ayat ${ayah.numberInSurah}`} onClick={copy} active={copied}>
            <Copy className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            label={bookmarked ? `Hapus markah ayat ${ayah.numberInSurah}` : `Markah ayat ${ayah.numberInSurah}`}
            onClick={() =>
              localStore.toggleBookmark({
                surahNumber: ayah.surahNumber,
                surahLatin: surah.latinName,
                ayat: ayah.numberInSurah,
                arabicText: ayah.arabicText,
                translationText: ayah.translationText ?? '',
              })
            }
            active={bookmarked}
          >
            <Bookmark filled={bookmarked} className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>

      {/* teks Arab */}
      <p
        dir="rtl"
        lang="ar"
        style={arabicStyle}
        className="font-arabic text-right text-ink-900 dark:text-primary-50"
      >
        {ayah.arabicText}
      </p>

      {/* transliterasi */}
      {prefs.showLatin && ayah.latinText && (
        <p className="mt-3 text-[13px] italic leading-relaxed text-ink-400" style={{ fontSize: `${0.82 * prefs.translationScale}rem` }}>
          “{ayah.latinText.trim()}”
        </p>
      )}

      {/* terjemahan */}
      {prefs.showTranslation && ayah.translationText && (
        <p
          className="mt-2.5 leading-relaxed text-ink-700 dark:text-primary-100/85"
          style={{ fontSize: `${0.92 * prefs.translationScale}rem` }}
        >
          {ayah.translationText}
        </p>
      )}

      {isPlayingAyat && audio.error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{audio.error}</p>}
      {copied && <p className="mt-2 text-xs text-primary-600 dark:text-primary-400">Ayat + terjemahan tersalin beserta sumber.</p>}
    </article>
  )
}

/** Pita kontrol "putar seluruh surah" + pilihan qari. */
export function SurahAudioControls({ surah }: { surah: SurahDetail }) {
  const audio = useAudio()
  const { prefs, setPrefs } = usePrefs()
  const isThisSurah = audio.surahNumber === surah.number && audio.surahMode

  const urls = surah.ayat
    .map((a) => a.audioUrls[prefs.reciter as keyof typeof a.audioUrls])
    .filter((u): u is string => Boolean(u))

  if (urls.length === 0) return null

  const playingThis = isThisSurah && audio.playing

  return (
    <div className="surface flex flex-wrap items-center gap-2.5 rounded-2xl p-3">
      <button
        type="button"
        onClick={() => {
          if (isThisSurah) audio.toggle()
          else audio.playSurah(surah.number, urls, 0)
        }}
        className="flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-primary-500"
        aria-label={playingThis ? `Jeda murottal surah ${surah.latinName}` : `Putar murottal surah ${surah.latinName}`}
      >
        {audio.loading && isThisSurah ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : playingThis ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
        {isThisSurah ? (playingThis ? 'Jeda murottal' : 'Lanjut murottal') : 'Putar surah'}
      </button>

      <button
        type="button"
        onClick={audio.toggleRepeat}
        aria-pressed={audio.repeat}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
          audio.repeat
            ? 'border-primary-400 bg-primary-50 text-primary-700 dark:bg-ink-800 dark:text-primary-300'
            : 'border-primary-100 text-ink-400 hover:text-primary-700 dark:border-ink-700 dark:hover:text-primary-300'
        }`}
      >
        Ulangi
      </button>

      <label className="ml-auto flex items-center gap-2 text-xs text-ink-400">
        Qari
        <select
          value={prefs.reciter}
          onChange={(e) => setPrefs({ reciter: e.target.value })}
          className="max-w-[190px] truncate rounded-lg border border-primary-100 bg-white px-2 py-1.5 text-xs text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-primary-100"
          aria-label="Pilihan qari"
        >
          {RECITERS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
