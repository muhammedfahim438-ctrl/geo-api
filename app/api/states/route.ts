import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { validateApiKey } from '@/lib/auth'
import { Redis } from '@upstash/redis'

export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) return NextResponse.json({ success: false, error: 'API key required' }, { status: 401 })
  const auth = await validateApiKey(apiKey)
  if (!auth) return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 })
  if ('error' in auth) return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 })

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })

    // Try to get from cache
    const cached = await redis.get('states:all')
    
    if (cached) {
      return NextResponse.json({ 
        success: true, 
        data: cached, 
        cached: true,
        message: 'FROM REDIS CACHE'
      })
    }

    // Get from database
    const result = await pool.query('SELECT code, name FROM states ORDER BY name')
    
    // Save to Redis
    await redis.setex('states:all', 86400, result.rows)
    
    return NextResponse.json({ 
      success: true, 
      data: result.rows, 
      cached: false,
      message: 'FROM DATABASE - saved to cache'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed',
    }, { status: 500 })
  }
}