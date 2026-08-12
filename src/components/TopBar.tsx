import { useListenerCount } from '../hooks/useListenerCount'
import { ListenerCount } from './ListenerCount'
import { LocalTime } from './LocalTime'
import { PlatformLinks } from './PlatformLinks'

export function TopBar() {
  const listeners = useListenerCount()

  return (
    <header className="pointer-events-none absolute left-0 top-0 z-20 grid w-full grid-cols-3 items-center px-4 pt-4 text-[13px] font-medium text-white opacity-0 shadow-black/30 [animation:fade-in_800ms_ease_180ms_forwards] [text-shadow:0_2px_12px_rgba(0,0,0,0.65)] sm:px-7 sm:pt-7 sm:text-[15px]">
      <div className="pointer-events-auto justify-self-start">
        <LocalTime />
      </div>
      <div className="pointer-events-auto justify-self-center text-[12px] sm:text-[13px]">
        <ListenerCount count={listeners} />
      </div>
      <div className="pointer-events-auto justify-self-end">
        <PlatformLinks />
      </div>
    </header>
  )
}
