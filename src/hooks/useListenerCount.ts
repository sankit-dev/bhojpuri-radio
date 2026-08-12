import { useEffect, useState } from 'react'
import { siteConfig } from '../config/site'

export function useListenerCount() {
  const [count, setCount] = useState(siteConfig.visits)

  useEffect(() => {
    // Replace this with Vercel Web Analytics API data when server support exists.
    setCount(siteConfig.visits)
  }, [])

  return count
}
