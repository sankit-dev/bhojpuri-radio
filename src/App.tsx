import { Analytics } from '@vercel/analytics/react'
import { PlayerProvider } from './context/PlayerContext'
import { YouTubeBackground } from './components/YouTubeBackground'
import { TopBar } from './components/TopBar'
import { MusicPlayer } from './components/MusicPlayer'
import { PlaylistDrawer } from './components/PlaylistDrawer'
import { CustomTrackModal } from './components/CustomTrackModal'
import { siteConfig } from './config/site'

function RadioExperience() {
  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-stone-950 text-white select-none">
      {/* Background YouTube Video & Ambient Artwork */}
      <YouTubeBackground />

      {/* Top Header Navigation */}
      <TopBar />

      {/* Hero Title (Optional / Ambient Centerpiece) */}
      {siteConfig.showHeroTitle ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center [text-shadow:0_4px_24px_rgba(0,0,0,0.85)]">
          <p className="text-4xl sm:text-6xl font-bold tracking-tight text-white/90">
            Puranka Bhojpuri
          </p>
          <p className="mt-2 text-xs sm:text-sm font-medium tracking-widest text-amber-300/80 uppercase">
            Vintage Bhojpuri Lofi & Classics
          </p>
        </div>
      ) : null}

      {/* Primary Floating Glassmorphic Music Player */}
      <MusicPlayer />

      {/* Sliding Playlist Queue Drawer */}
      <PlaylistDrawer />

      {/* Add Custom YouTube Track Modal */}
      <CustomTrackModal />
    </main>
  )
}

export function App() {
  return (
    <PlayerProvider>
      <RadioExperience />
      <Analytics />
    </PlayerProvider>
  )
}

export default App
