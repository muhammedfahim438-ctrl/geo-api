import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-xl font-bold">🌍 India Geo API</h1>
        <div className="flex gap-4">
          <Link href="/portal" className="text-gray-400 hover:text-white">Login</Link>
          <Link href="/portal" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold">
            Get API Key
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center py-24 px-8">
        <div className="inline-block bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm mb-6">
          🇮🇳 India's Most Complete Village Database
        </div>
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Village-Level Geo Data<br/>
          <span className="text-blue-400">API for India</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          457,290 villages across 28 states. Ready-to-use REST API for address dropdowns, 
          form autocomplete, and logistics platforms.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/portal" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold text-lg">
            Start Free →
          </Link>
          <Link href="/docs" className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl font-bold text-lg">
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
          <div key={s.label} className="bg-gray-800 p-6 rounded-xl text-center">
            <p className="text-3xl font-bold text-blue-400">{s.num}</p>
            <p className="text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* API Example */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Simple to Integrate</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">One API, Complete Hierarchy</h3>
            <p className="text-gray-400 mb-6">State → District → Sub-District → Village. Perfect for address forms and dropdowns.</p>
            <div className="space-y-3">
              {[
                'GET /api/states',
                'GET /api/districts?state_code=32',
                'GET /api/subdistricts?district_code=595&state_code=32',
                'GET /api/villages?...',
                'GET /api/search?q=Thrissur',
              ].map(e => (
                <div key={e} className="bg-gray-800 px-4 py-2 rounded font-mono text-green-400 text-sm">
                  {e}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
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
      <div className="max-w-5xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            { name: 'Free', price: '₹0', requests: '100/day', color: 'gray' },
            { name: 'Premium', price: '₹999/mo', requests: '10,000/day', color: 'blue' },
            { name: 'Pro', price: '₹2,999/mo', requests: '1,00,000/day', color: 'purple' },
            { name: 'Unlimited', price: '₹9,999/mo', requests: 'Unlimited', color: 'yellow' },
          ].map(plan => (
            <div key={plan.name} className={`bg-gray-800 p-6 rounded-xl border ${
              plan.name === 'Pro' ? 'border-purple-500' : 'border-gray-700'
            }`}>
              {plan.name === 'Pro' && <p className="text-purple-400 text-xs font-bold mb-2">MOST POPULAR</p>}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-400 my-3">{plan.price}</p>
              <p className="text-gray-400 text-sm mb-4">{plan.requests}</p>
              <Link href="/portal" className="block text-center bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold text-sm">
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-8 py-8 text-center text-gray-400">
        <p>🌍 India Geo API — Built for Indian developers</p>
        <div className="flex gap-6 justify-center mt-4">
          <Link href="/portal" className="hover:text-white">Portal</Link>
          <Link href="/admin" className="hover:text-white">Admin</Link>
        </div>
      </footer>
    </div>
  )
}