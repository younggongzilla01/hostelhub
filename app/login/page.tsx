'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const url = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = tab === 'login' ? { email: form.email, password: form.password } : form
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Something went wrong'); return }
      toast.success(tab === 'login' ? `Welcome back, ${data.name}` : `Welcome to HostelHub, ${data.name}`)
      router.push(data.hasHostel ? '/dashboard' : '/setup')
    } catch {
      toast.error('Network error, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#111010' }}>
      {/* Left - Decorative */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0805 0%, #130f08 100%)' }}>
        {/* Building illustration */}
        <div className="absolute inset-0 flex items-end justify-center opacity-10">
          <svg viewBox="0 0 600 500" className="w-full max-w-lg">
            <rect x="100" y="80" width="400" height="420" fill="#c9a84c" opacity="0.1"/>
            <polygon points="100,80 300,20 500,80" fill="#c9a84c" opacity="0.15"/>
            {[...Array(5)].map((_, i) => (<g key={i}>
              <rect x={130 + i*70} y="140" width="40" height="60" rx="20" fill="#c9a84c" opacity="0.4"/>
              <rect x={130 + i*70} y="230" width="40" height="60" rx="20" fill="#c9a84c" opacity="0.3"/>
              <rect x={130 + i*70} y="320" width="40" height="60" rx="20" fill="#c9a84c" opacity="0.2"/>
            </g>))}
            <rect x="240" y="400" width="120" height="100" fill="#c9a84c" opacity="0.2"/>
            <path d="M240,400 Q300,350 360,400" fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.4"/>
            {[130,200,270,340,410].map((x, i) => (
              <rect key={i} x={x} y="80" width="8" height="420" fill="#c9a84c" opacity="0.2"/>
            ))}
          </svg>
        </div>
        {/* Radial glow */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(201,168,76,0.06) 0%, transparent 70%)' }}/>

        <div className="relative z-10">
          <div className="font-cinzel text-3xl tracking-widest mb-2" style={{ color: '#e8c97a' }}>HostelHub</div>
          <div className="text-sm tracking-widest uppercase" style={{ color: 'rgba(245,240,232,0.3)', letterSpacing: '0.3em' }}>Premium Management</div>
        </div>

        <div className="relative z-10">
          <blockquote className="font-cormorant text-2xl font-light italic mb-6 leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
            "Every great hostel deserves a management system as refined as its ambitions."
          </blockquote>
          <div className="flex gap-6">
            {[['2,400+','Hostels'],['₹48Cr','Tracked'],['98%','Uptime']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-cormorant text-2xl font-light" style={{ color: '#e8c97a' }}>{num}</div>
                <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(245,240,232,0.3)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top/bottom gold lines */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)' }}/>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)' }}/>
      </div>

      {/* Right - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-10">
            <div className="font-cinzel text-2xl tracking-widest" style={{ color: '#e8c97a' }}>HostelHub</div>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 border-b" style={{ borderColor: 'rgba(201,168,76,0.12)' }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-4 text-sm font-medium tracking-widest uppercase transition-all"
                style={{
                  color: tab === t ? '#e8c97a' : 'rgba(245,240,232,0.35)',
                  borderBottom: tab === t ? `2px solid gold` : 'none',olid #c9a84c' : '2px solid transparent',
                  marginBottom: '-1px',
                  background: 'none',
                  border: 'none',
                  
                  cursor: 'pointer',
                  letterSpacing: '0.15em',
                }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="mb-8">
            <h1 className="font-cormorant text-4xl font-light mb-2" style={{ color: '#faf8f3' }}>
              {tab === 'login' ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(245,240,232,0.4)' }}>
              {tab === 'login' ? 'Sign in to your HostelHub account' : 'Create your free account today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {tab === 'register' && (
              <>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Full Name</label>
                  <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="Rajesh Malhotra"
                    value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Phone Number</label>
                  <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="9876543210"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Email Address</label>
              <input type="email" className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="you@hostel.com"
                value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Password</label>
              <input type="password" className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder={tab === 'login' ? '••••••••' : 'Minimum 6 characters'}
                value={form.password} onChange={e => set('password', e.target.value)} required minLength={6} />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full py-4 text-sm tracking-widest uppercase mt-2 rounded-none">
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: 'rgba(245,240,232,0.25)' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setTab(tab === 'login' ? 'register' : 'login')} className="underline" style={{ color: '#c9a84c', background: 'none', border: 'none', cursor: 'pointer' }}>
              {tab === 'login' ? 'Register free' : 'Sign in'}
            </button>
          </p>

          {tab === 'login' && (
            <div className="mt-8 p-4 rounded-none" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <p className="text-xs tracking-wide mb-2" style={{ color: 'rgba(245,240,232,0.35)' }}>Demo credentials:</p>
              <p className="text-xs font-mono" style={{ color: 'rgba(245,240,232,0.5)' }}>Email: demo@hostelhub.in</p>
              <p className="text-xs font-mono" style={{ color: 'rgba(245,240,232,0.5)' }}>Password: demo123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
