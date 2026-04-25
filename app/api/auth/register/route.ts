import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { generateApiKey } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, company_name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Create user
    const userResult = await pool.query(`
      INSERT INTO api_users (email, password_hash, company_name)
      VALUES ($1, $2, $3)
      RETURNING id, email, company_name, plan
    `, [email, password_hash, company_name || ''])

    const user = userResult.rows[0]

    // Generate first API key
    const apiKey = generateApiKey()
    await pool.query(`
      INSERT INTO api_keys (user_id, key_value, name)
      VALUES ($1, $2, $3)
    `, [user.id, apiKey, 'Default Key'])

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        company_name: user.company_name,
        plan: user.plan
      },
      api_key: apiKey
    })

  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
}