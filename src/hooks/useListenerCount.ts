import { useEffect, useState } from 'react'
import { siteConfig } from '../config/site'

export function useListenerCount() {
  const [count, setCount] = useState(siteConfig.listeners)

  useEffect(() => {
    // Replace this with a WebSocket or SSE connection when the presence backend exists.
    setCount(siteConfig.listeners)
  }, [])

  return count
}
