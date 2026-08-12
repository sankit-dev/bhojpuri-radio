import { useEffect, useState } from 'react'
import { formatLocalTime } from '../utils/time'

export function LocalTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  return <span>{formatLocalTime(now)}</span>
}
