const VERCEL_ANALYTICS_URL = 'https://api.vercel.com/v1/query/web-analytics/visits/count'

function readCount(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (!value || typeof value !== 'object') {
    return null
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const count = readCount(item)
      if (count !== null) {
        return count
      }
    }

    return null
  }

  for (const key of ['count', 'total', 'value', 'visits', 'visitors', 'pageViews']) {
    const count = readCount(value[key])
    if (count !== null) {
      return count
    }
  }

  return null
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID

  if (!token || !projectId) {
    return response.status(503).json({ error: 'Vercel analytics is not configured' })
  }

  const analyticsUrl = new URL(VERCEL_ANALYTICS_URL)
  analyticsUrl.searchParams.set('projectId', projectId)

  if (process.env.VERCEL_TEAM_ID) {
    analyticsUrl.searchParams.set('teamId', process.env.VERCEL_TEAM_ID)
  }

  if (process.env.VERCEL_ANALYTICS_FILTER) {
    analyticsUrl.searchParams.set('filter', process.env.VERCEL_ANALYTICS_FILTER)
  }

  const vercelResponse = await fetch(analyticsUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await vercelResponse.json().catch(() => null)

  if (!vercelResponse.ok) {
    return response.status(vercelResponse.status).json({
      error: 'Unable to load Vercel analytics',
    })
  }

  const count = readCount(data)

  if (count === null) {
    return response.status(502).json({ error: 'Unexpected Vercel analytics response' })
  }

  response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600')
  return response.status(200).json({ visits: count })
}
