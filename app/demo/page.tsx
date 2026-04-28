'use client'
import { useState, useEffect, useRef } from 'react'

const DEMO_API_KEY = 'geoapi_eCYiNC6YOH3yWlHCkK8OMOy7gf64pucn'
const API_BASE = 'https://geo-api-blond.vercel.app'

export default function DemoClient() {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', message: '' })
  const [mode, setMode] = useState<'hierarchy'|'search'>('hierarchy')

  // Hierarchy mode
  const [states, setStates] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [subdistricts, setSubdistricts] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('')
  const [selectedVillage, setSelectedVillage] = useState('')

  // Search mode
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searching, setSearching] = useState(false)

  const [loading, setLoading] = useState({ states: false, districts: false, subdistricts: false, villages: false })
  const [submitted, setSubmitted] = useState(false)
  const debounceRef = useRef<any>(null)
  const headers = { 'x-api-key': DEMO_API_KEY }

  // Load states
  useEffect(() => {
    setLoading(p => ({ ...p, states: true }))
    fetch(`${API_BASE}/api/states`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setStates(d.data) })
      .finally(() => setLoading(p => ({ ...p, states: false })))
  }, [])

  // Load districts
  useEffect(() => {
    if (!selectedState) { setDistricts([]); setSubdistricts([]); setVillages([]); setSelectedDistrict(''); setSelectedSubDistrict(''); setSelectedVillage(''); return }
    setLoading(p => ({ ...p, districts: true }))
    setSelectedDistrict(''); setSelectedSubDistrict(''); setSelectedVillage(''); setSubdistricts([]); setVillages([])
    fetch(`${API_BASE}/api/districts?state_code=${selectedState}`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setDistricts(d.data) })
      .finally(() => setLoading(p => ({ ...p, districts: false })))
  }, [selectedState])

  // Load sub-districts
  useEffect(() => {
    if (!selectedDistrict) { setSubdistricts([]); setVillages([]); setSelectedSubDistrict(''); setSelectedVillage(''); return }
    setLoading(p => ({ ...p, subdistricts: true }))
    setSelectedSubDistrict(''); setSelectedVillage(''); setVillages([])
    fetch(`${API_BASE}/api/subdistricts?district_code=${selectedDistrict}&state_code=${selectedState}`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setSubdistricts(d.data) })
      .finally(() => setLoading(p => ({ ...p, subdistricts: false })))
  }, [selectedDistrict])

  // Load villages from specific sub-district (FAST - filtered)
  useEffect(() => {
    if (!selectedSubDistrict) { setVillages([]); setSelectedVillage(''); return }
    setLoading(p => ({ ...p, villages: true }))
    setSelectedVillage('')
    fetch(`${API_BASE}/api/villages?sub_district_code=${selectedSubDistrict}&district_code=${selectedDistrict}&state_code=${selectedState}`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setVillages(d.data) })
      .finally(() => setLoading(p => ({ ...p, villages: false })))
  }, [selectedSubDistrict])

  // Direct village search (debounced)
  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const res = await fetch(`${API_BASE}/api/autocomplete?q=${encodeURIComponent(searchQuery)}`, { headers })
      const data = await res.json()
      if (data.success) setSuggestions(data.data)
      setSearching(false)
    }, 300)
  }, [searchQuery])

  function selectFromSearch(item: any) {
    setSearchResult(item)
    setSearchQuery(item.label)
    setSuggestions([])
  }

  const stateName = states.find(s => s.code === selectedState)?.name || ''
  const districtName = districts.find(d => d.code === selectedDistrict)?.name || ''
  const subdistrictName = subdistricts.find(s => s.code === selectedSubDistrict)?.name || ''
  const villageName = villages.find(v => v.code === selectedVillage)?.name || ''

  const isAddressComplete = mode === 'hierarchy'
    ? (selectedVillage !== '')
    : (searchResult !== null)

  const fullAddress = mode === 'hierarchy'
    ? `${villageName}, ${subdistrictName}, ${districtName}, ${stateName}, India`
    : searchResult?.fullAddress || ''

  function handleSubmit() {
    if (!formData.fullName || !formData.email || !isAddressComplete) {
      alert('Please fill name, email and complete address selection')
      return
    }
    setSubmitted(true)
  }

  function reset() {
    setSubmitted(false)
    setFormData({ fullName: '', email: '', phone: '', message: '' })
    setSelectedState(''); setSelectedDistrict(''); setSelectedSubDistrict(''); setSelectedVillage('')
    setSearchQuery(''); setSearchResult(null)
  }

  const inputStyle: any = { width: '100%', border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px', backgroundColor: 'white' }
  const labelStyle: any = { display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' }
  const disabledStyle: any = { ...inputStyle, backgroundColor: '#f9fafb', color: '#9ca3af', cursor: 'not-allowed' }

  if (submitted) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '48px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '500px', width: '90%' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Form Submitted!</h2>
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
          <p style={{ fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>👤 {formData.fullName}</p>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>📧 {formData.email}</p>
          {formData.phone && <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>📱 {formData.phone}</p>}
          <div style={{ borderTop: '1px solid #d1fae5', paddingTop: '8px', marginTop: '8px' }}>
            <p style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '4px', fontSize: '13px' }}>📍 Standardized Address:</p>
            <p style={{ color: '#374151', fontSize: '14px', fontWeight: '600' }}>{fullAddress}</p>
          </div>
        </div>
        <button onClick={reset} style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Another
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #f3f4f6', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>🌍 India Geo API — Demo</h1>
        <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }}>DEMO MODE</span>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 16px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Address Autocomplete Demo</h2>
          <p style={{ color: '#6b7280' }}>Powered by India Geo API — 619,246 villages across India</p>
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

          {/* Address Section */}
          <div style={{ borderTop: '2px solid #f0fdf4', paddingTop: '24px', marginBottom: '24px' }}>
            <p style={{ fontWeight: '700', color: '#16a34a', marginBottom: '16px', fontSize: '15px' }}>
              📍 Address Selection
            </p>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
              <button onClick={() => { setMode('hierarchy'); setSearchQuery(''); setSearchResult(null); setSuggestions([]) }}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: mode === 'hierarchy' ? 'white' : 'transparent', color: mode === 'hierarchy' ? '#16a34a' : '#6b7280', boxShadow: mode === 'hierarchy' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                🗺️ I know my State/District
              </button>
              <button onClick={() => { setMode('search'); setSelectedState(''); setSelectedDistrict(''); setSelectedSubDistrict(''); setSelectedVillage('') }}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: mode === 'search' ? 'white' : 'transparent', color: mode === 'search' ? '#16a34a' : '#6b7280', boxShadow: mode === 'search' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                🔍 Search by Village Name
              </button>
            </div>

            {mode === 'hierarchy' && (
              <>
                {/* State */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>State *</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                    <option value="">{loading.states ? 'Loading...' : '— Select State —'}</option>
                    {states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </div>

                {/* District */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>District *</label>
                  <select style={selectedState ? { ...inputStyle, cursor: 'pointer' } : disabledStyle}
                    value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedState}>
                    <option value="">{loading.districts ? 'Loading...' : selectedState ? '— Select District —' : '← Select State first'}</option>
                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                  </select>
                </div>

                {/* Sub-District */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Sub-District *</label>
                  <select style={selectedDistrict ? { ...inputStyle, cursor: 'pointer' } : disabledStyle}
                    value={selectedSubDistrict} onChange={e => setSelectedSubDistrict(e.target.value)} disabled={!selectedDistrict}>
                    <option value="">{loading.subdistricts ? 'Loading...' : selectedDistrict ? '— Select Sub-District —' : '← Select District first'}</option>
                    {subdistricts.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </div>

                {/* Village - filtered to sub-district only */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>
                    Village * 
                    {villages.length > 0 && <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'normal', marginLeft: '8px' }}>({villages.length} villages found)</span>}
                  </label>
                  <select style={selectedSubDistrict ? { ...inputStyle, cursor: 'pointer' } : disabledStyle}
                    value={selectedVillage} onChange={e => setSelectedVillage(e.target.value)} disabled={!selectedSubDistrict}>
                    <option value="">{loading.villages ? 'Loading villages...' : selectedSubDistrict ? '— Select Village —' : '← Select Sub-District first'}</option>
                    {villages.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label style={labelStyle}>Country</label>
                  <input style={disabledStyle} value="India" readOnly />
                </div>
              </>
            )}

            {mode === 'search' && (
              <>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <label style={labelStyle}>
                    Search Village Name *
                    <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'normal', marginLeft: '8px' }}>
                      (type min 2 characters)
                    </span>
                  </label>
                  <input
                    style={{ ...inputStyle, border: '2px solid #16a34a' }}
                    placeholder="e.g. Aluva, Thrissur, Manali..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setSearchResult(null) }} />
                  {searching && (
                    <div style={{ position: 'absolute', right: '12px', top: '38px', color: '#16a34a', fontSize: '12px' }}>⏳ Searching...</div>
                  )}
                  {suggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 100, maxHeight: '250px', overflowY: 'auto' }}>
                      {suggestions.map((item: any, i: number) => (
                        <div key={i} onClick={() => selectFromSearch(item)}
                          style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f9fafb' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                          <p style={{ fontWeight: '700', color: '#111827', margin: '0 0 2px', fontSize: '14px' }}>{item.label}</p>
                          <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{item.fullAddress}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auto-filled fields */}
                {searchResult && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Sub-District', value: searchResult.hierarchy.subDistrict },
                      { label: 'District', value: searchResult.hierarchy.district },
                      { label: 'State', value: searchResult.hierarchy.state },
                      { label: 'Country', value: 'India' },
                    ].map(f => (
                      <div key={f.label}>
                        <label style={{ ...labelStyle, color: '#9ca3af' }}>{f.label} (auto-filled)</label>
                        <input style={{ ...disabledStyle, color: '#374151', fontWeight: '600' }} value={f.value} readOnly />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Address Preview */}
          {isAddressComplete && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{ color: '#16a34a', fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>✅ Selected Address:</p>
              <p style={{ color: '#374151', fontSize: '13px', margin: 0 }}>{fullAddress}</p>
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
            style={{ width: '100%', backgroundColor: isAddressComplete && formData.fullName && formData.email ? '#16a34a' : '#9ca3af', color: 'white', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: isAddressComplete ? 'pointer' : 'not-allowed', border: 'none' }}>
            Submit Form
          </button>
        </div>

        {/* API Info */}
        <div style={{ marginTop: '24px', backgroundColor: '#111827', padding: '16px', borderRadius: '8px' }}>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>APIs being called:</p>
          {mode === 'hierarchy' ? (
            <>
              <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', marginBottom: '4px' }}>GET /api/states</p>
              <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', marginBottom: '4px' }}>GET /api/districts?state_code={selectedState || 'XX'}</p>
              <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', marginBottom: '4px' }}>GET /api/subdistricts?district_code={selectedDistrict || 'XX'}</p>
              <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px' }}>GET /api/villages?sub_district_code={selectedSubDistrict || 'XX'} ⚡ Filtered!</p>
            </>
          ) : (
            <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px' }}>GET /api/autocomplete?q={searchQuery || 'village_name'} ⚡ Fast search!</p>
          )}
        </div>
      </div>
    </div>
  )
}