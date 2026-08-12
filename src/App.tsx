import backgroundImage from './assets/background.png'
import { MusicPlayer } from './components/MusicPlayer'
import { TopBar } from './components/TopBar'
import { siteConfig } from './config/site'
import { playlist } from './data/playlist'

function App() {
  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-stone-950 text-white">
      <img
        className="absolute inset-0 h-full w-full scale-[1.012] object-cover opacity-0 [animation:fade-in_900ms_ease_forwards]"
        src={backgroundImage}
        alt=""
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),transparent_22%),linear-gradient(to_top,rgba(0,0,0,0.28),transparent_28%)]" />

      <TopBar />

      {siteConfig.showHeroTitle ? (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center [text-shadow:0_4px_24px_rgba(0,0,0,0.65)]">
          <p className="text-5xl font-semibold tracking-normal">Puranka Bhojpuri</p>
        </div>
      ) : null}

      <MusicPlayer songs={playlist} />
    </main>
  )
}

export default App
