import { useEffect, useState } from 'react'

export function useListenerCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadVisits() {
      try {
        const response = await fetch('/api/visits', {
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as { visits?: unknown }

        if (typeof data.visits === 'number' && Number.isFinite(data.visits)) {
          setCount(data.visits)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.warn('Unable to load Vercel visit count:', error)
        }
      }
    }

    loadVisits()

    return () => controller.abort()
  }, [])

  return count
}
