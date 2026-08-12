export function formatAudioTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00'
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function formatLocalTime(date: Date) {
  const hour = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const period = hour >= 12 ? 'pm' : 'am'
  const displayHour = hour % 12 || 12

  return `${displayHour} ${minutes} ${period}`
}
