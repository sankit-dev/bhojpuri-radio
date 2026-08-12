import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  PlusCircle,
  Loader2,
  Tv,
} from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { formatAudioTime } from '../utils/time'
import { AudioVisualizer } from './AudioVisualizer'

function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName.toLowerCase()
  return tagName === 'input' || tagName === 'textarea' || target.isContentEditable
}

export function MusicPlayer() {
  const {
    playlist,
    songIndex,
    currentSong,
    isPlaying,
    status,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    loopMode,
    error,
    hasUserInteracted,
    play,
    togglePlayback,
    nextSong,
    prevSong,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleLoop,
    setIsDrawerOpen,
    setIsCustomModalOpen,
    backgroundMode,
    setBackgroundMode,
  } = usePlayer()

  const [isVolumeHovered, setIsVolumeHovered] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [seekTime, setSeekTime] = useState(0)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableElement(event.target)) {
        return
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault()
          togglePlayback()
          break
        case 'ArrowRight':
          if (event.shiftKey) {
            seek(Math.min(duration, currentTime + 10))
          } else {
            nextSong()
          }
          break
        case 'ArrowLeft':
          if (event.shiftKey) {
            seek(Math.max(0, currentTime - 10))
          } else {
            prevSong()
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          setVolume(Math.min(100, volume + 10))
          break
        case 'ArrowDown':
          event.preventDefault()
          setVolume(Math.max(0, volume - 10))
          break
        case 'KeyM':
          toggleMute()
          break
        case 'KeyS':
          toggleShuffle()
          break
        case 'KeyL':
          toggleLoop()
          break
        case 'KeyP':
          setIsDrawerOpen(true)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    togglePlayback,
    nextSong,
    prevSong,
    seek,
    currentTime,
    duration,
    volume,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleLoop,
    setIsDrawerOpen,
  ])

  // Scrubbing calculation
  const handleSeekPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!progressBarRef.current || !duration) return

      const rect = progressBarRef.current.getBoundingClientRect()
      const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
      const targetSec = ratio * duration
      setSeekTime(targetSec)
      seek(targetSec)
    },
    [duration, seek]
  )

  const activeTime = isSeeking ? seekTime : currentTime
  const progressPercent = duration > 0 ? (activeTime / duration) * 100 : 0
  const isBuffering = status === 'buffering'

  return (
    <section className="fixed inset-x-0 bottom-4 z-30 mx-auto w-[calc(100vw-20px)] max-w-[540px] translate-y-3 opacity-0 [animation:player-rise_800ms_ease_260ms_forwards] sm:bottom-8 sm:w-[min(540px,calc(100vw-36px))]">
      {/* Error alert if video is blocked/restricted */}
      {error && (
        <div className="mb-2 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-950/80 px-3.5 py-2 text-xs text-rose-200 backdrop-blur-lg shadow-lg">
          <span>{error}</span>
          <button
            onClick={nextSong}
            className="ml-2 font-semibold underline underline-offset-2 hover:text-white"
          >
            Skip Now
          </button>
        </div>
      )}

      {/* Main Glassmorphic Player Card */}
      <div
        className="relative overflow-visible rounded-3xl border border-white/20 bg-[rgba(130,50,40,0.78)] px-3.5 py-3 text-white shadow-[0_20px_60px_rgba(20,8,4,0.55)] backdrop-blur-[32px] backdrop-saturate-150 transition duration-300 hover:shadow-[0_24px_75px_rgba(20,8,4,0.65)] sm:px-4 sm:py-3.5"
        style={{
          background:
            'linear-gradient(135deg, rgba(160, 60, 48, 0.82) 0%, rgba(100, 38, 30, 0.86) 100%)',
        }}
      >
        <div className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[68px_minmax(0,1fr)_auto] sm:gap-4">
          {/* Album Cover / Spinning Vinyl Disc */}
          <div className="relative group cursor-pointer" onClick={() => setIsDrawerOpen(true)}>
            <div className="relative h-14 w-14 sm:h-[68px] sm:w-[68px] rounded-full p-[2px] bg-gradient-to-tr from-amber-500/40 via-white/30 to-amber-300/40 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <img
                className={`h-full w-full rounded-full border border-white/20 object-cover ${
                  isPlaying && !isBuffering
                    ? 'animate-[record-spin_20s_linear_infinite]'
                    : 'rotate-0 transition-transform duration-500'
                }`}
                src={currentSong.cover}
                alt={currentSong.title}
              />
              {/* Vinyl center pin */}
              <div className="absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/50 bg-stone-900 shadow-inner" />
            </div>

            {/* Visualizer pill on playing */}
            {isPlaying && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-stone-950/80 px-1.5 py-0.5 border border-white/15 backdrop-blur-sm">
                <AudioVisualizer isPlaying={isPlaying} barCount={3} />
              </div>
            )}
          </div>

          {/* Song Info & Interactive Progress Bar */}
          <div className="min-w-0 pr-1">
            <div className="flex min-w-0 items-baseline gap-2">
              <h1 className="truncate text-[13px] font-bold leading-5 tracking-tight sm:text-[15px] text-white">
                {currentSong.title}
              </h1>
              {currentSong.year ? (
                <span className="hidden text-[11px] font-medium text-amber-200/60 sm:inline">
                  {currentSong.year}
                </span>
              ) : null}
            </div>

            <p className="mt-0.5 truncate text-[11px] font-medium text-white/75 sm:text-[12px]">
              {currentSong.artist}
            </p>

            {/* Scrubbable Seek Timeline */}
            <div className="mt-2.5 space-y-1">
              <div
                ref={progressBarRef}
                className="group relative h-4 cursor-pointer touch-none flex items-center"
                onPointerDown={(e) => {
                  setIsSeeking(true)
                  handleSeekPointer(e)
                }}
                onPointerMove={(e) => {
                  if (isSeeking) handleSeekPointer(e)
                }}
                onPointerUp={() => setIsSeeking(false)}
                role="slider"
                aria-label="Seek track position"
                aria-valuemin={0}
                aria-valuemax={Math.floor(duration || 0)}
                aria-valuenow={Math.floor(activeTime || 0)}
                tabIndex={0}
              >
                {/* Background track */}
                <div className="h-[3.5px] w-full rounded-full bg-white/20 group-hover:h-[5px] transition-all">
                  {/* Active filled track */}
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-white relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    {/* Scrub head handle */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-3 w-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>

              {/* Timestamp display & Song Index */}
              <div className="flex items-center justify-between text-[10px] tabular-nums text-white/60">
                <span>{formatAudioTime(activeTime)}</span>
                <span className="text-amber-200/50">
                  {songIndex + 1} / {playlist.length}
                </span>
                <span>{duration > 0 ? formatAudioTime(duration) : '--:--'}</span>
              </div>
            </div>
          </div>

          {/* Main Controls & Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 justify-end">
            {/* Previous */}
            <button
              className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition duration-150 hover:scale-110 hover:bg-white/10 hover:text-white focus:outline-none cursor-pointer"
              type="button"
              aria-label="Previous song"
              onClick={prevSong}
            >
              <SkipBack className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Play / Pause / Buffering */}
            <button
              className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-full bg-white text-stone-950 shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition duration-200 hover:scale-105 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlayback}
            >
              {isBuffering ? (
                <Loader2 className="h-5 w-5 animate-spin text-stone-900" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" fill="currentColor" aria-hidden="true" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true" />
              )}
            </button>

            {/* Next */}
            <button
              className="grid h-8 w-8 place-items-center rounded-full text-white/80 transition duration-150 hover:scale-110 hover:bg-white/10 hover:text-white focus:outline-none cursor-pointer"
              type="button"
              aria-label="Next song"
              onClick={nextSong}
            >
              <SkipForward className="h-4 w-4" aria-hidden="true" />
            </button>

            {/* Volume Control with Popover */}
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setIsVolumeHovered(true)}
              onMouseLeave={() => setIsVolumeHovered(false)}
            >
              <button
                className="grid h-8 w-8 place-items-center rounded-full text-white/75 transition hover:scale-110 hover:bg-white/10 hover:text-white cursor-pointer"
                type="button"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-rose-300" />
                ) : volume < 50 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              {/* Volume Slider Popover */}
              {isVolumeHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex items-center gap-2 rounded-2xl border border-white/20 bg-stone-900/95 px-3 py-2 shadow-2xl backdrop-blur-xl animate-[fade-in_150ms_ease]">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="h-1.5 w-20 cursor-pointer accent-amber-400"
                    aria-label="Volume level"
                  />
                  <span className="text-[10px] tabular-nums font-semibold text-white/80 w-6">
                    {isMuted ? '0%' : `${volume}%`}
                  </span>
                </div>
              )}
            </div>

            {/* Playlist Drawer Trigger */}
            <button
              className="grid h-8 w-8 place-items-center rounded-full text-white/75 transition hover:scale-110 hover:bg-white/10 hover:text-amber-300 cursor-pointer"
              type="button"
              aria-label="Open playlist queue"
              title="Playlist Queue (P)"
              onClick={() => setIsDrawerOpen(true)}
            >
              <ListMusic className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom Secondary Controls Bar */}
        <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2 text-[11px] text-white/70">
          <div className="flex items-center gap-3">
            {/* Shuffle */}
            <button
              type="button"
              onClick={toggleShuffle}
              className={`flex items-center gap-1 transition cursor-pointer hover:text-white ${
                isShuffle ? 'text-amber-300 font-semibold' : 'text-white/50'
              }`}
              title="Toggle Shuffle (S)"
            >
              <Shuffle className="h-3 w-3" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>

            {/* Repeat / Loop */}
            <button
              type="button"
              onClick={toggleLoop}
              className={`flex items-center gap-1 transition cursor-pointer hover:text-white ${
                loopMode !== 'off' ? 'text-amber-300 font-semibold' : 'text-white/50'
              }`}
              title={`Loop Mode: ${loopMode} (L)`}
            >
              {loopMode === 'one' ? (
                <Repeat1 className="h-3 w-3" />
              ) : (
                <Repeat className="h-3 w-3" />
              )}
              <span className="hidden sm:inline">
                {loopMode === 'one' ? 'Repeat 1' : loopMode === 'all' ? 'Loop All' : 'Loop Off'}
              </span>
            </button>

            {/* Video Background Toggle */}
            <button
              type="button"
              onClick={() =>
                setBackgroundMode(
                  backgroundMode === 'video' ? 'art' : backgroundMode === 'art' ? 'hybrid' : 'video'
                )
              }
              className={`hidden sm:flex items-center gap-1 transition cursor-pointer hover:text-white ${
                backgroundMode === 'video'
                  ? 'text-amber-300 font-semibold'
                  : 'text-white/60'
              }`}
              title="Toggle Video Background Mode (V)"
            >
              <Tv className="h-3 w-3" />
              <span>
                {backgroundMode === 'video'
                  ? 'Video BG'
                  : backgroundMode === 'hybrid'
                    ? 'Hybrid BG'
                    : 'Poster BG'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Add Custom YouTube Video button */}
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="flex items-center gap-1 text-amber-300/80 hover:text-amber-200 transition cursor-pointer"
              title="Add YouTube Song / Link"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="text-[10px] sm:text-[11px] font-medium">Add YouTube Song</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating First-Time Tune-In Prompt if not yet interacted */}
      {!hasUserInteracted && (
        <div
          onClick={play}
          className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-amber-400/30 bg-black/60 px-4 py-2 text-xs font-medium text-amber-200 shadow-xl backdrop-blur-md transition hover:bg-black/75 hover:border-amber-400/60"
        >
          <Play className="h-3.5 w-3.5 text-amber-400 animate-pulse" fill="currentColor" />
          <span>Click anywhere to tune in & start Bhojpuri Radio stream</span>
        </div>
      )}
    </section>
  )
}
