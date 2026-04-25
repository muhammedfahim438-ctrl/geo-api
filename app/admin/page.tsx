'use client'
import { useState } from 'react'

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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="bg-white border border-gray-100 shadow-lg p-8 rounded-2xl w-96">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">🔐 Admin Login</h1>
        <p className="text-gray-400 text-sm mb-6">India Geo API — Admin Panel</p>
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <input className="w-full border border-gray-200 text-gray-900 p-3 rounded-lg mb-3 focus:outline-none focus:border-green-400"
          placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border border-gray-200 text-gray-900 p-3 rounded-lg mb-4 focus:outline-none focus:border-green-400"
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login} className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold">
          Login to Admin
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600">🌍 India Geo API — Admin</h1>
        <button onClick={() => setLoggedIn(false)} className="text-gray-400 hover:text-red-500 text-sm">Logout</button>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-green-100 p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-4xl font-bold text-green-600 mt-1">{stats.total_users}</p>
          </div>
          <div className="bg-white border border-green-100 p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Total API Requests</p>
            <p className="text-4xl font-bold text-green-600 mt-1">{stats.total_requests}</p>
          </div>
          <div className="bg-white border border-green-100 p-6 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Villages in DB</p>
            <p className="text-4xl font-bold text-green-600 mt-1">457,290</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">B2B Users</h3>
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-left border-b border-gray-100 text-sm">
                <th className="pb-3">Email</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Total Requests</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-green-50 transition-all">
                  <td className="py-3 text-gray-900">{user.email}</td>
                  <td className="py-3 text-gray-600">{user.company_name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                      user.plan === 'pro' ? 'bg-purple-500' :
                      user.plan === 'premium' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>{user.plan?.toUpperCase()}</span>
                  </td>
                  <td className="py-3 text-gray-600">{user.total_requests || 0}</td>
                  <td className="py-3 text-gray-400 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}