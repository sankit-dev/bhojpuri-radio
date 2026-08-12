import { Music2, RadioTower } from 'lucide-react'
import { externalLinks } from '../config/site'

export function PlatformLinks() {
  return (
    <div className="flex items-center justify-end gap-4 text-[13px] font-medium sm:gap-6 sm:text-sm">
      <a
        className="inline-flex items-center gap-1.5 opacity-75 transition duration-200 hover:-translate-y-0.5 hover:opacity-100 hover:underline hover:underline-offset-4"
        href={externalLinks.spotify}
        rel="noreferrer"
        target="_blank"
      >
        <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Spotify</span>
        <span aria-hidden="true">↗</span>
      </a>
      <a
        className="inline-flex items-center gap-1.5 opacity-75 transition duration-200 hover:-translate-y-0.5 hover:opacity-100 hover:underline hover:underline-offset-4"
        href={externalLinks.youtubeMusic}
        rel="noreferrer"
        target="_blank"
      >
        <RadioTower className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">YT Music</span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  )
}
