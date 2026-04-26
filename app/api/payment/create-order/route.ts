import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const PLANS = {
  premium: { amount: 9900, name: 'Premium Plan' },   // ₹99
  pro: { amount: 29900, name: 'Pro Plan' },           // ₹299
  unlimited: { amount: 99900, name: 'Unlimited Plan' } // ₹999
}
export async function POST(request: Request) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
    const { plan } = await request.json()

    if (!PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 })
    }

    const planDetails = PLANS[plan as keyof typeof PLANS]

    const order = await razorpay.orders.create({
      amount: planDetails.amount,
      currency: 'INR',
      receipt: `order_${user.userId}_${Date.now()}`,
      notes: {
        userId: user.userId.toString(),
        plan: plan,
        email: user.email
      }
    })

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: planDetails.amount,
      currency: 'INR',
      plan_name: planDetails.name,
      key_id: process.env.RAZORPAY_KEY_ID
    })

  } catch (error) {
    console.error('Payment order error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
  }
}