'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; hostel?: { name: string } } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (!data.id) { router.replace('/login'); return }
        if (!data.hasHostel && !pathname.startsWith('/setup')) { router.replace('/setup'); return }
        setUser(data)
        setLoading(false)
      })
      .catch(() => router.replace('/login'))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#111010' }}>
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c', animation: `bounce 1s ${i*0.2}s infinite` }} />
        ))}
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-8px);opacity:1}}`}</style>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      <Sidebar hostelName={user?.hostel?.name} userName={user?.name} />
      <main className="flex-1 min-w-0 lg:ml-0">
        <div className="page-enter">
          {children}
        </div>
      </main>
    </div>
  )
}
