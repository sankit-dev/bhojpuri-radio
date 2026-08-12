declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          height?: string | number
          width?: string | number
          videoId?: string
          playerVars?: {
            autoplay?: 0 | 1
            controls?: 0 | 1
            disablekb?: 0 | 1
            enablejsapi?: 0 | 1
            fs?: 0 | 1
            iv_load_policy?: 1 | 3
            loop?: 0 | 1
            modestbranding?: 0 | 1
            origin?: string
            playsinline?: 0 | 1
            rel?: 0 | 1
            showinfo?: 0 | 1
            autohide?: 0 | 1
            start?: number
            mute?: 0 | 1
            listType?: 'playlist' | 'search' | 'user_uploads'
            list?: string
            index?: number
          }
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void
            onError?: (event: { data: number; target: YTPlayerInstance }) => void
          }
        }
      ) => YTPlayerInstance
      PlayerState: {
        UNSTARTED: number
        ENDED: number
        PLAYING: number
        PAUSED: number
        BUFFERING: number
        CUED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export interface VideoData {
  video_id?: string
  author?: string
  title?: string
  [key: string]: unknown
}

export interface YTPlayerInstance {
  playVideo: () => void
  pauseVideo: () => void
  stopVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  getPlayerState: () => number
  getCurrentTime: () => number
  getDuration: () => number
  loadVideoById: (videoId: string | { videoId: string; startSeconds?: number }) => void
  cueVideoById: (videoId: string | { videoId: string; startSeconds?: number }) => void
  loadPlaylist: (
    playlist: string | string[] | { list?: string; listType?: string; index?: number; startSeconds?: number },
    index?: number,
    startSeconds?: number
  ) => void
  cuePlaylist: (
    playlist: string | string[] | { list?: string; listType?: string; index?: number; startSeconds?: number },
    index?: number,
    startSeconds?: number
  ) => void
  nextVideo: () => void
  previousVideo: () => void
  playVideoAt: (index: number) => void
  getPlaylist: () => string[]
  getPlaylistIndex: () => number
  getVideoData: () => VideoData
  setShuffle: (shufflePlaylist: boolean) => void
  setLoop: (loopPlaylists: boolean) => void
  destroy: () => void
  getIframe: () => HTMLIFrameElement
}
