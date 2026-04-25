import Link from 'next/link'

export default function Docs() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-100 shadow-sm">
        <Link href="/" className="text-xl font-bold text-green-600">🌍 India Geo API</Link>
        <div className="flex gap-4 items-center">
          <Link href="/portal" className="text-gray-500 hover:text-gray-900 font-medium">Portal</Link>
          <Link href="/portal" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold">
            Get API Key
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">API Documentation</h1>
        <p className="text-gray-500 mb-12">Complete reference for the India Geo API</p>

        {/* Base URL */}
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Base URL</h2>
          <p className="font-mono text-green-600 text-lg">https://geo-api-blond.vercel.app</p>
        </div>

        {/* Authentication */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
          <p className="text-gray-500 mb-4">All API requests require an API key passed in the request header:</p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">{`fetch('https://geo-api-blond.vercel.app/api/states', {
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
})`}</pre>
        </div>

        {/* Endpoints */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Endpoints</h2>

        {/* States */}
        <div className="border border-gray-100 rounded-xl mb-6 overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 flex items-center gap-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
            <code className="font-mono text-gray-900">/api/states</code>
          </div>
          <div className="p-6">
            <p className="text-gray-500 mb-4">Returns all Indian states.</p>
            <p className="font-bold text-sm text-gray-700 mb-2">Response:</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm">{`{
  "success": true,
  "data": [
    { "code": "32", "name": "KERALA" },
    { "code": "27", "name": "MAHARASHTRA" }
  ]
}`}</pre>
          </div>
        </div>

        {/* Districts */}
        <div className="border border-gray-100 rounded-xl mb-6 overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 flex items-center gap-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
            <code className="font-mono text-gray-900">/api/districts?state_code=32</code>
          </div>
          <div className="p-6">
            <p className="text-gray-500 mb-4">Returns all districts for a given state.</p>
            <p className="font-bold text-sm text-gray-700 mb-2">Parameters:</p>
            <table className="w-full text-sm mb-4">
              <thead><tr className="text-left text-gray-400 border-b">
                <th className="pb-2">Parameter</th><th className="pb-2">Required</th><th className="pb-2">Description</th>
              </tr></thead>
              <tbody><tr className="border-b border-gray-50">
                <td className="py-2 font-mono text-green-600">state_code</td>
                <td className="py-2 text-red-500">Yes</td>
                <td className="py-2 text-gray-500">State code from /api/states</td>
              </tr></tbody>
            </table>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm">{`{
  "success": true,
  "data": [
    { "code": "595", "name": "Ernakulam" },
    { "code": "601", "name": "Thiruvananthapuram" }
  ]
}`}</pre>
          </div>
        </div>

        {/* Sub-Districts */}
        <div className="border border-gray-100 rounded-xl mb-6 overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 flex items-center gap-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
            <code className="font-mono text-gray-900">/api/subdistricts?district_code=595&state_code=32</code>
          </div>
          <div className="p-6">
            <p className="text-gray-500 mb-4">Returns all sub-districts for a given district.</p>
            <p className="font-bold text-sm text-gray-700 mb-2">Parameters:</p>
            <table className="w-full text-sm mb-4">
              <thead><tr className="text-left text-gray-400 border-b">
                <th className="pb-2">Parameter</th><th className="pb-2">Required</th><th className="pb-2">Description</th>
              </tr></thead>
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="py-2 font-mono text-green-600">district_code</td>
                  <td className="py-2 text-red-500">Yes</td>
                  <td className="py-2 text-gray-500">District code from /api/districts</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-green-600">state_code</td>
                  <td className="py-2 text-red-500">Yes</td>
                  <td className="py-2 text-gray-500">State code from /api/states</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Villages */}
        <div className="border border-gray-100 rounded-xl mb-6 overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 flex items-center gap-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
            <code className="font-mono text-gray-900">/api/villages?sub_district_code=&district_code=&state_code=</code>
          </div>
          <div className="p-6">
            <p className="text-gray-500 mb-4">Returns all villages for a given sub-district.</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm">{`{
  "success": true,
  "data": [
    { "code": "006673", "name": "Aluva" }
  ]
}`}</pre>
          </div>
        </div>

        {/* Search */}
        <div className="border border-gray-100 rounded-xl mb-10 overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 flex items-center gap-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
            <code className="font-mono text-gray-900">/api/search?q=Thrissur</code>
          </div>
          <div className="p-6">
            <p className="text-gray-500 mb-4">Search villages by name. Returns up to 20 results with full hierarchy.</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm">{`{
  "success": true,
  "data": [
    {
      "village": "Thrissur",
      "sub_district": "Thrissur",
      "district": "Thrissur",
      "state": "KERALA",
      "code": "006673",
      "state_code": "32"
    }
  ]
}`}</pre>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-green-50 border border-green-100 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Limits</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 border-b border-green-200">
              <th className="pb-3">Plan</th><th className="pb-3">Daily Limit</th><th className="pb-3">Price</th>
            </tr></thead>
            <tbody>
              {[
                { plan: 'Free', limit: '100 requests/day', price: '₹0' },
                { plan: 'Premium', limit: '10,000 requests/day', price: '₹99/mo' },
                { plan: 'Pro', limit: '1,00,000 requests/day', price: '₹299/mo' },
                { plan: 'Unlimited', limit: 'Unlimited', price: '₹999/mo' },
              ].map(r => (
                <tr key={r.plan} className="border-b border-green-100">
                  <td className="py-3 font-bold text-gray-900">{r.plan}</td>
                  <td className="py-3 text-gray-600">{r.limit}</td>
                  <td className="py-3 text-green-600 font-bold">{r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <Link href="/portal" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg inline-block">
            Get Your Free API Key →
          </Link>
        </div>
      </div>
    </div>
  )
}