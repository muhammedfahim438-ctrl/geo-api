import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.length < 2) {
    return NextResponse.json(
      { success: false, error: 'Query must be at least 2 characters' },
      { status: 400 }
    )
  }

  try {
    const result = await pool.query(
      `SELECT v.name as village, sd.name as sub_district, 
              d.name as district, s.name as state,
              v.code, v.sub_district_code, v.district_code, v.state_code
       FROM villages v
       JOIN sub_districts sd ON v.sub_district_code = sd.code AND v.district_code = sd.district_code AND v.state_code = sd.state_code
       JOIN districts d ON v.district_code = d.code AND v.state_code = d.state_code
       JOIN states s ON v.state_code = s.code
       WHERE v.name ILIKE $1
       LIMIT 20`,
      [`%${q}%`]
    )
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}