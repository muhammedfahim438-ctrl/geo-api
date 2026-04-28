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
  const q = searchParams.get('q')
  const state = searchParams.get('state')
  const district = searchParams.get('district')
  const limit = parseInt(searchParams.get('limit') || '20')

  if (!q || q.length < 2) return errorResponse('INVALID_QUERY', 'Search query must be at least 2 characters', 400)

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })

    const cacheKey = `search:${q.toLowerCase()}:${state || ''}:${district || ''}`
    const cached = await redis.get(cacheKey)
    if (cached) return successResponse(cached, auth.plan, auth.requestsToday, auth.limit)

    let query = `
      SELECT v.name as village, sd.name as sub_district,
             d.name as district, s.name as state,
             v.code, v.sub_district_code, v.district_code, v.state_code
      FROM villages v
      JOIN sub_districts sd ON v.sub_district_code = sd.code AND v.district_code = sd.district_code AND v.state_code = sd.state_code
      JOIN districts d ON v.district_code = d.code AND v.state_code = d.state_code
      JOIN states s ON v.state_code = s.code
      WHERE v.name ILIKE $1
    `
    const params: any[] = [`%${q}%`]

    if (state) {
      params.push(state)
      query += ` AND s.code = $${params.length}`
    }
    if (district) {
      params.push(district)
      query += ` AND d.code = $${params.length}`
    }
    query += ` LIMIT ${Math.min(limit, 50)}`

    const result = await pool.query(query, params)
    await redis.setex(cacheKey, 300, result.rows)
    return successResponse(result.rows, auth.plan, auth.requestsToday, auth.limit)
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 'Server-side error', 500)
  }
}