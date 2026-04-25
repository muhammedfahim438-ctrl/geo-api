import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const state_code = searchParams.get('state_code')

  if (!state_code) {
    return NextResponse.json(
      { success: false, error: 'state_code is required' },
      { status: 400 }
    )
  }

  try {
    const result = await pool.query(
      'SELECT code, name FROM districts WHERE state_code = $1 ORDER BY name',
      [state_code]
    )
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch districts' },
      { status: 500 }
    )
  }
}