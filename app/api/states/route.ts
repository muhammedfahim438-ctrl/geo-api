import { validateApiKey } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/response'
import { Redis } from '@upstash/redis'
import pool from '@/lib/db'

export async function GET(request: Request) {
  const startTime = Date.now()
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey) return errorResponse('INVALID_API_KEY', 'API key missing or invalid', 401)
  
  const auth = await validateApiKey(apiKey)
  if (!auth) return errorResponse('INVALID_API_KEY', 'API key missing or invalid', 401)
  if ('error' in auth) return errorResponse('RATE_LIMITED', `Daily quota exceeded. Plan: ${auth.plan}, Limit: ${auth.limit}/day`, 429)

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })

    const cached = await redis.get('states:all')
    if (cached) {
      return successResponse(cached, auth.plan, auth.requestsToday, auth.limit)
    }

    const result = await pool.query('SELECT code, name FROM states ORDER BY name')
    await redis.setex('states:all', 86400, result.rows)
    
    return successResponse(result.rows, auth.plan, auth.requestsToday, auth.limit)
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 'Server-side error', 500)
  }
}