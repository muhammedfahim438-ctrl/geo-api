import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM api_users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = result.rows[0]

    // Check password
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get user's API keys
    const keysResult = await pool.query(
      'SELECT id, key_value, name, is_active, requests_today, requests_total FROM api_keys WHERE user_id = $1',
      [user.id]
    )

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        company_name: user.company_name,
        plan: user.plan,
        is_admin: user.is_admin
      },
      api_keys: keysResult.rows
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}