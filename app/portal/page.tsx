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
    if (data.success) { setView('login'); setError('✅ Account created! Please login.') }
    else setError(data.error)
  }

  async function login() {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.success) { setToken(data.token); setUser(data.user); setApiKeys(data.api_keys); setView('dashboard') }
    else setError(data.error)
  }

  async function createKey() {
    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ plan })
      })
      const orderData = await orderRes.json()
      if (!orderData.success) { alert('Failed to create order: ' + orderData.error); return }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount, currency: 'INR',
          name: 'India Geo API', description: planName,
          order_id: orderData.order_id,
          handler: async (response: any) => {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ ...response, plan })
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) { alert(`✅ Upgraded to ${planName}!`); setUser({ ...user, plan }) }
          },
          prefill: { email: user?.email },
          theme: { color: '#7828c8' }
        }
        new (window as any).Razorpay(options).open()
      }
    } catch { alert('Payment failed. Please try again.') }
  }

  const planLimits: Record<string, number> = { free: 5000, premium: 50000, pro: 300000, unlimited: 1000000 }
  const planColors: Record<string, string> = { free: '#10b981', premium: '#3b82f6', pro: '#a855f7', unlimited: '#f59e0b' }

  const glassStyle: any = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
  }

  const inputStyle: any = {
    width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px',
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
    color: 'white', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  }

  if (view === 'dashboard') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: 'white', fontFamily: 'Arial, sans-serif' }}>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .glass-card:hover { background: rgba(255,255,255,0.08) !important; transform: translateY(-2px); transition: all 0.3s !important; }
        @media(max-width:768px){ .dash-grid{grid-template-columns:1fr!important} .plan-grid{grid-template-columns:1fr!important} }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(120,40,200,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0, animation: 'float 6s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(0,150,255,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0, animation: 'float 8s ease-in-out infinite reverse' }} />

      {/* Navbar */}
      <nav style={{ ...glassStyle, position: 'sticky', top: 0, zIndex: 100, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #7828c8, #0096ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌍</div>
          <span style={{ fontWeight: 'bold', fontSize: '16px', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>India Geo API</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{user?.email}</span>
          <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', background: `${planColors[user?.plan]}30`, color: planColors[user?.plan], border: `1px solid ${planColors[user?.plan]}50` }}>
            {user?.plan?.toUpperCase()}
          </span>
          <button onClick={() => setView('login')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px 80px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', background: 'linear-gradient(135deg, #ffffff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '32px', fontSize: '14px' }}>Manage your API keys and subscription</p>

        {/* Stats Row */}
        <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Daily Limit', value: planLimits[user?.plan]?.toLocaleString(), suffix: 'req/day', color: planColors[user?.plan] },
            { label: 'Total Requests', value: apiKeys.reduce((a, k) => a + (k.requests_total || 0), 0).toLocaleString(), suffix: 'all time', color: '#3b82f6' },
            { label: 'API Keys', value: apiKeys.length, suffix: 'active', color: '#06b6d4' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ ...glassStyle, padding: '20px', borderRadius: '16px', transition: 'all 0.3s' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '8px' }}>{s.label}</p>
              <p style={{ fontSize: '28px', fontWeight: '800', color: s.color, margin: '0 0 2px' }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>{s.suffix}</p>
            </div>
          ))}
        </div>

        {/* Plan Info */}
        <div style={{ ...glassStyle, borderRadius: '16px', padding: '20px', marginBottom: '24px', background: `${planColors[user?.plan]}10`, border: `1px solid ${planColors[user?.plan]}30` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px' }}>Current Plan</p>
              <p style={{ fontSize: '20px', fontWeight: '700', color: planColors[user?.plan], margin: 0 }}>{user?.plan?.toUpperCase()} Plan</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '4px' }}>Base URL</p>
              <p style={{ fontFamily: 'monospace', color: '#4ade80', fontSize: '13px', margin: 0 }}>geo-api-blond.vercel.app</p>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div style={{ ...glassStyle, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>🔑 API Keys</h2>
            <button onClick={createKey} style={{ background: 'linear-gradient(135deg, #7828c8, #0096ff)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>+ New Key</button>
          </div>
          {apiKeys.map((key: any) => (
            <div key={key.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <p style={{ fontWeight: '700', margin: '0 0 4px', fontSize: '15px' }}>{key.name}</p>
                  <p style={{ fontFamily: 'monospace', color: '#4ade80', fontSize: '13px', margin: 0, background: 'rgba(74,222,128,0.1)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block' }}>{key.key_value}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button onClick={() => copyKey(key.key_value)} style={{ background: copied === key.key_value ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: copied === key.key_value ? '#4ade80' : 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginBottom: '4px', display: 'block' }}>
                    {copied === key.key_value ? '✅ Copied!' : '📋 Copy'}
                  </button>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: 0 }}>Today: {key.requests_today} | Total: {key.requests_total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div style={{ ...glassStyle, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>⚡ Quick Start</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '10px' }}>Get all states:</p>
          <div style={{ background: '#0d1117', borderRadius: '10px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <pre style={{ color: '#4ade80', fontSize: '13px', fontFamily: 'monospace', margin: 0, overflowX: 'auto' }}>{`fetch('https://geo-api-blond.vercel.app/api/states', {
  headers: { 'x-api-key': '${apiKeys[0]?.key_value || 'YOUR_API_KEY'}' }
})`}</pre>
          </div>
        </div>

        {/* Upgrade Plans */}
        <div style={{ ...glassStyle, borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>💳 Upgrade Plan</h2>
          <div className="plan-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { plan: 'premium', name: 'Premium', price: '₹99/mo', amount: 9900, requests: '50,000/day', color: '#3b82f6' },
              { plan: 'pro', name: 'Pro', price: '₹299/mo', amount: 29900, requests: '3,00,000/day', color: '#a855f7' },
              { plan: 'unlimited', name: 'Unlimited', price: '₹999/mo', amount: 99900, requests: 'Unlimited', color: '#f59e0b' },
            ].map(p => (
              <div key={p.plan} style={{ background: user?.plan === p.plan ? `${p.color}15` : 'rgba(255,255,255,0.04)', border: `1px solid ${user?.plan === p.plan ? p.color : 'rgba(255,255,255,0.1)'}`, borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: p.color, marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: '0 0 4px' }}>{p.price}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '16px' }}>{p.requests}</p>
                {user?.plan === p.plan ? (
                  <p style={{ color: p.color, fontWeight: '700', fontSize: '13px' }}>✅ Current Plan</p>
                ) : (
                  <button onClick={() => handlePayment(p.plan, p.amount, p.name)}
                    style={{ width: '100%', background: `linear-gradient(135deg, ${p.color}80, ${p.color})`, border: 'none', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
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
    <div style={{ minHeight: '100vh', backgroundColor: '#050816', color: 'white', fontFamily: 'Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(120,40,200,0.4)} 50%{box-shadow:0 0 40px rgba(0,150,255,0.6)} }
        input:focus { border-color: rgba(120,40,200,0.6) !important; box-shadow: 0 0 0 3px rgba(120,40,200,0.2) !important; }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', top: '15%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(120,40,200,0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', animation: 'float 6s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '10%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(0,150,255,0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite reverse' }} />

      <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.6s ease forwards' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #7828c8, #0096ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(120,40,200,0.4)' }}>🌍</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>India Geo API</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>619,246 villages across India</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', animation: 'glow 4s ease-in-out infinite' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
            {(['login', 'register'] as const).map(v => (
              <button key={v} onClick={() => { setView(v); setError('') }}
                style={{ flex: 1, padding: '8px', borderRadius: '7px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', background: view === v ? 'linear-gradient(135deg, #7828c8, #0096ff)' : 'transparent', color: view === v ? 'white' : 'rgba(255,255,255,0.5)' }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', background: error.startsWith('✅') ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)', border: `1px solid ${error.startsWith('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`, color: error.startsWith('✅') ? '#10b981' : '#f43f5e' }}>
              {error}
            </div>
          )}

          {view === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Company Name</label>
              <input style={inputStyle} placeholder="Your company name" value={company} onChange={e => setCompany(e.target.value)} />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Email</label>
            <input style={inputStyle} placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>Password</label>
            <input style={inputStyle} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button onClick={view === 'login' ? login : register}
            style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: '700', cursor: 'pointer', background: 'linear-gradient(135deg, #7828c8, #0096ff)', color: 'white', boxShadow: '0 8px 24px rgba(120,40,200,0.4)', transition: 'all 0.3s' }}>
            {view === 'login' ? '🚀 Login' : '✨ Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}