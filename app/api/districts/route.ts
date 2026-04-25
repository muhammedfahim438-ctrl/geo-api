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
  const state_code = searchParams.get('state_code')
  if (!state_code) return NextResponse.json({ success: false, error: 'state_code is required' }, { status: 400 })

  try {
    const result = await pool.query(
      'SELECT code, name FROM districts WHERE state_code = $1 ORDER BY name',
      [state_code]
    )
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch districts' }, { status: 500 })
  }
}