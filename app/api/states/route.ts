import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { validateApiKey } from '@/lib/auth'
import { getCached, setCached } from '@/lib/cache'

export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) return NextResponse.json({ success: false, error: 'API key required' }, { status: 401 })
  const auth = await validateApiKey(apiKey)
  if (!auth) return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 })
  if ('error' in auth) return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 })

  try {
    // Check cache first
    const cached = await getCached('states:all')
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true })
    }

    const result = await pool.query('SELECT code, name FROM states ORDER BY name')
    
    // Save to cache
    await setCached('states:all', result.rows, 'states')
    
    return NextResponse.json({ success: true, data: result.rows, cached: false })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch states' }, { status: 500 })
  }
}