import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { validateApiKey } from '@/lib/auth'

export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) return NextResponse.json({ success: false, error: 'API key required' }, { status: 401 })
  const auth = await validateApiKey(apiKey)
  if (!auth) return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 })
  if ('error' in auth) return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 })

  const { searchParams } = new URL(request.url)
  const sub_district_code = searchParams.get('sub_district_code')
  const district_code = searchParams.get('district_code')
  const state_code = searchParams.get('state_code')
  if (!sub_district_code || !district_code || !state_code) return NextResponse.json({ success: false, error: 'All params required' }, { status: 400 })

  try {
    const result = await pool.query(
      'SELECT code, name FROM villages WHERE sub_district_code = $1 AND district_code = $2 AND state_code = $3 ORDER BY name',
      [sub_district_code, district_code, state_code]
    )
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch villages' }, { status: 500 })
  }
}