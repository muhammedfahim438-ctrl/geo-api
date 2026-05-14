'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#050816',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      overflowX: 'hidden'
    }}>

      {/* Animated Background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(120,40,200,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,150,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(0,200,150,0.1) 0%, transparent 50%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Floating Orbs */}
      <div style={{
        position: 'fixed', top: '10%', left: '10%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(120,40,200,0.3) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', top: '40%', right: '10%',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(0,150,255,0.3) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '20%', left: '30%',
        width: '200px', height: '200px',
        background: 'radial-gradient(circle, rgba(0,200,150,0.2) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
        animation: 'float 7s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0
      }} />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(120,40,200,0.5); }
          50% { box-shadow: 0 0 40px rgba(0,150,255,0.8), 0 0 80px rgba(120,40,200,0.3); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .glass {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.2) !important;
          transform: translateY(-4px);
          transition: all 0.3s ease !important;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(120,40,200,0.4) !important;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.15) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; }
          .hero-subtitle { font-size: 16px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .hero-buttons { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="glass" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7828c8, #0096ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px'
          }}>🌍</div>
          <span style={{ fontWeight: 'bold', fontSize: '18px', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            India Geo API
          </span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {[['Demo', '/demo'], ['Docs', '/docs'], ['Pricing', '#pricing']].map(([label, href]) => (
            <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>
              {label}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/portal" style={{
            padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
            border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none',
            transition: 'all 0.2s'
          }} className="btn-secondary">Login</Link>
          <Link href="/portal" style={{
            padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
            background: 'linear-gradient(135deg, #7828c8, #0096ff)',
            color: 'white', textDecoration: 'none', transition: 'all 0.3s',
            animation: 'glow 3s ease-in-out infinite'
          }} className="btn-primary">Get API Key</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '140px', paddingBottom: '80px', textAlign: 'center', padding: '140px 24px 80px' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '999px', marginBottom: '32px',
          background: 'rgba(120,40,200,0.2)', border: '1px solid rgba(120,40,200,0.4)',
          fontSize: '13px', color: '#a855f7',
          animation: 'fadeInUp 0.6s ease forwards'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#a855f7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          🇮🇳 India's Most Complete Village Database
        </div>

        {/* Title */}
        <h1 className="hero-title" style={{
          fontSize: '64px', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px',
          animation: 'fadeInUp 0.8s ease forwards',
          background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 40%, #3b82f6 70%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundSize: '200% auto', animationName: 'shimmer',
          animationDuration: '4s', animationIterationCount: 'infinite', animationTimingFunction: 'linear'
        }}>
          Village-Level Geo Data<br />API for India
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{
          fontSize: '20px', color: 'rgba(255,255,255,0.6)', maxWidth: '600px',
          margin: '0 auto 40px', lineHeight: 1.6,
          animation: 'fadeInUp 1s ease forwards'
        }}>
          619,246 villages across 30 states. Ready-to-use REST API for address dropdowns,
          form autocomplete, and logistics platforms.
        </p>

        {/* Buttons */}
        <div className="hero-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeInUp 1.2s ease forwards' }}>
          <Link href="/portal" style={{
            padding: '16px 36px', borderRadius: '12px', fontSize: '16px', fontWeight: '700',
            background: 'linear-gradient(135deg, #7828c8, #0096ff)',
            color: 'white', textDecoration: 'none', transition: 'all 0.3s',
            boxShadow: '0 8px 30px rgba(120,40,200,0.4)'
          }} className="btn-primary">
            🚀 Start Free →
          </Link>
          <Link href="/demo" style={{
            padding: '16px 36px', borderRadius: '12px', fontSize: '16px', fontWeight: '700',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', textDecoration: 'none', transition: 'all 0.3s',
            backdropFilter: 'blur(10px)'
          }} className="btn-secondary">
            🎯 Try Live Demo
          </Link>
          <Link href="/docs" style={{
            padding: '16px 36px', borderRadius: '12px', fontSize: '16px', fontWeight: '700',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'all 0.3s'
          }} className="btn-secondary">
            📖 View Docs
          </Link>
        </div>

        {/* API Preview */}
        <div className="glass" style={{
          maxWidth: '600px', margin: '48px auto 0',
          borderRadius: '16px', padding: '24px', textAlign: 'left',
          animation: 'fadeInUp 1.4s ease forwards'
        }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => (
              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: c }} />
            ))}
          </div>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '8px' }}>Quick Start</p>
          <pre style={{ color: '#4ade80', fontSize: '13px', fontFamily: 'monospace', margin: 0, overflowX: 'auto' }}>{`fetch('https://geo-api-blond.vercel.app/api/states', {
  headers: { 'x-api-key': 'YOUR_API_KEY' }
})
// Returns all 30 Indian states instantly ⚡`}</pre>
        </div>
      </div>

      {/* STATS */}
      <div style={{ position: 'relative', zIndex: 1, padding: '40px 24px' }}>
        <div className="stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px', maxWidth: '900px', margin: '0 auto'
        }}>
          {[
            { num: '619,246', label: 'Villages', color: '#a855f7', icon: '🏘️' },
            { num: '30', label: 'States', color: '#3b82f6', icon: '🗺️' },
            { num: '<100ms', label: 'Response Time', color: '#06b6d4', icon: '⚡' },
            { num: '99.9%', label: 'Uptime', color: '#10b981', icon: '✅' },
          ].map(s => (
            <div key={s.label} className="glass glass-card" style={{
              padding: '24px', borderRadius: '16px', textAlign: 'center',
              transition: 'all 0.3s ease', cursor: 'default'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: s.color, margin: '0 0 4px' }}>{s.num}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Everything You Need
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>Built for Indian developers and businesses</p>
        </div>

        <div className="features-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px', maxWidth: '1000px', margin: '0 auto'
        }}>
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Redis caching delivers sub-100ms responses for 95% of requests', color: '#f59e0b' },
            { icon: '🔑', title: 'API Key Auth', desc: 'Secure API key authentication with rate limiting per plan', color: '#a855f7' },
            { icon: '🏘️', title: '619K+ Villages', desc: 'Complete Census 2011 data — every village in India', color: '#3b82f6' },
            { icon: '📍', title: 'Full Hierarchy', desc: 'State → District → Sub-District → Village in one API', color: '#06b6d4' },
            { icon: '🔍', title: 'Smart Search', desc: 'Autocomplete with full address hierarchy in milliseconds', color: '#10b981' },
            { icon: '📊', title: 'Analytics', desc: 'Real-time usage dashboard with charts and insights', color: '#f43f5e' },
          ].map(f => (
            <div key={f.title} className="glass glass-card" style={{
              padding: '28px', borderRadius: '16px', transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px',
                background: `${f.color}20`, border: `1px solid ${f.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: f.color }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API EXAMPLE */}
      <div style={{ position: 'relative', zIndex: 1, padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px',
              background: 'linear-gradient(135deg, #ffffff, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Simple to Integrate
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: 'rgba(255,255,255,0.9)' }}>
                One API, Complete Hierarchy
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '20px', fontSize: '14px', lineHeight: 1.7 }}>
                State → District → Sub-District → Village. Perfect for address forms and dropdowns.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { method: 'GET', endpoint: '/api/states', color: '#10b981' },
                  { method: 'GET', endpoint: '/api/districts?state_code=32', color: '#3b82f6' },
                  { method: 'GET', endpoint: '/api/subdistricts?...', color: '#a855f7' },
                  { method: 'GET', endpoint: '/api/villages?...', color: '#f59e0b' },
                  { method: 'GET', endpoint: '/api/autocomplete?q=Thr', color: '#f43f5e' },
                ].map(e => (
                  <div key={e.endpoint} className="glass" style={{
                    padding: '10px 16px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center'
                  }}>
                    <span style={{ backgroundColor: `${e.color}20`, color: e.color, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>{e.method}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{e.endpoint}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass" style={{ borderRadius: '16px', padding: '24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '12px' }}>Example Response</p>
              <pre style={{ color: '#4ade80', fontSize: '12px', fontFamily: 'monospace', overflow: 'auto', margin: 0 }}>{`{
  "success": true,
  "count": 1,
  "data": [{
    "label": "Thrissur",
    "fullAddress": "Thrissur, Thrissur,
      Thrissur, KERALA, India",
    "hierarchy": {
      "village": "Thrissur",
      "subDistrict": "Thrissur",
      "district": "Thrissur",
      "state": "KERALA",
      "country": "India"
    }
  }],
  "meta": {
    "responseTime": 47,
    "rateLimit": {
      "remaining": 4850,
      "limit": 5000
    }
  }
}`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* DEMO CTA */}
      <div style={{ position: 'relative', zIndex: 1, padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass" style={{
            borderRadius: '24px', padding: '48px', textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(120,40,200,0.2), rgba(0,150,255,0.2))',
            border: '1px solid rgba(120,40,200,0.3)'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>See It In Action</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '28px', fontSize: '16px' }}>
              Try our live demo — type any village name and watch the address auto-complete instantly
            </p>
            <Link href="/demo" style={{
              display: 'inline-block', padding: '16px 36px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #7828c8, #0096ff)',
              color: 'white', textDecoration: 'none', fontWeight: '700', fontSize: '16px',
              boxShadow: '0 8px 30px rgba(120,40,200,0.4)', transition: 'all 0.3s'
            }} className="btn-primary">
              🎯 Try Live Demo →
            </Link>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px',
            background: 'linear-gradient(135deg, #ffffff, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Simple Pricing
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>Start free, scale as you grow</p>
        </div>

        <div className="pricing-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px', maxWidth: '1000px', margin: '0 auto'
        }}>
          {[
            { name: 'Free', price: '₹0', period: 'forever', requests: '5,000/day', color: '#10b981', popular: false },
            { name: 'Premium', price: '₹99', period: '/month', requests: '50,000/day', color: '#3b82f6', popular: false },
            { name: 'Pro', price: '₹299', period: '/month', requests: '3,00,000/day', color: '#a855f7', popular: true },
            { name: 'Unlimited', price: '₹999', period: '/month', requests: 'Unlimited', color: '#f59e0b', popular: false },
          ].map(plan => (
            <div key={plan.name} className="glass glass-card" style={{
              padding: '28px', borderRadius: '20px', textAlign: 'center',
              border: plan.popular ? `2px solid ${plan.color}` : '1px solid rgba(255,255,255,0.1)',
              position: 'relative', transition: 'all 0.3s ease',
              background: plan.popular ? `${plan.color}15` : 'rgba(255,255,255,0.05)'
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: `linear-gradient(135deg, ${plan.color}, #3b82f6)`,
                  padding: '4px 16px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap'
                }}>⭐ MOST POPULAR</div>
              )}
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: plan.color }}>{plan.name}</h3>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800', color: 'white' }}>{plan.price}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{plan.period}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px' }}>{plan.requests}</p>
              <Link href="/portal" style={{
                display: 'block', padding: '10px', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                background: `linear-gradient(135deg, ${plan.color}80, ${plan.color})`,
                color: 'white', textDecoration: 'none', transition: 'all 0.3s'
              }}>Get Started</Link>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="glass" style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '40px 24px', textAlign: 'center'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '20px', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🌍 India Geo API
          </span>
        </div>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[['Portal', '/portal'], ['Admin', '/admin'], ['Demo', '/demo'], ['Docs', '/docs']].map(([label, href]) => (
            <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>{label}</Link>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
          🌍 India Geo API — Built for Indian developers — April 2026
        </p>
      </footer>

    </div>
  )
}