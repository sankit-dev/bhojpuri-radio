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

      {/* Center: Live Listeners & Mode Controls */}
      <div className="pointer-events-auto hidden md:flex items-center justify-center justify-self-center rounded-full border border-white/15 bg-black/38 p-1.5 text-[12px] shadow-[0_14px_44px_rgba(0,0,0,0.26)] ring-1 ring-white/8 backdrop-blur-xl sm:text-[13px]">
        <div className="flex h-8 min-w-[104px] items-center justify-center rounded-full border border-white/12 bg-white/8 px-3.5 text-white">
          <ListenerCount count={listeners} />
        </div>

        <div className="mx-1 h-5 w-px bg-white/14" />

        {/* Quick Background Mode Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setBackgroundMode('video')}
            className={`flex h-8 min-w-[78px] items-center justify-center gap-1.5 rounded-full px-3 transition cursor-pointer ${
              backgroundMode === 'video'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_6px_18px_rgba(251,191,36,0.28)]'
                : 'text-stone-300 hover:bg-white/8 hover:text-white'
            }`}
            title="Video Background"
          >
            <Tv className="h-3 w-3" />
            <span>Video</span>
          </button>
          <button
            type="button"
            onClick={() => setBackgroundMode('art')}
            className={`flex h-8 min-w-[78px] items-center justify-center gap-1.5 rounded-full px-3 transition cursor-pointer ${
              backgroundMode === 'art'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_6px_18px_rgba(251,191,36,0.28)]'
                : 'text-stone-300 hover:bg-white/8 hover:text-white'
            }`}
            title="Artwork Background"
          >
            <ImageIcon className="h-3 w-3" />
            <span>Poster</span>
          </button>
          <button
            type="button"
            onClick={() => setBackgroundMode('hybrid')}
            className={`flex h-8 min-w-[78px] items-center justify-center gap-1.5 rounded-full px-3 transition cursor-pointer ${
              backgroundMode === 'hybrid'
                ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_6px_18px_rgba(251,191,36,0.28)]'
                : 'text-stone-300 hover:bg-white/8 hover:text-white'
            }`}
            title="Hybrid Ambient Blend"
          >
            <Sparkles className="h-3 w-3" />
            <span>Hybrid</span>
          </button>
        </div>
      </div>

      {/* Right: Actions & Links */}
      <div className="pointer-events-auto flex items-center gap-1.5 justify-self-end rounded-full border border-white/15 bg-black/38 p-1.5 text-[12px] shadow-[0_14px_44px_rgba(0,0,0,0.24)] ring-1 ring-white/8 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setIsCustomModalOpen(true)}
          className="hidden h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-amber-200 transition hover:bg-white/8 hover:text-amber-100 sm:inline-flex cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          <span>Add Song</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-white transition hover:bg-white/8 cursor-pointer"
        >
          <ListMusic className="h-3.5 w-3.5 text-amber-300" />
          <span>Playlist</span>
        </button>

        <div className="mx-0.5 hidden h-5 w-px bg-white/14 lg:block" />

        <div className="hidden lg:block">
          <PlatformLinks />
        </div>
      </div>
    </header>
  )
}
