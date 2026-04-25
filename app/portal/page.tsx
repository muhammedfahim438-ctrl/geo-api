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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600">🌍 India Geo API</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">{user?.email}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
            user?.plan === 'pro' ? 'bg-purple-500' :
            user?.plan === 'premium' ? 'bg-blue-500' : 'bg-green-500'
          }`}>{user?.plan?.toUpperCase()}</span>
          <button onClick={() => setView('login')} className="text-gray-400 hover:text-red-500 text-sm">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Dashboard</h2>

        {/* Plan Info */}
        <div className="bg-white border border-green-100 p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Your Plan</h3>
          <p className="text-gray-500">Daily Limit: <span className="text-green-600 font-bold">{planLimits[user?.plan]?.toLocaleString()} requests/day</span></p>
          <p className="text-gray-500 mt-1">Base URL: <span className="font-mono text-green-600 bg-green-50 px-2 py-1 rounded text-sm">https://geo-api-blond.vercel.app</span></p>
        </div>

        {/* API Keys */}
        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">API Keys</h3>
            <button onClick={createKey} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm">
              + New Key
            </button>
          </div>
          {apiKeys.map((key: any) => (
            <div key={key.id} className="bg-gray-50 border border-gray-100 p-4 rounded-lg mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900">{key.name}</p>
                  <p className="font-mono text-green-600 text-sm bg-green-50 px-2 py-1 rounded mt-1">{key.key_value}</p>
                </div>
                <div className="text-right">
                  <button onClick={() => copyKey(key.key_value)}
                    className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm mb-2 block w-full">
                    {copied === key.key_value ? '✅ Copied!' : '📋 Copy Key'}
                  </button>
                  <p className="text-gray-400 text-xs">Today: {key.requests_today} | Total: {key.requests_total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Start</h3>
          <p className="text-gray-500 text-sm mb-2">Get all states:</p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">{`fetch('https://geo-api-blond.vercel.app/api/states', {
  headers: { 'x-api-key': '${apiKeys[0]?.key_value || 'YOUR_API_KEY'}' }
})`}</pre>
        </div>

        {/* Upgrade Plan */}
        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Upgrade Plan</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { plan: 'premium', name: 'Premium', price: '₹99/mo', amount: 99900, requests: '10,000/day' },
              { plan: 'pro', name: 'Pro', price: '₹299/mo', amount: 299900, requests: '1,00,000/day' },
              { plan: 'unlimited', name: 'Unlimited', price: '₹999mo', amount: 999900, requests: 'Unlimited' },
            ].map(p => (
              <div key={p.plan} className={`border-2 p-4 rounded-xl text-center ${
                user?.plan === p.plan ? 'border-green-500 bg-green-50' : 'border-gray-100'
              }`}>
                <h4 className="font-bold text-gray-900">{p.name}</h4>
                <p className="text-green-600 font-bold text-xl my-2">{p.price}</p>
                <p className="text-gray-400 text-xs mb-3">{p.requests}</p>
                {user?.plan === p.plan ? (
                  <p className="text-green-600 font-bold text-sm">✅ Current Plan</p>
                ) : (
                  <button
                    onClick={() => handlePayment(p.plan, p.amount, p.name)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm">
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="bg-white border border-gray-100 shadow-lg p-8 rounded-2xl w-96">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">🌍 India Geo API</h1>
        <p className="text-gray-400 text-sm mb-6">619,246 villages across India</p>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button onClick={() => { setView('login'); setError('') }}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${
              view === 'login' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
            }`}>Login</button>
          <button onClick={() => { setView('register'); setError('') }}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-all ${
              view === 'register' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
            }`}>Register</button>
        </div>

        {error && <p className={`mb-4 text-sm p-3 rounded-lg ${
          error.startsWith('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
        }`}>{error}</p>}

        {view === 'register' && (
          <input className="w-full border border-gray-200 text-gray-900 p-3 rounded-lg mb-3 focus:outline-none focus:border-green-400"
            placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} />
        )}
        <input className="w-full border border-gray-200 text-gray-900 p-3 rounded-lg mb-3 focus:outline-none focus:border-green-400"
          placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border border-gray-200 text-gray-900 p-3 rounded-lg mb-4 focus:outline-none focus:border-green-400"
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

        <button onClick={view === 'login' ? login : register}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold transition-all">
          {view === 'login' ? 'Login' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}