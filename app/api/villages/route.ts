import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sub_district_code = searchParams.get('sub_district_code')
  const district_code = searchParams.get('district_code')
  const state_code = searchParams.get('state_code')

  if (!sub_district_code || !district_code || !state_code) {
    return NextResponse.json(
      { success: false, error: 'sub_district_code, district_code and state_code are required' },
      { status: 400 }
    )
  }

  try {
    const result = await pool.query(
      'SELECT code, name FROM villages WHERE sub_district_code = $1 AND district_code = $2 AND state_code = $3 ORDER BY name',
      [sub_district_code, district_code, state_code]
    )
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch villages' },
      { status: 500 }
    )
  }
}