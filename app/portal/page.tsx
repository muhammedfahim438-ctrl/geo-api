'use client'
import { useState, useEffect } from 'react'

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
    if (data.success) {
      setApiKeys([...apiKeys, data.data])
    }
  }

  function copyKey(key: string) {
    navigator.clipboard.writeText(key)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const planLimits: Record<string, number> = {
    free: 100, premium: 10000, pro: 100000, unlimited: 999999
  }

  if (view === 'dashboard') return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🌍 India Geo API Portal</h1>
          <div className="text-right">
            <p className="text-gray-400">{user?.email}</p>
            <span className={`px-3 py-1 rounded text-sm font-bold ${
              user?.plan === 'pro' ? 'bg-purple-600' :
              user?.plan === 'premium' ? 'bg-blue-600' : 'bg-gray-600'
            }`}>{user?.plan?.toUpperCase()}</span>
          </div>
        </div>

        {/* Plan Info */}
        <div className="bg-gray-800 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-bold mb-2">Your Plan</h2>
          <p className="text-gray-400">Daily API Limit: <span className="text-white font-bold">{planLimits[user?.plan]?.toLocaleString()} requests/day</span></p>
          <p className="text-gray-400 mt-1">Base URL: <span className="text-green-400 font-mono">https://geo-api-blond.vercel.app</span></p>
        </div>

        {/* API Keys */}
        <div className="bg-gray-800 p-6 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">API Keys</h2>
            <button onClick={createKey} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold">
              + New Key
            </button>
          </div>
          {apiKeys.map((key: any) => (
            <div key={key.id} className="bg-gray-700 p-4 rounded-lg mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{key.name}</p>
                  <p className="font-mono text-green-400 text-sm">{key.key_value}</p>
                </div>
                <div className="text-right">
                  <button onClick={() => copyKey(key.key_value)} 
                    className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm mb-1 block">
                    {copied === key.key_value ? '✅ Copied!' : '📋 Copy'}
                  </button>
                  <p className="text-gray-400 text-xs">Today: {key.requests_today} | Total: {key.requests_total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Quick Start</h2>
          <p className="text-gray-400 mb-2">Get all states:</p>
          <pre className="bg-gray-900 p-3 rounded text-green-400 text-sm overflow-x-auto">
{`fetch('https://geo-api-blond.vercel.app/api/states', {
  headers: { 'x-api-key': '${apiKeys[0]?.key_value || 'YOUR_API_KEY'}' }
})`}
          </pre>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-96">
        <h1 className="text-2xl font-bold text-white mb-2">🌍 India Geo API</h1>
        <p className="text-gray-400 mb-6">457,290 villages across India</p>
        
        <div className="flex mb-6">
          <button onClick={() => { setView('login'); setError('') }}
            className={`flex-1 py-2 rounded-l ${view === 'login' ? 'bg-blue-600' : 'bg-gray-700'}`}>
            Login
          </button>
          <button onClick={() => { setView('register'); setError('') }}
            className={`flex-1 py-2 rounded-r ${view === 'register' ? 'bg-blue-600' : 'bg-gray-700'}`}>
            Register
          </button>
        </div>

        {error && <p className={`mb-4 text-sm ${error.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{error}</p>}

        {view === 'register' && (
          <input className="w-full bg-gray-700 text-white p-3 rounded mb-3" 
            placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} />
        )}
        <input className="w-full bg-gray-700 text-white p-3 rounded mb-3" 
          placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full bg-gray-700 text-white p-3 rounded mb-4" 
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        
        <button 
          onClick={view === 'login' ? login : register}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-bold">
          {view === 'login' ? 'Login' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}