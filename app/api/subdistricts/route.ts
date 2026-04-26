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

  const { searchParams } = new URL(request.url)
  const district_code = searchParams.get('district_code')
  const state_code = searchParams.get('state_code')
  if (!district_code || !state_code) return NextResponse.json({ success: false, error: 'district_code and state_code required' }, { status: 400 })

  try {
    const cacheKey = `subdistricts:${state_code}:${district_code}`
    const cached = await getCached(cacheKey)
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true })
    }

    const result = await pool.query(
      'SELECT code, name FROM sub_districts WHERE district_code = $1 AND state_code = $2 ORDER BY name',
      [district_code, state_code]
    )

    await setCached(cacheKey, result.rows, 'subdistricts')
    return NextResponse.json({ success: true, data: result.rows, cached: false })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch sub-districts' }, { status: 500 })
  }
}