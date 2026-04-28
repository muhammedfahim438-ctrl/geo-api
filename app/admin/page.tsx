'use client'
import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState<any>({ total_users: 0, total_requests: 0 })
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

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

  async function upgradePlan(userId: number, plan: string) {
    const res = await fetch('/api/admin/update-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, plan })
    })
    const data = await res.json()
    if (data.success) {
      loadUsers(token)
      alert(`✅ Plan updated to ${plan}!`)
    }
  }

  // Chart data
  const planData = [
    { name: 'Free', value: users.filter(u => u.plan === 'free').length, color: '#22c55e' },
    { name: 'Premium', value: users.filter(u => u.plan === 'premium').length, color: '#3b82f6' },
    { name: 'Pro', value: users.filter(u => u.plan === 'pro').length, color: '#a855f7' },
    { name: 'Unlimited', value: users.filter(u => u.plan === 'unlimited').length, color: '#f59e0b' },
  ]

  const requestsData = users.slice(0, 10).map(u => ({
    name: u.email.split('@')[0],
    requests: parseInt(u.total_requests) || 0
  }))

  const weekData = [
    { day: 'Mon', requests: 120 },
    { day: 'Tue', requests: 245 },
    { day: 'Wed', requests: 180 },
    { day: 'Thu', requests: 320 },
    { day: 'Fri', requests: 290 },
    { day: 'Sat', requests: 150 },
    { day: 'Sun', requests: 90 },
  ]

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0fdf4, white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '32px', borderRadius: '16px', width: '384px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>🔐 Admin Login</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>India Geo API — Admin Panel</p>
        {error && <p style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
        <input style={{ width: '100%', border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}
          placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={{ width: '100%', border: '1px solid #e5e7eb', padding: '12px', borderRadius: '8px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }}
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={login} style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '16px' }}>
          Login to Admin
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #f3f4f6', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>🌍 India Geo API — Admin</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['overview', 'users', 'data'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', backgroundColor: activeTab === tab ? '#16a34a' : 'transparent', color: activeTab === tab ? 'white' : '#6b7280' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button onClick={() => setLoggedIn(false)} style={{ color: '#9ca3af', fontSize: '14px', cursor: 'pointer', border: 'none', background: 'none' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', paddingBottom: '80px' }}>

        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Users', value: stats.total_users, color: '#16a34a' },
                { label: 'Total API Requests', value: stats.total_requests, color: '#3b82f6' },
                { label: 'Villages in DB', value: '619,246', color: '#a855f7' },
                { label: 'States Covered', value: '30', color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>{s.label}</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Line Chart - API Requests */}
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>API Requests (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Plan Distribution */}
              <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
                <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Users by Plan</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={planData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {planData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart - Top Users */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #f3f4f6' }}>
              <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Top Users by API Requests</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={requestsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '16px', fontSize: '18px' }}>B2B Users Management</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                  {['Email', 'Company', 'Plan', 'Total Requests', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 8px', textAlign: 'left', color: '#6b7280', fontSize: '13px', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '12px 8px', color: '#111827', fontSize: '14px' }}>{user.email}</td>
                    <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '14px' }}>{user.company_name}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', color: 'white', backgroundColor: user.plan === 'pro' ? '#a855f7' : user.plan === 'premium' ? '#3b82f6' : user.plan === 'unlimited' ? '#f59e0b' : '#16a34a' }}>
                        {user.plan?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '14px' }}>{user.total_requests || 0}</td>
                    <td style={{ padding: '12px 8px', color: '#9ca3af', fontSize: '13px' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <select onChange={e => upgradePlan(user.id, e.target.value)} defaultValue={user.plan}
                        style={{ border: '1px solid #e5e7eb', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="pro">Pro</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'data' && (
          <div style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', padding: '24px', borderRadius: '12px' }}>
            <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '16px', fontSize: '18px' }}>📊 Database Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: '🏘️ Total Villages', value: '619,246' },
                { label: '🗺️ Total States', value: '30' },
                { label: '🏙️ Total Districts', value: '586' },
                { label: '📍 Total Sub-Districts', value: '5,764' },
              ].map(s => (
                <div key={s.label} style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', padding: '20px', borderRadius: '10px' }}>
                  <p style={{ fontSize: '16px', color: '#374151', marginBottom: '4px' }}>{s.label}</p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}