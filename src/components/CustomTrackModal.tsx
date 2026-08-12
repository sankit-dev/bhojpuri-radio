import { useState, useMemo } from 'react'
import { X, Plus, Sparkles, Check, Video } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { extractYouTubeId, getYouTubeThumbnail } from '../utils/youtube'

const QUICK_PRESETS = [
  {
    title: 'Kamariya Bole Lollipop',
    artist: 'Pawan Singh',
    id: '525j4-5q5L4',
  },
  {
    title: 'Bagalwali Classic',
    artist: 'Manoj Tiwari',
    id: 'kYJzX3i4GzY',
  },
  {
    title: 'Thik Hai',
    artist: 'Khesari Lal Yadav',
    id: '4jJqpBGZrzI',
  },
  {
    title: 'Bhojpuri Lofi Chill Session',
    artist: 'Lofi Records',
    id: 'FOwOsVhgnXQ',
  },
]

export function CustomTrackModal() {
  const { isCustomModalOpen, setIsCustomModalOpen, addCustomTrack } = usePlayer()
  const [urlInput, setUrlInput] = useState('')
  const [titleInput, setTitleInput] = useState('')
  const [artistInput, setArtistInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const extractedId = useMemo(() => extractYouTubeId(urlInput), [urlInput])
  const previewThumbnail = useMemo(() => (extractedId ? getYouTubeThumbnail(extractedId, 'hq') : null), [extractedId])

  if (!isCustomModalOpen) return null

  const handleClose = () => {
    setIsCustomModalOpen(false)
    setUrlInput('')
    setTitleInput('')
    setArtistInput('')
    setSubmitted(false)
    setErrorMessage(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!extractedId) {
      setErrorMessage('Please enter a valid YouTube URL or Video ID (11 characters).')
      return
    }

    const success = addCustomTrack(
      extractedId,
      titleInput || `YouTube Track (${extractedId})`,
      artistInput || 'Custom Bhojpuri Feed'
    )

    if (success) {
      setSubmitted(true)
      setTimeout(() => {
        handleClose()
      }, 700)
    } else {
      setErrorMessage('Could not add track. Please verify the URL.')
    }
  }

  const handleSelectPreset = (preset: (typeof QUICK_PRESETS)[0]) => {
    setUrlInput(preset.id)
    setTitleInput(preset.title)
    setArtistInput(preset.artist)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-stone-900/95 p-6 text-white shadow-2xl backdrop-blur-2xl transition-all"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(180, 83, 9, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Play Any YouTube Music</h2>
              <p className="text-xs text-stone-400">Stream any song or live video directly on Bhojpuri Radio</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-white/10 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Popular Bhojpuri Tracks</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-stone-300 hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-200 transition"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label htmlFor="yt-url" className="block text-xs font-medium text-stone-300 mb-1">
              YouTube Video URL or ID <span className="text-amber-400">*</span>
            </label>
            <input
              id="yt-url"
              type="text"
              required
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value)
                setErrorMessage(null)
              }}
              placeholder="e.g. https://www.youtube.com/watch?v=525j4-5q5L4 or 525j4-5q5L4"
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          {/* Live Thumbnail Preview */}
          {previewThumbnail && (
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
              <img
                src={previewThumbnail}
                alt="Track Preview"
                className="h-14 w-20 rounded-lg object-cover border border-white/15 shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Video Verified
                </p>
                <p className="text-[11px] text-stone-400 truncate mt-0.5">
                  ID: <code className="text-amber-300">{extractedId}</code>
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="yt-title" className="block text-xs font-medium text-stone-300 mb-1">
                Song Title (Optional)
              </label>
              <input
                id="yt-title"
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Lollipop Lagelu"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label htmlFor="yt-artist" className="block text-xs font-medium text-stone-300 mb-1">
                Artist Name (Optional)
              </label>
              <input
                id="yt-artist"
                type="text"
                value={artistInput}
                onChange={(e) => setArtistInput(e.target.value)}
                placeholder="e.g. Pawan Singh"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 rounded-lg p-2">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-stone-300 hover:bg-white/10 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!extractedId || submitted}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 text-xs font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitted ? (
                <>
                  <Check className="h-4 w-4" />
                  Playing Now...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add & Tune In
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
