import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT code, name FROM states ORDER BY name'
    )
    return NextResponse.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch states' },
      { status: 500 }
    )
  }
}