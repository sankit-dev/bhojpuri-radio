import { useState } from 'react'
import backgroundImage from '../assets/background.png'
import { usePlayer } from '../context/usePlayer'

export function YouTubeBackground() {
  const { backgroundMode, bgOpacity, isPlaying, currentSong } = usePlayer()
  const [imgLoaded, setImgLoaded] = useState(false)

  // Calculate video layer opacity based on mode and settings
  const videoOpacity =
    backgroundMode === 'art'
      ? 0
      : backgroundMode === 'hybrid'
        ? Math.min(bgOpacity, 0.6)
        : bgOpacity

  const showArtLayer = backgroundMode === 'art' || backgroundMode === 'hybrid' || !isPlaying

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden select-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* 
        YouTube Iframe Player Container (Exact integration requested)
        position: fixed; z-index: -99; width: 100%; height: 100%
      */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-1000 ease-out"
        style={{
          opacity: videoOpacity,
          zIndex: -99,
        }}
      >
        <div className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-[100vh] w-[100vw] min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 scale-[1.05]">
          <div id="youtube-iframe-player" className="h-full w-full pointer-events-none" />
        </div>
      </div>

      {/* Classic Artwork Fallback / Hybrid layer */}
      <div
        className="absolute inset-0 h-full w-full transition-opacity duration-1000 ease-out"
        style={{
          opacity: showArtLayer ? (backgroundMode === 'hybrid' ? 0.45 : 1) : 0,
          zIndex: -90,
        }}
      >
        <img
          src={backgroundImage}
          alt=""
          onLoad={() => setImgLoaded(true)}
          className={`h-full w-full object-cover scale-[1.015] transition-opacity duration-700 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Dynamic Song Artwork Ambient Glow (Subtle pulsating colored shadow from song thumbnail) */}
      {currentSong.cover ? (
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 transition-all duration-1000 scale-125"
          style={{
            backgroundImage: `url(${currentSong.cover})`,
            zIndex: -80,
          }}
        />
      ) : null}

      {/* Retro Bhojpuri Lofi Film Tint & Vignette Overlays for UI contrast */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,5,3,0.75)_100%)]"
        style={{ zIndex: -70 }}
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45)_0%,transparent_25%,transparent_75%,rgba(0,0,0,0.65)_100%)]"
        style={{ zIndex: -60 }}
      />
      <div
        className="absolute inset-0 bg-[rgba(20,10,6,0.18)] mix-blend-multiply"
        style={{ zIndex: -50 }}
      />
    </div>
  )
}
