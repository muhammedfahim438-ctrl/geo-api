import { validateApiKey } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/response'
import { Redis } from '@upstash/redis'
import pool from '@/lib/db'

export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) return errorResponse('INVALID_API_KEY', 'API key missing or invalid', 401)
  const auth = await validateApiKey(apiKey)
  if (!auth) return errorResponse('INVALID_API_KEY', 'API key missing or invalid', 401)
  if ('error' in auth) return errorResponse('RATE_LIMITED', 'Daily quota exceeded', 429)

  const { searchParams } = new URL(request.url)
  const district_code = searchParams.get('district_code')
  const state_code = searchParams.get('state_code')
  if (!district_code || !state_code) return errorResponse('INVALID_QUERY', 'district_code and state_code required', 400)

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })

    const cacheKey = `subdistricts:${state_code}:${district_code}`
    const cached = await redis.get(cacheKey)
    if (cached) return successResponse(cached, auth.plan, auth.requestsToday, auth.limit)

    const result = await pool.query(
      'SELECT code, name FROM sub_districts WHERE district_code = $1 AND state_code = $2 ORDER BY name',
      [district_code, state_code]
    )
    await redis.setex(cacheKey, 3600, result.rows)
    return successResponse(result.rows, auth.plan, auth.requestsToday, auth.limit)
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 'Server-side error', 500)
  }
}