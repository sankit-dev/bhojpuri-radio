export interface Song {
  id: string
  youtubeId: string
  title: string
  artist: string
  year?: number
  movie?: string
  cover?: string
  genre?: string
  description?: string
}

export type PlaybackStatus = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued' | 'loading'

export type BackgroundMode = 'video' | 'art' | 'hybrid'

export interface YouTubePlayerState {
  currentSong: Song
  songIndex: number
  isPlaying: boolean
  status: PlaybackStatus
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isShuffle: boolean
  isLoop: boolean
  backgroundMode: BackgroundMode
  bgOpacity: number
  isReady: boolean
  error: string | null
}
