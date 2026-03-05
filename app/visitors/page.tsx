'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, LogOut } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/ui/Modal'
import { formatDate, formatTime } from '@/lib/utils'

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', purpose: '', studentId: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const load = () => fetch('/api/visitors').then(r => r.json()).then(d => { setVisitors(Array.isArray(d) ? d : []); setLoading(false) })
  useEffect(() => { load() }, [])

  async function checkIn(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/visitors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Visitor checked in'); setShowAdd(false); setForm({ name:'',phone:'',purpose:'',studentId:'' }); load() }
    else toast.error('Failed')
  }

  async function checkOut(id: string) {
    await fetch(`/api/visitors/${id}`, { method: 'PUT' })
    toast.success('Visitor checked out'); load()
  }

  const active = visitors.filter(v => !v.outTime)
  const past = visitors.filter(v => v.outTime)

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <PageHeader title="Visitor Log" subtitle={`${active.length} currently inside`}
        actions={<button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-none"><Plus size={15} /> Check In</button>}
      />

      {active.length > 0 && (
        <div className="mb-8">
          <div className="text-xs tracking-widest uppercase mb-4 flex items-center gap-3" style={{ color: 'rgba(201,168,76,0.6)' }}>
            <span className="inline-block w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse 2s infinite' }} />
            Currently Inside
          </div>
          <div className="flex flex-col gap-3">
            {active.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between p-5" style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <div>
                  <div className="font-cormorant text-lg mb-1" style={{ color: '#faf8f3' }}>{v.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(245,240,232,0.4)' }}>{v.purpose} · In: {formatTime(v.inTime)} · {v.phone || 'No phone'}</div>
                </div>
                <button onClick={() => checkOut(v.id)} className="btn-ghost flex items-center gap-2 px-4 py-2 text-xs rounded-none">
                  <LogOut size={12} /> Check Out
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <div className="text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(245,240,232,0.3)' }}>Past Visits</div>
          <div style={{ border: '1px solid rgba(201,168,76,0.08)' }}>
            {past.slice(0, 20).map((v: any) => (
              <div key={v.id} className="flex items-center justify-between px-5 py-3 border-b transition-colors"
                style={{ borderColor: 'rgba(201,168,76,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div>
                  <span className="text-sm mr-3" style={{ color: 'rgba(245,240,232,0.7)' }}>{v.name}</span>
                  <span className="text-xs" style={{ color: 'rgba(245,240,232,0.35)' }}>{v.purpose}</span>
                </div>
                <div className="text-xs" style={{ color: 'rgba(245,240,232,0.3)' }}>
                  {formatTime(v.inTime)} → {v.outTime ? formatTime(v.outTime) : '-'} · {formatDate(v.inTime)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="h-64 skeleton" />}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Check In Visitor">
        <form onSubmit={checkIn} className="flex flex-col gap-5">
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Visitor Name *</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.name} onChange={e => set('name',e.target.value)} required /></div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Phone</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.phone} onChange={e => set('phone',e.target.value)} /></div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Purpose *</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="Family visit, Delivery, etc." value={form.purpose} onChange={e => set('purpose',e.target.value)} required /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost px-6 py-2.5 text-sm rounded-none">Cancel</button>
            <button type="submit" className="btn-gold px-6 py-2.5 text-sm rounded-none">Check In</button>
          </div>
        </form>
      </Modal>
      <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
    </div>
  )
}
