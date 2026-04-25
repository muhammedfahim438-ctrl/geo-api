'use client'
import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ total_users: 0, total_requests: 0 })
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState('')

  async function login() {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.success && data.user.is_admin) {
      setToken(data.token)
      setLoggedIn(true)
      loadUsers(data.token)
    } else {
      setError('Invalid admin credentials')
    }
  }

  async function loadUsers(t: string) {
    const res = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${t}` }
    })
    const data = await res.json()
    if (data.success) {
      setUsers(data.data)
      setStats(data.stats)
    }
  }

  if (!loggedIn) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-96">
        <h1 className="text-2xl font-bold text-white mb-6">🔐 Admin Login</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <input className="w-full bg-gray-700 text-white p-3 rounded mb-3" 
          placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full bg-gray-700 text-white p-3 rounded mb-4" 
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-bold">
          Login
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🌍 India Geo API — Admin Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400">Total Users</p>
          <p className="text-4xl font-bold text-blue-400">{stats.total_users}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400">Total API Requests</p>
          <p className="text-4xl font-bold text-green-400">{stats.total_requests}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400">Villages in DB</p>
          <p className="text-4xl font-bold text-purple-400">457,290</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">B2B Users</h2>
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 text-left border-b border-gray-700">
              <th className="pb-3">Email</th>
              <th className="pb-3">Company</th>
              <th className="pb-3">Plan</th>
              <th className="pb-3">Total Requests</th>
              <th className="pb-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="py-3">{user.email}</td>
                <td className="py-3">{user.company_name}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    user.plan === 'pro' ? 'bg-purple-600' :
                    user.plan === 'premium' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>{user.plan?.toUpperCase()}</span>
                </td>
                <td className="py-3">{user.total_requests || 0}</td>
                <td className="py-3">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}