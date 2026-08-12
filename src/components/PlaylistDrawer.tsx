import { useState, useMemo } from 'react'
import {
  X,
  Search,
  Music,
  Plus,
  Radio,
  Sparkles,
  Tv,
  Image as ImageIcon,
  Sliders,
} from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { AudioVisualizer } from './AudioVisualizer'

export function PlaylistDrawer() {
  const {
    playlist,
    songIndex,
    isPlaying,
    isDrawerOpen,
    setIsDrawerOpen,
    selectSong,
    setIsCustomModalOpen,
    backgroundMode,
    setBackgroundMode,
    bgOpacity,
    setBgOpacity,
    replacePlaylist,
  } = usePlayer()

  const [searchQuery, setSearchQuery] = useState('')
  const [playlistInput, setPlaylistInput] = useState('')
  const [playlistError, setPlaylistError] = useState<string | null>(null)
  const [playlistUpdated, setPlaylistUpdated] = useState(false)

  const filteredPlaylist = useMemo(() => {
    if (!searchQuery.trim()) return playlist
    const q = searchQuery.toLowerCase()
    return playlist.filter(
      (song) =>
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        (song.genre && song.genre.toLowerCase().includes(q))
    )
  }, [playlist, searchQuery])

  if (!isDrawerOpen) return null

  const handleReplacePlaylist = (event: React.FormEvent) => {
    event.preventDefault()
    setPlaylistError(null)
    setPlaylistUpdated(false)

    const success = replacePlaylist(playlistInput)
    if (!success) {
      setPlaylistError('Paste a valid public YouTube playlist URL or playlist ID.')
      return
    }

    setSearchQuery('')
    setPlaylistInput('')
    setPlaylistUpdated(true)
    window.setTimeout(() => setPlaylistUpdated(false), 1600)
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <aside
        className="relative z-50 flex h-full w-full max-w-md flex-col border-l border-white/15 bg-stone-950/92 text-white shadow-2xl backdrop-blur-2xl transition-transform animate-[fade-in_200ms_ease]"
        style={{
          boxShadow: '-20px 0 50px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Radio className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide">Puranka Bhojpuri Station</h2>
              <p className="text-[11px] text-stone-400">
                {playlist.length} curated tracks • Radio Stream
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-white/10 hover:text-white transition"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Ambient Display Controls & Add Custom Music button */}
        <div className="border-b border-white/10 bg-white/[0.02] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-stone-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
              Background Visual:
            </span>
            <div className="flex items-center rounded-lg border border-white/15 bg-black/50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setBackgroundMode('video')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                  backgroundMode === 'video'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Tv className="h-3 w-3" />
                Video
              </button>
              <button
                type="button"
                onClick={() => setBackgroundMode('hybrid')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                  backgroundMode === 'hybrid'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-3 w-3" />
                Hybrid
              </button>
              <button
                type="button"
                onClick={() => setBackgroundMode('art')}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                  backgroundMode === 'art'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <ImageIcon className="h-3 w-3" />
                Poster
              </button>
            </div>
          </div>

          {backgroundMode !== 'art' && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-stone-400">Video Glow:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={bgOpacity}
                onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                className="h-1 flex-1 cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] tabular-nums text-stone-400">
                {Math.round(bgOpacity * 100)}%
              </span>
            </div>
          )}

          <button
            onClick={() => {
              setIsCustomModalOpen(true)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Custom YouTube Video / Song
          </button>

          <form
            onSubmit={handleReplacePlaylist}
            className="rounded-2xl border border-white/10 bg-black/30 p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[11px] font-medium text-stone-300">
                Replace Station Playlist
              </span>
              {playlistUpdated ? (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Loaded
                </span>
              ) : null}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={playlistInput}
                onChange={(event) => {
                  setPlaylistInput(event.target.value)
                  setPlaylistError(null)
                }}
                placeholder="music.youtube.com/playlist?list=..."
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-amber-400 px-3 py-2 text-xs font-bold text-stone-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!playlistInput.trim()}
              >
                Replace
              </button>
            </div>

            {playlistError ? (
              <p className="mt-2 rounded-lg border border-rose-500/25 bg-rose-950/30 px-2 py-1.5 text-[11px] text-rose-300">
                {playlistError}
              </p>
            ) : (
              <p className="mt-2 text-[10px] text-stone-500">
                Use any public YouTube or YouTube Music playlist link.
              </p>
            )}
          </form>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search Bhojpuri songs or artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Playlist Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredPlaylist.map((song) => {
            const actualIndex = playlist.findIndex((s) => s.id === song.id)
            const isCurrent = actualIndex === songIndex

            return (
              <div
                key={song.id}
                onClick={() => selectSong(actualIndex)}
                className={`group flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition duration-150 ${
                  isCurrent
                    ? 'border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-orange-500/10 shadow-lg'
                    : 'border border-transparent hover:border-white/10 hover:bg-white/5'
                }`}
              >
                {/* Thumbnail / Record */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-white/15 shadow-sm">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className={`h-full w-full object-cover transition duration-300 ${
                      isCurrent && isPlaying ? 'scale-105' : 'group-hover:scale-105'
                    }`}
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                      <AudioVisualizer isPlaying={isPlaying} barCount={3} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`truncate text-xs font-medium ${
                        isCurrent ? 'text-amber-300 font-semibold' : 'text-white'
                      }`}
                    >
                      {song.title}
                    </p>
                    {song.year && (
                      <span className="text-[10px] text-stone-400 hidden sm:inline">
                        {song.year}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-stone-400 mt-0.5">{song.artist}</p>
                  {song.genre && (
                    <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-stone-300">
                      {song.genre}
                    </span>
                  )}
                </div>

                {/* Indicator */}
                <div className="flex-shrink-0 text-right">
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-400/30">
                      <Music className="h-2.5 w-2.5" />
                      Live
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-500 opacity-0 group-hover:opacity-100 transition">
                      Play
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          {filteredPlaylist.length === 0 && (
            <div className="py-10 text-center text-stone-500 text-xs">
              No matching Bhojpuri tracks found for "{searchQuery}".
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
