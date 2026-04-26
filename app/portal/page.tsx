'use client'
import { useState } from 'react'

export default function Portal() {
  const [view, setView] = useState<'login'|'register'|'dashboard'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [token, setToken] = useState('')
  const [user, setUser] = useState<any>(null)
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  async function register() {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, company_name: company })
    })
    const data = await res.json()
    if (data.success) {
      setView('login')
      setError('✅ Account created! Please login.')
    } else {
      setError(data.error)
    }
  }

  async function login() {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.success) {
      setToken(data.token)
      setUser(data.user)
      setApiKeys(data.api_keys)
      setView('dashboard')
    } else {
      setError(data.error)
    }
  }

  async function createKey() {
    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'New Key' })
    })
    const data = await res.json()
    if (data.success) setApiKeys([...apiKeys, data.data])
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  async function handlePayment(plan: string, amount: number, planName: string) {
    try {
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      })
      const orderData = await orderRes.json()
      if (!orderData.success) {
        alert('Failed to create order: ' + orderData.error)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: 'INR',
          name: 'India Geo API',
          description: planName,
          order_id: orderData.order_id,
          handler: async (response: any) => {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan
              })
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              alert(`✅ Successfully upgraded to ${planName}!`)
              setUser({ ...user, plan })
            } else {
              alert('Payment verification failed')
            }
          },
          prefill: { email: user?.email },
          theme: { color: '#16a34a' }
        }
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      alert('Payment failed. Please try again.')
    }
  }

  const planLimits: Record<string, number> = {
    free: 100, premium: 10000, pro: 100000, unlimited: 999999
  }

  if (view === 'dashboard') return (
    <div style={{ backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #f3f4f6', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>🌍 India Geo API</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>{user?.email}</span>
          <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', color: 'white', backgroundColor: user?.plan === 'pro' ? '#a855f7' : user?.plan === 'premium' ? '#3b82f6' : '#16a34a' }}>
            {user?.plan?.toUpperCase()}
          </span>
          <button onClick={() => setView('login')} style={{ color: '#9ca3af', fontSize: '14px', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '32px', paddingBottom: '80px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>My Dashboard</h2>

        {/* Plan Info */}
        <div style={{ backgroundColor: 'white', border: '1px solid #d1fae5', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Your Plan</h3>
          <p style={{ color: '#6b7280' }}>Daily Limit: <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{planLimits[user?.plan]?.toLocaleString()} requests/day</span></p>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>Base URL: <span style={{ fontFamily: 'monospace', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '2px 8px', borderRadius: '4px', fontSize: '14px' }}>https://geo-api-blond.vercel.app</span></p>
        </div>

        {/* API Keys */}
        <div style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>API Keys</h3>
            <button onClick={createKey} style={{ backgroundColor: '#16a34a', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', border: 'none' }}>
              + New Key
            </button>
          </div>
          {apiKeys.map((key: any) => (
            <div key={key.id} style={{ backgroundColor: '#f9fafb', border: '1px solid #f3f4f6', padding: '16px', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#111827' }}>{key.name}</p>
                  <p style={{ fontFamily: 'monospace', color: '#16a34a', fontSize: '14px', backgroundColor: '#f0fdf4', padding: '4px 8px', borderRadius: '4px', marginTop: '4px' }}>{key.key_value}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button onClick={() => copyKey(key.key_value)} style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', border: 'none', display: 'block', marginBottom: '4px' }}>
                    {copied === key.key_value ? '✅ Copied!' : '📋 Copy Key'}
                  </button>
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>Today: {key.requests_today} | Total: {key.requests_total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Quick Start</h3>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Get all states:</p>
          <pre style={{ backgroundColor: '#111827', color: '#4ade80', padding: '16px', borderRadius: '8px', fontSize: '14px', overflowX: 'auto' }}>{`fetch('https://geo-api-blond.vercel.app/api/states', {
  headers: { 'x-api-key': '${apiKeys[0]?.key_value || 'YOUR_API_KEY'}' }
})`}</pre>
        </div>

        {/* Upgrade Plan */}
        <div style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>💳 Upgrade Plan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { plan: 'premium', name: 'Premium', price: '₹99/mo', amount: 9900, requests: '10,000/day' },
              { plan: 'pro', name: 'Pro', price: '₹299/mo', amount: 29900, requests: '1,00,000/day' },
              { plan: 'unlimited', name: 'Unlimited', price: '₹999/mo', amount: 99900, requests: 'Unlimited' },
            ].map(p => (
              <div key={p.plan} style={{ border: user?.plan === p.plan ? '2px solid #16a34a' : '2px solid #f3f4f6', backgroundColor: user?.plan === p.plan ? '#f0fdf4' : 'white', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <h4 style={{ fontWeight: 'bold', color: '#111827' }}>{p.name}</h4>
                <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '20px', margin: '8px 0' }}>{p.price}</p>
                <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>{p.requests}</p>
                {user?.plan === p.plan ? (
                  <p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '14px' }}>✅ Current Plan</p>
                ) : (
                  <button
                    onClick={() => handlePayment(p.plan, p.amount, p.name)}
                    style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', border: 'none' }}>
                    Upgrade
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0fdf4, white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '32px', borderRadius: '16px', width: '384px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>🌍 India Geo API</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>619,246 villages across India</p>

        <div style={{ display: 'flex', marginBottom: '24px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
          <button onClick={() => { setView('login'); setError('') }}
            style={{ flex: 1, padding: '8px', borderRadius: '6px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: view === 'login' ? 'white' : 'transparent', color: view === 'login' ? '#16a34a' : '#6b7280' }}>
            Login
          </button>
          <button onClick={() => { setView('register'); setError('') }}
            style={{ flex: 1, padding: '8px', borderRadius: '6px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', border: 'none', backgroundColor: view === 'register' ? 'white' : 'transparent', color: view === 'register' ? '#16a34a' : '#6b7280' }}>
            Register
          </button>
        </div>

        {error && (
          <p style={{ marginBottom: '16px', fontSize: '14px', padding: '12px', borderRadius: '8px', backgroundColor: error.startsWith('✅') ? '#f0fdf4' : '#fef2f2', color: error.startsWith('✅') ? '#16a34a' : '#ef4444' }}>
            {error}
          </p>
        )}

        {view === 'register' && (
          <input
            style={{ width: '100%', border: '1px solid #e5e7eb', color: '#111827', padding: '12px', borderRadius: '8px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}
            placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} />
        )}
        <input
          style={{ width: '100%', border: '1px solid #e5e7eb', color: '#111827', padding: '12px', borderRadius: '8px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}
          placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input
          style={{ width: '100%', border: '1px solid #e5e7eb', color: '#111827', padding: '12px', borderRadius: '8px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }}
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

        <button
          onClick={view === 'login' ? login : register}
          style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '16px' }}>
          {view === 'login' ? 'Login' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}