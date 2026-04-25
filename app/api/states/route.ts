import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { validateApiKey } from '@/lib/auth'

export async function GET(request: Request) {
  // Check API key
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'API key required. Add x-api-key header.' },
      { status: 401 }
    )
  }

  const auth = await validateApiKey(apiKey)
  
  if (!auth) {
    return NextResponse.json(
      { success: false, error: 'Invalid API key' },
      { status: 401 }
    )
  }

  if ('error' in auth) {
    return NextResponse.json(
      { success: false, error: `Rate limit exceeded. Plan: ${auth.plan}, Limit: ${auth.limit}/day` },
      { status: 429 }
    )
  }

  try {
    const result = await pool.query(
      'SELECT code, name FROM states ORDER BY name'
    )
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch states' },
      { status: 500 }
    )
  }
}