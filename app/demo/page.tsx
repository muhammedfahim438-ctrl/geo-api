'use client'
import { useState, useEffect, useRef } from 'react'

const DEMO_API_KEY = 'geoapi_eCYiNC6YOH3yWlHCkK8OMOy7gf64pucn'
const API_BASE = 'https://geo-api-blond.vercel.app'

export default function DemoClient() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', message: ''
  })

  const [states, setStates] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [subdistricts, setSubdistricts] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])

  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('')
  const [selectedVillage, setSelectedVillage] = useState<any>(null)

  const [villageQuery, setVillageQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState({ states: false, districts: false, subdistricts: false, villages: false, search: false })
  const [submitted, setSubmitted] = useState(false)
  const debounceRef = useRef<any>(null)

  const headers = { 'x-api-key': DEMO_API_KEY }

  // Load states on mount
  useEffect(() => {
    setLoading(p => ({ ...p, states: true }))
    fetch(`${API_BASE}/api/states`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setStates(d.data) })
      .finally(() => setLoading(p => ({ ...p, states: false })))
  }, [])

  // Load districts when state changes
  useEffect(() => {
    if (!selectedState) { setDistricts([]); setSubdistricts([]); setVillages([]); return }
    setLoading(p => ({ ...p, districts: true }))
    setSelectedDistrict(''); setSelectedSubDistrict(''); setSelectedVillage(null)
    fetch(`${API_BASE}/api/districts?state_code=${selectedState}`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setDistricts(d.data) })
      .finally(() => setLoading(p => ({ ...p, districts: false })))
  }, [selectedState])

  // Load subdistricts when district changes
  useEffect(() => {
    if (!selectedDistrict) { setSubdistricts([]); setVillages([]); return }
    setLoading(p => ({ ...p, subdistricts: true }))
    setSelectedSubDistrict(''); setSelectedVillage(null)
    fetch(`${API_BASE}/api/subdistricts?district_code=${selectedDistrict}&state_code=${selectedState}`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setSubdistricts(d.data) })
      .finally(() => setLoading(p => ({ ...p, subdistricts: false })))
  }, [selectedDistrict])

  // Village search autocomplete
  useEffect(() => {
    if (villageQuery.length < 2) { setSuggestions([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(p => ({ ...p, search: true }))
      const url = selectedSubDistrict
        ? `${API_BASE}/api/autocomplete?q=${encodeURIComponent(villageQuery)}`
        : `${API_BASE}/api/autocomplete?q=${encodeURIComponent(villageQuery)}`
      const res = await fetch(url, { headers })
      const data = await res.json()
      if (data.success) setSuggestions(data.data)
      setLoading(p => ({ ...p, search: false }))
    }, 300)
  }, [villageQuery])

  function selectVillage(item: any) {
    setSelectedVillage(item)
    setVillageQuery(item.label)
    setSuggestions([])
  }

  const stateName = states.find(s => s.code === selectedState)?.name || ''
  const districtName = districts.find(d => d.code === selectedDistrict)?.name || ''
  const subdistrictName = subdistricts.find(s => s.code === selectedSubDistrict)?.name || ''

  function handleSubmit() {
    if (!formData.fullName || !formData.email || !selectedVillage) {
      alert('Please fill all required fields and select a village')
      return
    }
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%', border: '1px solid #e5e7eb', padding: '10px 14px',
    borderRadius: '8px', outline: 'none', boxSizing: 'border-box' as const,
    fontSize: '14px', backgroundColor: 'white'
  }

  const labelStyle = {
    display: 'block', fontWeight: '600' as const, color: '#374151',
    marginBottom: '6px', fontSize: '14px'
  }

  const selectStyle = {
    ...inputStyle, cursor: 'pointer', appearance: 'auto' as const
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '48px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '500px', width: '90%' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Form Submitted!</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Your standardized address:</p>
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', padding: '16px', borderRadius: '8px', marginBottom: '16px', textAlign: 'left' }}>
          <p style={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>👤 {formData.fullName}</p>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>📧 {formData.email}</p>
          {formData.phone && <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>📱 {formData.phone}</p>}
          <p style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>📍 Full Address:</p>
          <p style={{ color: '#374151', fontSize: '14px' }}>
            {selectedVillage?.label}, {subdistrictName}, {districtName}, {stateName}, India
          </p>
        </div>
        <button onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', message: '' }); setSelectedState(''); setSelectedVillage(null); setVillageQuery('') }}
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
        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>DEMO MODE</span>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 16px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Address Autocomplete Demo</h2>
          <p style={{ color: '#6b7280' }}>Select your location step by step — powered by India Geo API</p>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>

          {/* Personal Info */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle} placeholder="Enter your full name"
              value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} type="email" placeholder="email@example.com"
                value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} placeholder="+91 XXXXX XXXXX"
                value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid #f3f4f6', marginBottom: '24px', paddingTop: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#16a34a', marginBottom: '16px' }}>
              📍 Address — Powered by India Geo API
            </p>

            {/* State */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>State *</label>
              <select style={selectStyle} value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                <option value="">{loading.states ? 'Loading states...' : 'Select State'}</option>
                {states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            </div>

            {/* District */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>District *</label>
              <select style={{ ...selectStyle, backgroundColor: !selectedState ? '#f9fafb' : 'white' }}
                value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedState}>
                <option value="">{loading.districts ? 'Loading...' : selectedState ? 'Select District' : 'Select State first'}</option>
                {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
              </select>
            </div>

            {/* Sub-District */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Sub-District *</label>
              <select style={{ ...selectStyle, backgroundColor: !selectedDistrict ? '#f9fafb' : 'white' }}
                value={selectedSubDistrict} onChange={e => setSelectedSubDistrict(e.target.value)} disabled={!selectedDistrict}>
                <option value="">{loading.subdistricts ? 'Loading...' : selectedDistrict ? 'Select Sub-District' : 'Select District first'}</option>
                {subdistricts.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            </div>

            {/* Village Search */}
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <label style={labelStyle}>
                Village / Area Name * 
                <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'normal', marginLeft: '8px' }}>
                  (type to search)
                </span>
              </label>
              <input
                style={{ ...inputStyle, border: '2px solid #16a34a' }}
                placeholder="Type village name to search..."
                value={villageQuery}
                onChange={e => { setVillageQuery(e.target.value); setSelectedVillage(null) }} />

              {loading.search && (
                <div style={{ position: 'absolute', right: '12px', top: '36px', color: '#16a34a', fontSize: '12px' }}>Searching...</div>
              )}

              {suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '220px', overflowY: 'auto' }}>
                  {suggestions.map((item: any, i: number) => (
                    <div key={i} onClick={() => selectVillage(item)}
                      style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f9fafb' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                      <p style={{ fontWeight: '600', color: '#111827', margin: 0, fontSize: '14px' }}>{item.label}</p>
                      <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{item.fullAddress}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auto-filled Country */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Country</label>
              <input style={{ ...inputStyle, backgroundColor: '#f9fafb', color: '#6b7280' }} value="India" readOnly />
            </div>
          </div>

          {/* Selected Address Preview */}
          {selectedVillage && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ color: '#16a34a', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>✅ Selected Address:</p>
              <p style={{ color: '#374151', fontSize: '13px' }}>{selectedVillage.fullAddress}</p>
            </div>
          )}

          {/* Message */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Message</label>
            <textarea style={{ ...inputStyle, height: '80px', resize: 'none' }}
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
          <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>APIs being used:</p>
          <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', marginBottom: '4px' }}>GET /api/states</p>
          <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', marginBottom: '4px' }}>GET /api/districts?state_code=XX</p>
          <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', marginBottom: '4px' }}>GET /api/subdistricts?district_code=XX</p>
          <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px' }}>GET /api/autocomplete?q={villageQuery || 'village'}</p>
        </div>
      </div>
    </div>
  )
}