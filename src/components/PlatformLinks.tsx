import { RadioTower } from 'lucide-react'
import { externalLinks } from '../config/site'

export function PlatformLinks() {
  return (
    <div className="flex items-center justify-end text-[13px] font-medium sm:text-sm">
      <a
        className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-white/75 transition duration-200 hover:bg-white/8 hover:text-white"
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
