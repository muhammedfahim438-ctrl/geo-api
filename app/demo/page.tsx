'use client'
import { useState, useEffect, useRef } from 'react'

const DEMO_API_KEY = 'geoapi_eCYiNC6YOH3yWlHCkK8OMOy7gf64pucn'
const API_BASE = 'https://geo-api-blond.vercel.app'

export default function DemoClient() {
  const [mode, setMode] = useState<'guided'|'search'>('guided')
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', message: '' })

  // Guided mode state
  const [states, setStates] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [subdistricts, setSubdistricts] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('')
  const [selectedVillage, setSelectedVillage] = useState('')

  // Search mode state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchSelected, setSearchSelected] = useState<any>(null)
  const [searching, setSearching] = useState(false)

  // Loading states
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingSubdistricts, setLoadingSubdistricts] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)

  const [submitted, setSubmitted] = useState(false)
  const debounceRef = useRef<any>(null)
  const headers = { 'x-api-key': DEMO_API_KEY }

  // Load states once
  useEffect(() => {
    fetch(`${API_BASE}/api/states`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setStates(d.data) })
  }, [])

  // Load districts when state changes
  useEffect(() => {
    if (!selectedState) { setDistricts([]); setSubdistricts([]); setVillages([]); setSelectedDistrict(''); setSelectedSubDistrict(''); setSelectedVillage(''); return }
    setLoadingDistricts(true)
    setSelectedDistrict(''); setSelectedSubDistrict(''); setSelectedVillage('')
    setSubdistricts([]); setVillages([])
    fetch(`${API_BASE}/api/districts?state_code=${selectedState}`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setDistricts(d.data) })
      .finally(() => setLoadingDistricts(false))
  }, [selectedState])

  // Load subdistricts when district changes
  useEffect(() => {
    if (!selectedDistrict) { setSubdistricts([]); setVillages([]); setSelectedSubDistrict(''); setSelectedVillage(''); return }
    setLoadingSubdistricts(true)
    setSelectedSubDistrict(''); setSelectedVillage(''); setVillages([])
    fetch(`${API_BASE}/api/subdistricts?district_code=${selectedDistrict}&state_code=${selectedState}`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setSubdistricts(d.data) })
      .finally(() => setLoadingSubdistricts(false))
  }, [selectedDistrict])

  // Load villages when subdistrict changes — FILTERED to that subdistrict only
  useEffect(() => {
    if (!selectedSubDistrict) { setVillages([]); setSelectedVillage(''); return }
    setLoadingVillages(true)
    setSelectedVillage('')
    fetch(`${API_BASE}/api/villages?sub_district_code=${selectedSubDistrict}&district_code=${selectedDistrict}&state_code=${selectedState}`, { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setVillages(d.data) })
      .finally(() => setLoadingVillages(false))
  }, [selectedSubDistrict])

  // Search mode — autocomplete by village name
  useEffect(() => {
    if (mode !== 'search') return
    if (searchQuery.length < 2) { setSearchResults([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const res = await fetch(`${API_BASE}/api/autocomplete?q=${encodeURIComponent(searchQuery)}`, { headers })
      const data = await res.json()
      if (data.success) setSearchResults(data.data)
      setSearching(false)
    }, 300)
  }, [searchQuery, mode])

  function selectSearchResult(item: any) {
    setSearchSelected(item)
    setSearchQuery(item.label)
    setSearchResults([])
  }

  const stateName = states.find(s => s.code === selectedState)?.name || ''
  const districtName = districts.find(d => d.code === selectedDistrict)?.name || ''
  const subdistrictName = subdistricts.find(s => s.code === selectedSubDistrict)?.name || ''
  const villageName = villages.find(v => v.code === selectedVillage)?.name || ''

  const isComplete = mode === 'guided'
    ? (selectedVillage && formData.fullName && formData.email)
    : (searchSelected && formData.fullName && formData.email)

  function handleSubmit() {
    if (!isComplete) { alert('Please fill all required fields and select a village'); return }
    setSubmitted(true)
  }

  const finalAddress = mode === 'guided'
    ? `${villageName}, ${subdistrictName}, ${districtName}, ${stateName}, India`
    : searchSelected?.fullAddress

  const inputStyle: any = { width: '100%', border: '1px solid #e5e7eb', padding: '10px 14px', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }
  const labelStyle: any = { display: 'block', fontWeight: '600', color: '#374151', marginBottom: '6px', fontSize: '14px' }
  const selectStyle: any = { ...inputStyle, cursor: 'pointer' }

  if (submitted) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '48px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '500px', width: '90%' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Form Submitted!</h2>
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', padding: '16px', borderRadius: '8px', marginBottom: '16px', textAlign: 'left' }}>
          <p style={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>👤 {formData.fullName}</p>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>📧 {formData.email}</p>
          {formData.phone && <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>📱 {formData.phone}</p>}
          <p style={{ fontWeight: 'bold', color: '#16a34a', marginBottom: '4px' }}>📍 Standardized Address:</p>
          <p style={{ color: '#374151', fontSize: '14px' }}>{finalAddress}</p>
        </div>
        <button onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', message: '' }); setSelectedState(''); setSearchSelected(null); setSearchQuery('') }}
          style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
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
          <p style={{ color: '#6b7280' }}>Choose how you want to enter your address</p>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
          <button onClick={() => { setMode('guided'); setSearchSelected(null); setSearchQuery('') }}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', backgroundColor: mode === 'guided' ? 'white' : 'transparent', color: mode === 'guided' ? '#16a34a' : '#6b7280', boxShadow: mode === 'guided' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
            📍 Select by Location
          </button>
          <button onClick={() => { setMode('search'); setSelectedState(''); setSelectedVillage('') }}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', backgroundColor: mode === 'search' ? 'white' : 'transparent', color: mode === 'search' ? '#16a34a' : '#6b7280', boxShadow: mode === 'search' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
            🔍 Search by Village Name
          </button>
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

          <div style={{ borderTop: '2px solid #f0fdf4', paddingTop: '24px', marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a', marginBottom: '16px' }}>
              📍 Address — Powered by India Geo API
            </p>

            {/* GUIDED MODE */}
            {mode === 'guided' && (
              <>
                {/* State */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>State *</label>
                  <select style={selectStyle} value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </div>

                {/* District */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>District *</label>
                  <select style={{ ...selectStyle, backgroundColor: !selectedState ? '#f9fafb' : 'white' }}
                    value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedState}>
                    <option value="">{loadingDistricts ? 'Loading...' : !selectedState ? 'Select State first' : 'Select District'}</option>
                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                  </select>
                </div>

                {/* Sub-District */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Sub-District *</label>
                  <select style={{ ...selectStyle, backgroundColor: !selectedDistrict ? '#f9fafb' : 'white' }}
                    value={selectedSubDistrict} onChange={e => setSelectedSubDistrict(e.target.value)} disabled={!selectedDistrict}>
                    <option value="">{loadingSubdistricts ? 'Loading...' : !selectedDistrict ? 'Select District first' : 'Select Sub-District'}</option>
                    {subdistricts.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </div>

                {/* Village — filtered dropdown */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>
                    Village *
                    {villages.length > 0 && <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 'normal', marginLeft: '8px' }}>({villages.length} villages found)</span>}
                  </label>
                  <select style={{ ...selectStyle, backgroundColor: !selectedSubDistrict ? '#f9fafb' : 'white' }}
                    value={selectedVillage} onChange={e => setSelectedVillage(e.target.value)} disabled={!selectedSubDistrict}>
                    <option value="">{loadingVillages ? 'Loading villages...' : !selectedSubDistrict ? 'Select Sub-District first' : 'Select Village'}</option>
                    {villages.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
                  </select>
                </div>

                {/* Country */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Country</label>
                  <input style={{ ...inputStyle, backgroundColor: '#f9fafb', color: '#6b7280' }} value="India" readOnly />
                </div>

                {/* Address preview */}
                {selectedVillage && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', padding: '12px 16px', borderRadius: '8px', marginTop: '8px' }}>
                    <p style={{ color: '#16a34a', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>✅ Selected Address:</p>
                    <p style={{ color: '#374151', fontSize: '13px' }}>{villageName}, {subdistrictName}, {districtName}, {stateName}, India</p>
                  </div>
                )}
              </>
            )}

            {/* SEARCH MODE */}
            {mode === 'search' && (
              <>
                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ color: '#92400e', fontSize: '13px', margin: 0 }}>
                    💡 Type your village name below — district, sub-district and state will auto-fill!
                  </p>
                </div>

                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <label style={labelStyle}>Village / Area Name *</label>
                  <input
                    style={{ ...inputStyle, border: '2px solid #16a34a' }}
                    placeholder="Type village name (min 2 characters)..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setSearchSelected(null) }}
                    autoFocus />

                  {searching && (
                    <div style={{ position: 'absolute', right: '12px', top: '36px', color: '#16a34a', fontSize: '12px' }}>
                      Searching...
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 100, maxHeight: '250px', overflowY: 'auto' }}>
                      {searchResults.map((item: any, i: number) => (
                        <div key={i} onClick={() => selectSearchResult(item)}
                          style={{ padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid #f9fafb' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                          <p style={{ fontWeight: '600', color: '#111827', margin: '0 0 2px', fontSize: '14px' }}>{item.label}</p>
                          <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{item.fullAddress}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auto-filled fields */}
                {searchSelected && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      {[
                        { label: 'Sub-District', value: searchSelected.hierarchy.subDistrict },
                        { label: 'District', value: searchSelected.hierarchy.district },
                        { label: 'State', value: searchSelected.hierarchy.state },
                        { label: 'Country', value: 'India' },
                      ].map(f => (
                        <div key={f.label}>
                          <label style={labelStyle}>{f.label}</label>
                          <input style={{ ...inputStyle, backgroundColor: '#f0fdf4', color: '#16a34a', fontWeight: '600', border: '1px solid #d1fae5' }} value={f.value} readOnly />
                        </div>
                      ))}
                    </div>
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', padding: '12px 16px', borderRadius: '8px' }}>
                      <p style={{ color: '#16a34a', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>✅ Full Address:</p>
                      <p style={{ color: '#374151', fontSize: '13px' }}>{searchSelected.fullAddress}</p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Message */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Message</label>
            <textarea style={{ ...inputStyle, height: '80px', resize: 'none' }}
              placeholder="Your message..."
              value={formData.message}
              onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} />
          </div>

          <button onClick={handleSubmit}
            style={{ width: '100%', backgroundColor: isComplete ? '#16a34a' : '#d1fae5', color: isComplete ? 'white' : '#6b7280', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: isComplete ? 'pointer' : 'not-allowed', border: 'none', transition: 'all 0.2s' }}>
            Submit Form
          </button>
        </div>

        {/* API Info */}
        <div style={{ marginTop: '24px', backgroundColor: '#111827', padding: '16px', borderRadius: '8px' }}>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>APIs being called:</p>
          {mode === 'guided' ? (
            <>
              <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', margin: '2px 0' }}>GET /api/states</p>
              <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', margin: '2px 0' }}>GET /api/districts?state_code={selectedState || 'XX'}</p>
              <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', margin: '2px 0' }}>GET /api/subdistricts?district_code={selectedDistrict || 'XX'}</p>
              <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px', margin: '2px 0' }}>GET /api/villages?sub_district_code={selectedSubDistrict || 'XX'}</p>
            </>
          ) : (
            <p style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: '12px' }}>GET /api/autocomplete?q={searchQuery || 'village_name'}</p>
          )}
        </div>
      </div>
    </div>
  )
}