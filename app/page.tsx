'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.id) router.replace(data.hasHostel ? '/dashboard' : '/setup')
        else router.replace('/login')
      })
      .catch(() => router.replace('/login'))
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#111010' }}>
      <div className="text-center">
        <div className="font-cinzel text-2xl tracking-widest mb-4" style={{ color: '#e8c97a' }}>HostelHub</div>
        <div className="flex gap-1.5 justify-center">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c', animation: `bounce 1s ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-8px);opacity:1} }`}</style>
    </div>
  )
}
