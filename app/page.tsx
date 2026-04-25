import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold text-green-600">🌍 India Geo API</h1>
        <div className="flex gap-4 items-center">
          <Link href="/portal" className="text-gray-500 hover:text-gray-900 font-medium">Login</Link>
          <Link href="/portal" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold">
            Get API Key
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center py-24 px-8 bg-gradient-to-b from-green-50 to-white">
        <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          🇮🇳 India's Most Complete Village Database
        </div>
        <h1 className="text-6xl font-bold mb-6 leading-tight text-gray-900">
          Village-Level Geo Data<br/>
          <span className="text-green-600">API for India</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
          457,290 villages across 28 states. Ready-to-use REST API for address dropdowns,
          form autocomplete, and logistics platforms.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/portal" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg">
            Start Free →
          </Link>
          <Link href="/docs" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg shadow-sm">
            View Docs
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 px-8 py-12 max-w-5xl mx-auto">
        {[
          { num: '457,290', label: 'Villages' },
          { num: '28', label: 'States' },
          { num: '<100ms', label: 'Response Time' },
          { num: '99.9%', label: 'Uptime' },
        ].map(s => (
          <div key={s.label} className="bg-green-50 border border-green-100 p-6 rounded-xl text-center shadow-sm">
            <p className="text-3xl font-bold text-green-600">{s.num}</p>
            <p className="text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* API Example */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Simple to Integrate</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">One API, Complete Hierarchy</h3>
            <p className="text-gray-500 mb-6">State → District → Sub-District → Village. Perfect for address forms and dropdowns.</p>
            <div className="space-y-3">
              {[
                'GET /api/states',
                'GET /api/districts?state_code=32',
                'GET /api/subdistricts?district_code=595&state_code=32',
                'GET /api/villages?...',
                'GET /api/search?q=Thrissur',
              ].map(e => (
                <div key={e} className="bg-gray-900 px-4 py-2 rounded-lg font-mono text-green-400 text-sm">
                  {e}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <p className="text-gray-400 text-sm mb-2">Example Response</p>
            <pre className="text-green-400 text-sm overflow-auto">{`{
  "success": true,
  "data": [
    {
      "village": "Thrissur",
      "sub_district": "Thrissur",
      "district": "Thrissur",
      "state": "KERALA"
    }
  ]
}`}</pre>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-5xl mx-auto px-8 py-12 bg-green-50 rounded-3xl mb-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Simple Pricing</h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            { name: 'Free', price: '₹0', requests: '100/day', popular: false },
            { name: 'Premium', price: '₹999/mo', requests: '10,000/day', popular: false },
            { name: 'Pro', price: '₹2,999/mo', requests: '1,00,000/day', popular: true },
            { name: 'Unlimited', price: '₹9,999/mo', requests: 'Unlimited', popular: false },
          ].map(plan => (
            <div key={plan.name} className={`bg-white p-6 rounded-xl shadow-sm border-2 ${
              plan.popular ? 'border-green-500' : 'border-gray-100'
            }`}>
              {plan.popular && <p className="text-green-600 text-xs font-bold mb-2">⭐ MOST POPULAR</p>}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-3xl font-bold text-green-600 my-3">{plan.price}</p>
              <p className="text-gray-400 text-sm mb-4">{plan.requests}</p>
              <Link href="/portal" className="block text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm">
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-8 text-center text-gray-400 bg-white">
        <p className="font-medium text-gray-600">🌍 India Geo API — Built for Indian developers</p>
        <div className="flex gap-6 justify-center mt-4">
          <Link href="/portal" className="hover:text-green-600">Portal</Link>
          <Link href="/admin" className="hover:text-green-600">Admin</Link>
        </div>
      </footer>
    </div>
  )
}