import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { defaultPlaylist } from '../data/playlist'
import { siteConfig } from '../config/site'
import type { BackgroundMode, PlaybackStatus, Song } from '../types/player'
import type { YTPlayerInstance } from '../types/youtube'
import { extractYouTubeId, getYouTubeThumbnail } from '../utils/youtube'

interface PlayerContextType {
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
  toggleShuffle: () => void
  toggleLoop: () => void
  setBackgroundMode: (mode: BackgroundMode) => void
  setBgOpacity: (opacity: number) => void
  setIsDrawerOpen: (open: boolean) => void
  setIsCustomModalOpen: (open: boolean) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

const YOUTUBE_CONTAINER_ID = 'youtube-iframe-player'

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playlist, setPlaylist] = useState<Song[]>(defaultPlaylist)
  const [songIndex, setSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [status, setStatus] = useState<PlaybackStatus>('unstarted')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(85)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [loopMode, setLoopMode] = useState<'off' | 'all' | 'one'>('all')
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('video')
  const [bgOpacity, setBgOpacity] = useState(0.85)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [dynamicSong, setDynamicSong] = useState<Song | null>(null)

  const playerRef = useRef<YTPlayerInstance | null>(null)
  const playlistRef = useRef(playlist)
  playlistRef.current = playlist
  const songIndexRef = useRef(songIndex)
  songIndexRef.current = songIndex
  const loopModeRef = useRef(loopMode)
  loopModeRef.current = loopMode
  const isShuffleRef = useRef(isShuffle)
  isShuffleRef.current = isShuffle

  // Active track is either dynamic from YouTube playlist or selected from playlist array
  const currentSong = dynamicSong || playlist[songIndex] || playlist[0]

  // Update dynamic song details from player
  const syncCurrentVideoData = useCallback((targetPlayer: YTPlayerInstance) => {
    try {
      const data = targetPlayer.getVideoData?.()
      const pIdx = targetPlayer.getPlaylistIndex?.()

      if (typeof pIdx === 'number' && pIdx >= 0) {
        setSongIndex(pIdx)
      }

      if (data && (data.title || data.video_id)) {
        const videoId = data.video_id || ''
        const title = data.title || 'Puranka Bhojpuri Music'
        const artist = data.author || 'Bhojpuri Radio Station'

        setDynamicSong({
          id: videoId || `track-${pIdx || 0}`,
          youtubeId: videoId,
          title,
          artist,
          cover: videoId ? getYouTubeThumbnail(videoId, 'hq') : undefined,
          genre: 'Puranka Bhojpuri',
        })
      }

      const dur = targetPlayer.getDuration()
      if (dur > 0) setDuration(dur)
    } catch {
      // ignore
    }
  }, [])

  // Initialize YouTube Iframe Player with siteConfig.youtubeMusicPlaylistId
  useEffect(() => {
    let checkTimer: number | null = null

    const initPlayer = () => {
      const container = document.getElementById(YOUTUBE_CONTAINER_ID)
      if (!container || !window.YT || !window.YT.Player) {
        return false
      }

      try {
        if (playerRef.current) {
          try {
            playerRef.current.destroy()
          } catch {
            // ignore
          }
        }

        const playlistId = siteConfig.youtubeMusicPlaylistId

        playerRef.current = new window.YT.Player(YOUTUBE_CONTAINER_ID, {
          height: '100%',
          width: '100%',
          playerVars: {
            listType: playlistId ? 'playlist' : undefined,
            list: playlistId || undefined,
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            autohide: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              setIsReady(true)
              setError(null)
              try {
                event.target.setVolume(85)
                syncCurrentVideoData(event.target)
                const dur = event.target.getDuration()
                if (dur > 0) {
                  setDuration(dur)
                }

                // If playlist IDs are returned, populate/sync queue
                const ytPlaylist = event.target.getPlaylist?.()
                if (Array.isArray(ytPlaylist) && ytPlaylist.length > 0) {
                  const syncedSongs: Song[] = ytPlaylist.map((id, idx) => {
                    const existing = defaultPlaylist.find((s) => s.youtubeId === id)
                    return (
                      existing || {
                        id: `yt-pl-${id}-${idx}`,
                        youtubeId: id,
                        title: `Bhojpuri Track #${idx + 1}`,
                        artist: 'Puranka Radio Playlist',
                        cover: getYouTubeThumbnail(id, 'hq'),
                        genre: 'Bhojpuri Hit',
                      }
                    )
                  })
                  setPlaylist(syncedSongs)
                }
              } catch (e) {
                console.warn('Error setting initial volume/duration:', e)
              }
            },
            onStateChange: (event) => {
              const state = event.data
              if (!window.YT) return

              if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true)
                setStatus('playing')
                setError(null)
                syncCurrentVideoData(event.target)
              } else if (state === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false)
                setStatus('paused')
              } else if (state === window.YT.PlayerState.BUFFERING) {
                setStatus('buffering')
                syncCurrentVideoData(event.target)
              } else if (state === window.YT.PlayerState.CUED) {
                setStatus('cued')
                syncCurrentVideoData(event.target)
              } else if (state === window.YT.PlayerState.ENDED) {
                setStatus('ended')
                handleTrackEnd()
              }
            },
            onError: (event) => {
              console.warn('YouTube Player error:', event.data)
              // If video has embedding restriction or error, advance to next track in playlist
              try {
                if (playerRef.current) {
                  playerRef.current.nextVideo()
                }
              } catch {
                // ignore
              }
            },
          },
        })
        return true
      } catch (err) {
        console.error('Failed to create YouTube player:', err)
        return false
      }
    }

    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        initPlayer()
      }
    } else {
      initPlayer()
    }

    checkTimer = window.setInterval(() => {
      if (!isReady && window.YT && window.YT.Player) {
        if (initPlayer()) {
          if (checkTimer) window.clearInterval(checkTimer)
        }
      }
    }, 400)

    return () => {
      if (checkTimer) window.clearInterval(checkTimer)
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch {
          // ignore
        }
        playerRef.current = null
      }
    }
  }, [syncCurrentVideoData, isReady])

  // Poll current time & duration when playing
  useEffect(() => {
    if (!isPlaying) return

    const interval = window.setInterval(() => {
      if (playerRef.current) {
        try {
          const time = playerRef.current.getCurrentTime()
          const dur = playerRef.current.getDuration()
          if (typeof time === 'number' && !Number.isNaN(time)) {
            setCurrentTime(time)
          }
          if (typeof dur === 'number' && !Number.isNaN(dur) && dur > 0) {
            setDuration(dur)
          }
        } catch {
          // ignore
        }
      }
    }, 250)

    return () => window.clearInterval(interval)
  }, [isPlaying])

  const play = useCallback(() => {
    setHasUserInteracted(true)
    if (playerRef.current) {
      try {
        playerRef.current.playVideo()
        setIsPlaying(true)
      } catch (e) {
        console.warn('Error playing video:', e)
      }
    }
  }, [])

  const pause = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.pauseVideo()
        setIsPlaying(false)
      } catch (e) {
        console.warn('Error pausing video:', e)
      }
    }
  }, [])

  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, pause, play])

  const nextSong = useCallback(() => {
    if (!playerRef.current) return
    try {
      setDynamicSong(null)
      setCurrentTime(0)
      playerRef.current.nextVideo()
      setIsPlaying(true)
    } catch {
      // Fallback to manual index progression
      const nextIdx = (songIndexRef.current + 1) % playlistRef.current.length
      setSongIndex(nextIdx)
      const target = playlistRef.current[nextIdx]
      if (target) {
        playerRef.current.loadVideoById(target.youtubeId)
      }
    }
  }, [])

  const prevSong = useCallback(() => {
    if (!playerRef.current) return

    if (currentTime > 3) {
      try {
        playerRef.current.seekTo(0, true)
        setCurrentTime(0)
        return
      } catch {
        // continue
      }
    }

    try {
      setDynamicSong(null)
      setCurrentTime(0)
      playerRef.current.previousVideo()
      setIsPlaying(true)
    } catch {
      const prevIdx = (songIndexRef.current - 1 + playlistRef.current.length) % playlistRef.current.length
      setSongIndex(prevIdx)
      const target = playlistRef.current[prevIdx]
      if (target) {
        playerRef.current.loadVideoById(target.youtubeId)
      }
    }
  }, [currentTime])

  const handleTrackEnd = useCallback(() => {
    const currentLoop = loopModeRef.current
    if (currentLoop === 'one') {
      if (playerRef.current) {
        try {
          playerRef.current.seekTo(0, true)
          playerRef.current.playVideo()
        } catch {
          // ignore
        }
      }
    } else {
      nextSong()
    }
  }, [nextSong])

  const seek = useCallback((seconds: number) => {
    if (playerRef.current) {
      try {
        playerRef.current.seekTo(seconds, true)
        setCurrentTime(seconds)
      } catch (e) {
        console.warn('Error seeking video:', e)
      }
    }
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVolume)))
    setVolumeState(clamped)
    if (clamped > 0) {
      setIsMuted(false)
    }

    if (playerRef.current) {
      try {
        if (playerRef.current.isMuted() && clamped > 0) {
          playerRef.current.unMute()
        }
        playerRef.current.setVolume(clamped)
      } catch (e) {
        console.warn('Error setting volume:', e)
      }
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      try {
        if (isMuted) {
          playerRef.current.unMute()
          setIsMuted(false)
          if (volume === 0) {
            setVolumeState(80)
            playerRef.current.setVolume(80)
          }
        } else {
          playerRef.current.mute()
          setIsMuted(true)
        }
      } catch (e) {
        console.warn('Error toggling mute:', e)
      }
    }
  }, [isMuted, volume])

  const selectSong = useCallback((index: number) => {
    setHasUserInteracted(true)
    setSongIndex(index)
    setDynamicSong(null)
    setCurrentTime(0)

    if (playerRef.current) {
      try {
        playerRef.current.playVideoAt(index)
        setIsPlaying(true)
      } catch {
        const target = playlistRef.current[index]
        if (target) {
          playerRef.current.loadVideoById(target.youtubeId)
          setIsPlaying(true)
        }
      }
    }
  }, [])

  const addCustomTrack = useCallback(
    (urlOrId: string, title?: string, artist?: string): boolean => {
      const ytId = extractYouTubeId(urlOrId)
      if (!ytId) return false

      const customTrack: Song = {
        id: `custom-${Date.now()}`,
        youtubeId: ytId,
        title: title?.trim() || `Bhojpuri Track (${ytId})`,
        artist: artist?.trim() || 'Custom Station Feed',
        year: new Date().getFullYear(),
        genre: 'User Choice',
        cover: getYouTubeThumbnail(ytId, 'hq'),
        description: 'Added via custom YouTube link.',
      }

      setPlaylist((prev) => [...prev, customTrack])
      setDynamicSong(customTrack)

      if (playerRef.current) {
        try {
          playerRef.current.loadVideoById(ytId)
          setIsPlaying(true)
          setHasUserInteracted(true)
        } catch {
          // ignore
        }
      }

      return true
    },
    []
  )

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev
      if (playerRef.current) {
        try {
          playerRef.current.setShuffle(next)
        } catch {
          // ignore
        }
      }
      return next
    })
  }, [])

  const toggleLoop = useCallback(() => {
    setLoopMode((prev) => {
      const next = prev === 'all' ? 'one' : prev === 'one' ? 'off' : 'all'
      if (playerRef.current) {
        try {
          playerRef.current.setLoop(next !== 'off')
        } catch {
          // ignore
        }
      }
      return next
    })
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        playlist,
        songIndex,
        currentSong,
        isPlaying,
        status,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        loopMode,
        backgroundMode,
        bgOpacity,
        isReady,
        error,
        isDrawerOpen,
        isCustomModalOpen,
        hasUserInteracted,
        play,
        pause,
        togglePlayback,
        nextSong,
        prevSong,
        seek,
        setVolume,
        toggleMute,
        selectSong,
        addCustomTrack,
        toggleShuffle,
        toggleLoop,
        setBackgroundMode,
        setBgOpacity,
        setIsDrawerOpen,
        setIsCustomModalOpen,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
