'use client'
import { useState, useEffect, useRef } from 'react'

const DEMO_API_KEY = 'geoapi_eCYiNC6YOH3yWlHCkK8OMOy7gf64pucn'
const API_BASE = 'https://geo-api-blond.vercel.app'

export default function DemoClient() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', message: '',
    village: '', subDistrict: '', district: '', state: '', country: 'India'
  })
  const [submitted, setSubmitted] = useState(false)
  const debounceRef = useRef<any>(null)

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return }
    
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/autocomplete?q=${encodeURIComponent(query)}`, {
          headers: { 'x-api-key': DEMO_API_KEY }
        })
        const data = await res.json()
        if (data.success) setSuggestions(data.data)
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }, 300)
  }, [query])

  function selectVillage(item: any) {
    setSelected(item)
    setQuery(item.label)
    setSuggestions([])
    setFormData(prev => ({
      ...prev,
      village: item.hierarchy.village,
      subDistrict: item.hierarchy.subDistrict,
      district: item.hierarchy.district,
      state: item.hierarchy.state,
      country: 'India'
    }))
  }

  function handleSubmit() {
    if (!formData.fullName || !formData.email || !formData.village) {
      alert('Please fill all required fields and select a village')
      return
    }
    setSubmitted(true)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '48px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Form Submitted!</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your standardized address:</p>
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
          <p style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>📍 Full Address:</p>
          <p style={{ color: '#374151' }}>{formData.village}, {formData.subDistrict}, {formData.district}, {formData.state}, India</p>
        </div>
        <button onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', message: '', village: '', subDistrict: '', district: '', state: '', country: 'India' }); setQuery(''); setSelected(null) }}
          style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Another
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #f3f4f6', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>🌍 India Geo API — Demo</h1>
        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>
          DEMO MODE
        </span>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Address Autocomplete Demo
          </h2>
          <p style={{ color: '#6b7280' }}>
            Type a village name to see the API in action. All address fields auto-populate!
          </p>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          
          {/* Personal Info */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>
              Full Name *
            </label>
            <input
              style={{ width: '100%', border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>Email *</label>
              <input
                style={{ width: '100%', border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
                placeholder="email@example.com" type="email"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>Phone</label>
              <input
                style={{ width: '100%', border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>

          {/* Village Autocomplete */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>
              🔍 Village / Area Name * <span style={{ color: '#16a34a', fontSize: '12px' }}>(powered by India Geo API)</span>
            </label>
            <input
              style={{ width: '100%', border: '2px solid #16a34a', padding: '10px 14px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
              placeholder="Start typing village name (min 2 chars)..."
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(null) }} />
            
            {loading && (
              <div style={{ position: 'absolute', right: '12px', top: '38px', color: '#16a34a', fontSize: '12px' }}>
                Searching...
              </div>
            )}

            {suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                {suggestions.map((item: any, i: number) => (
                  <div key={i} onClick={() => selectVillage(item)}
                    style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f9fafb', fontSize: '14px' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                    <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>{item.label}</p>
                    <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{item.fullAddress}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auto-filled address fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {[
              { label: 'Sub-District', key: 'subDistrict' },
              { label: 'District', key: 'district' },
              { label: 'State', key: 'state' },
              { label: 'Country', key: 'country' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>{field.label}</label>
                <input
                  readOnly
                  style={{ width: '100%', border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f9fafb', color: '#6b7280', boxSizing: 'border-box', fontSize: '14px' }}
                  value={(formData as any)[field.key]}
                  placeholder="Auto-filled" />
              </div>
            ))}
          </div>

          {/* Message */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' }}>Message</label>
            <textarea
              style={{ width: '100%', border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px', height: '80px', resize: 'none' }}
              placeholder="Your message..."
              value={formData.message}
              onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} />
          </div>

          <button onClick={handleSubmit}
            style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', border: 'none' }}>
            Submit Form
          </button>
        </div>

        {/* API Info */}
        <div style={{ marginTop: '24px', backgroundColor: '#111827', padding: '16px', borderRadius: '8px' }}>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>API Call being made:</p>
          <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '13px' }}>
            GET /api/autocomplete?q={query || 'village_name'}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>
            Returns village + full hierarchy in one call ⚡
          </p>
        </div>
      </div>
    </div>
  )
}