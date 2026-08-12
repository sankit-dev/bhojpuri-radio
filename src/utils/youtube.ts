/**
 * Extracts YouTube Video ID from various URL formats or returns the ID if already in 11-char format.
 */
export function extractYouTubeId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim()
  if (!trimmed) return null

  // Direct 11-character alphanumeric with _ and -
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  // Handle standard watch URL, embed, youtu.be, shorts, music.youtube.com
  const patterns = [
    /(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export function extractYouTubePlaylistId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim()
  if (!trimmed) return null

  try {
    const parsedUrl = new URL(trimmed)
    const playlistId = parsedUrl.searchParams.get('list')
    if (playlistId) {
      return playlistId
    }
  } catch {
    // Continue with direct ID and loose URL matching.
  }

  const match = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  if (match?.[1]) {
    return match[1]
  }

  if (/^[a-zA-Z0-9_-]{12,}$/.test(trimmed)) {
    return trimmed
  }

  return null
}

export function getYouTubeThumbnail(videoId: string, quality: 'max' | 'hq' | 'mq' = 'hq'): string {
  if (quality === 'max') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }
  if (quality === 'mq') {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}
