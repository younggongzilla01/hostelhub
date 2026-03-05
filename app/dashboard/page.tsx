'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '@/lib/utils'
import StatCard from '@/components/ui/StatCard'
import { TrendingUp, AlertCircle, Bell } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) return (
    <div className="p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map(i => <div key={i} className="h-28 skeleton" />)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map(i => <div key={i} className="h-24 skeleton" />)}
      </div>
    </div>
  )

  const { stats, revenue, dueSoonStudents } = data || {}

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm tracking-widest uppercase mb-1" style={{ color: 'rgba(201,168,76,0.7)' }}>{greeting}</p>
        <h1 className="font-cormorant text-4xl font-light" style={{ color: '#faf8f3' }}>Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(245,240,232,0.35)' }}>
          {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-px" style={{ background: 'rgba(201,168,76,0.06)' }}>
        <StatCard label="Active Students" value={stats?.totalStudents ?? 0} sub={`${stats?.vegStudents ?? 0} veg · ${stats?.nonVegStudents ?? 0} non-veg`} />
        <StatCard label="Total Rooms" value={stats?.totalRooms ?? 0} sub={`${stats?.totalBeds ?? 0} beds total`} />
        <StatCard label="Occupancy Rate" value={`${stats?.occupancyRate ?? 0}%`} sub={`${stats?.occupiedBeds ?? 0} / ${stats?.totalBeds ?? 0} beds`} accent />
        <StatCard label="Available Beds" value={stats?.availableBeds ?? 0} sub="Ready for new students" />
      </div>

      {/* Revenue */}
      <div className="grid grid-cols-2 gap-px mb-6" style={{ background: 'rgba(201,168,76,0.06)' }}>
        <div className="p-6 flex items-center gap-5" style={{ background: 'rgba(20,16,12,0.8)', border: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <TrendingUp size={16} style={{ color: '#4ade80' }} />
          </div>
          <div>
            <div className="font-cormorant text-3xl font-light" style={{ color: '#4ade80' }}>{formatCurrency(revenue?.currentMonth ?? 0)}</div>
            <div className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'rgba(245,240,232,0.4)' }}>This Month's Revenue</div>
          </div>
        </div>
        <div className="p-6 flex items-center gap-5" style={{ background: 'rgba(20,16,12,0.8)', border: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="w-10 h-10 flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <AlertCircle size={16} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <div className="font-cormorant text-3xl font-light" style={{ color: '#fbbf24' }}>{formatCurrency(revenue?.pending ?? 0)}</div>
            <div className="text-xs tracking-widest uppercase mt-0.5" style={{ color: 'rgba(245,240,232,0.4)' }}>Pending Dues</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: 'Add Student', href: '/students' },
          { label: 'Record Payment', href: '/payments' },
          { label: 'Add Expense', href: '/expenses' },
          { label: 'Log Visitor', href: '/visitors' },
          { label: 'New Complaint', href: '/complaints' },
          { label: 'Post Notice', href: '/notices' },
        ].map(({ label, href }) => (
          <button key={label} onClick={() => router.push(href)}
            className="py-3 px-2 text-xs text-center transition-all"
            style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.05em', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(201,168,76,0.08)'; e.currentTarget.style.color='#e8c97a'; e.currentTarget.style.borderColor='rgba(201,168,76,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(201,168,76,0.04)'; e.currentTarget.style.color='rgba(245,240,232,0.5)'; e.currentTarget.style.borderColor='rgba(201,168,76,0.12)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Due soon table */}
      {dueSoonStudents?.length > 0 && (
        <div style={{ border: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.08)', background: 'rgba(201,168,76,0.03)' }}>
            <Bell size={14} style={{ color: '#fbbf24' }} />
            <span className="text-sm tracking-wide" style={{ color: 'rgba(245,240,232,0.6)' }}>Due Soon</span>
            <span className="text-xs px-2 py-0.5" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>{dueSoonStudents.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(201,168,76,0.06)' }}>
                  {['Student', 'Room', 'Rent', 'Due Date'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs tracking-widest uppercase" style={{ color: 'rgba(245,240,232,0.3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dueSoonStudents.map((s: any) => (
                  <tr key={s.id} className="border-b cursor-pointer transition-colors"
                    style={{ borderColor: 'rgba(201,168,76,0.04)' }}
                    onClick={() => router.push('/students')}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-6 py-4 text-sm" style={{ color: 'rgba(245,240,232,0.7)' }}>{s.name}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'rgba(245,240,232,0.4)' }}>Room {s.bed?.room?.number || '-'}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#e8c97a' }}>{formatCurrency(s.monthlyRent)}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>{s.dueDate}th</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Archive note */}
      {stats?.oldStudentsCount > 0 && (
        <div className="mt-4 px-4 py-3 text-xs flex items-center gap-2" style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.08)', color: 'rgba(245,240,232,0.35)' }}>
          {stats.oldStudentsCount} former students in archive —
          <button onClick={() => router.push('/old-students')} style={{ color: '#c9a84c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}>
            View records
          </button>
        </div>
      )}
    </div>
  )
}
