'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function OldStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`/api/old-students?search=${search}`).then(r=>r.json()).then(d => { setStudents(Array.isArray(d)?d:[]); setLoading(false) })
  }, [search])

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <PageHeader title="Alumni Archive" subtitle={`${students.length} former residents`} />
      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'rgba(245,240,232,0.3)' }} />
        <input className="input-gold w-full pl-10 pr-4 py-3 text-sm rounded-none" placeholder="Search by name or phone..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      {loading ? <div className="h-64 skeleton" /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.length === 0 ? <div className="col-span-3 text-center py-16 text-sm" style={{ color:'rgba(245,240,232,0.3)' }}>No archived students found</div> :
          students.map((s:any) => (
            <div key={s.id} className="p-5" style={{ background:'rgba(20,16,12,0.6)', border:'1px solid rgba(201,168,76,0.08)' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(201,168,76,0.18)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(201,168,76,0.08)'}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 flex items-center justify-center font-cormorant" style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', color:'rgba(201,168,76,0.7)' }}>
                  {s.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color:'rgba(245,240,232,0.75)' }}>{s.name}</div>
                  <div className="text-xs" style={{ color:'rgba(245,240,232,0.3)' }}>{s.phone}</div>
                </div>
              </div>
              <div className="text-xs flex flex-col gap-1.5" style={{ color:'rgba(245,240,232,0.35)' }}>
                {s.roomNumber && <span>Room {s.roomNumber}</span>}
                <span>Total Paid: <span style={{ color:'#e8c97a' }}>{formatCurrency(s.totalPaid)}</span></span>
                {s.joinDate && <span>{formatDate(s.joinDate)} → {formatDate(s.leaveDate)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
