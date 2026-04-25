import { NextResponse } from 'next/server'
import crypto from 'crypto'
import pool from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await request.json()

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })
    }

    // Update user plan
    await pool.query(
      'UPDATE api_users SET plan = $1 WHERE id = $2',
      [plan, user.userId]
    )

    // Save payment record
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        plan VARCHAR(20),
        amount INTEGER,
        razorpay_order_id VARCHAR(100),
        razorpay_payment_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    await pool.query(`
      INSERT INTO payments (user_id, plan, amount, razorpay_order_id, razorpay_payment_id)
      VALUES ($1, $2, $3, $4, $5)
    `, [user.userId, plan, 0, razorpay_order_id, razorpay_payment_id])

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${plan} plan!`
    })

  } catch (error) {
    console.error('Payment verify error:', error)
    return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 500 })
  }
}