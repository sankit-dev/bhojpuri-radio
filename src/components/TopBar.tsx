import { Radio, ListMusic, Plus, Tv, Sparkles, Image as ImageIcon } from 'lucide-react'
import { useListenerCount } from '../hooks/useListenerCount'
import { ListenerCount } from './ListenerCount'
import { LocalTime } from './LocalTime'
import { PlatformLinks } from './PlatformLinks'
import { usePlayer } from '../context/PlayerContext'

export function TopBar() {
  const listeners = useListenerCount()
  const {
    setIsDrawerOpen,
    setIsCustomModalOpen,
    backgroundMode,
    setBackgroundMode,
  } = usePlayer()

  return (
    <header className="pointer-events-none absolute left-0 top-0 z-30 grid w-full grid-cols-2 md:grid-cols-3 items-center px-4 pt-4 text-[13px] font-medium text-white opacity-0 shadow-black/30 [animation:fade-in_800ms_ease_180ms_forwards] [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] sm:px-7 sm:pt-6 sm:text-[15px]">
      {/* Left: Time & Station branding */}
      <div className="pointer-events-auto flex items-center gap-3 justify-self-start">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 backdrop-blur-md">
          <Radio className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-semibold tracking-wide text-xs sm:text-sm">Puranka Radio</span>
        </div>
        <div className="hidden sm:block text-xs text-white/70">
          <LocalTime />
        </div>
      </div>

      {/* Center: Live Listeners & Mode pill */}
      <div className="pointer-events-auto hidden md:flex items-center justify-center gap-3 justify-self-center text-[12px] sm:text-[13px]">
        <div className="rounded-full border border-white/15 bg-black/40 px-3 py-1 backdrop-blur-md">
          <ListenerCount count={listeners} />
        </div>

        {/* Quick Background Mode pill */}
        <div className="flex items-center rounded-full border border-white/15 bg-black/40 p-0.5 backdrop-blur-md text-[11px]">
          <button
            type="button"
            onClick={() => setBackgroundMode('video')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 transition cursor-pointer ${
              backgroundMode === 'video'
                ? 'bg-amber-500/90 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Video Background"
          >
            <Tv className="h-3 w-3" />
            <span>Video</span>
          </button>
          <button
            type="button"
            onClick={() => setBackgroundMode('art')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 transition cursor-pointer ${
              backgroundMode === 'art'
                ? 'bg-amber-500/90 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Artwork Background"
          >
            <ImageIcon className="h-3 w-3" />
            <span>Poster</span>
          </button>
          <button
            type="button"
            onClick={() => setBackgroundMode('hybrid')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 transition cursor-pointer ${
              backgroundMode === 'hybrid'
                ? 'bg-amber-500/90 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Hybrid Ambient Blend"
          >
            <Sparkles className="h-3 w-3" />
            <span>Hybrid</span>
          </button>
        </div>
      </div>

      {/* Right: Actions & Links */}
      <div className="pointer-events-auto flex items-center gap-2 justify-self-end">
        <button
          type="button"
          onClick={() => setIsCustomModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-amber-200 hover:bg-white/10 hover:border-amber-400/50 backdrop-blur-md transition cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          <span>Add Song</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium text-white hover:bg-white/10 backdrop-blur-md transition cursor-pointer"
        >
          <ListMusic className="h-3.5 w-3.5 text-amber-300" />
          <span>Playlist</span>
        </button>

        <div className="hidden lg:block pl-2">
          <PlatformLinks />
        </div>
      </div>
    </header>
  )
}
