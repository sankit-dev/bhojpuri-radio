import { createContext } from 'react'
import type { BackgroundMode, PlaybackStatus, Song } from '../types/player'

export interface PlayerContextType {
  playlist: Song[]
  songIndex: number
  currentSong: Song
  isPlaying: boolean
  status: PlaybackStatus
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isShuffle: boolean
  loopMode: 'off' | 'all' | 'one'
  backgroundMode: BackgroundMode
  bgOpacity: number
  isReady: boolean
  error: string | null
  isDrawerOpen: boolean
  isCustomModalOpen: boolean
  hasUserInteracted: boolean
  play: () => void
  pause: () => void
  togglePlayback: () => void
  nextSong: () => void
  prevSong: () => void
  seek: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  selectSong: (index: number) => void
  addCustomTrack: (urlOrId: string, title?: string, artist?: string) => boolean
  replacePlaylist: (urlOrId: string) => boolean
  toggleShuffle: () => void
  toggleLoop: () => void
  setBackgroundMode: (mode: BackgroundMode) => void
  setBgOpacity: (opacity: number) => void
  setIsDrawerOpen: (open: boolean) => void
  setIsCustomModalOpen: (open: boolean) => void
}

export const PlayerContext = createContext<PlayerContextType | null>(null)
