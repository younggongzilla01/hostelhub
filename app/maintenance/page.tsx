'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function MaintenancePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ roomNumber: '', issue: '', description: '', priority: 'normal', cost: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const load = () => fetch(`/api/maintenance?status=${status}`).then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
  useEffect(() => { load() }, [status])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/maintenance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Request created'); setShowAdd(false); load() }
    else toast.error('Failed')
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/maintenance/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
    toast.success('Updated'); load()
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <PageHeader title="Maintenance" subtitle="Track and resolve property issues"
        actions={<button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-none"><Plus size={15} /> New Request</button>}
      />
      <div className="flex gap-1 mb-6">
        {['all','pending','in-progress','completed'].map(s => (
          <button key={s} onClick={() => setStatus(s)} className="px-4 py-2 text-xs tracking-widest uppercase transition-all rounded-none"
            style={{ background: status===s?'rgba(201,168,76,0.12)':'transparent', color: status===s?'#e8c97a':'rgba(245,240,232,0.4)', border:`1px solid ${status===s?'rgba(201,168,76,0.3)':'rgba(201,168,76,0.08)'}`, cursor:'pointer' }}>
            {s.replace('-',' ')}
          </button>
        ))}
      </div>
      {loading ? <div className="h-64 skeleton" /> : (
        <div className="flex flex-col gap-3">
          {items.length === 0 ? <div className="text-center py-16 text-sm" style={{ color: 'rgba(245,240,232,0.3)' }}>No maintenance requests</div> :
          items.map((m: any) => (
            <div key={m.id} className="p-5" style={{ background: 'rgba(20,16,12,0.8)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <Badge label={m.priority} />
                  <span className="font-cormorant text-lg" style={{ color: '#faf8f3' }}>Room {m.roomNumber} — {m.issue}</span>
                </div>
                <Badge label={m.status} variant={m.status} />
              </div>
              {m.description && <p className="text-sm mb-3" style={{ color: 'rgba(245,240,232,0.45)' }}>{m.description}</p>}
              <div className="flex items-center justify-between">
                <div className="text-xs" style={{ color: 'rgba(245,240,232,0.3)' }}>
                  {formatDate(m.createdAt)} {m.cost ? `· Cost: ${formatCurrency(m.cost)}` : ''}
                </div>
                <div className="flex gap-2">
                  {m.status === 'pending' && <button onClick={() => updateStatus(m.id,'in-progress')} className="btn-ghost px-3 py-1 text-xs rounded-none">Start</button>}
                  {m.status !== 'completed' && <button onClick={() => updateStatus(m.id,'completed')} className="btn-gold px-3 py-1 text-xs rounded-none">Complete</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Maintenance Request">
        <form onSubmit={handleAdd} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Room Number *</label>
              <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.roomNumber} onChange={e => set('roomNumber',e.target.value)} required /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Issue *</label>
              <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="AC not working" value={form.issue} onChange={e => set('issue',e.target.value)} required /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Priority</label>
              <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.priority} onChange={e => set('priority',e.target.value)}>
                <option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
              </select></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Estimated Cost (₹)</label>
              <input type="number" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.cost} onChange={e => set('cost',e.target.value)} /></div>
          </div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Description</label>
            <textarea className="input-gold w-full px-4 py-3 text-sm rounded-none resize-none" rows={3} value={form.description} onChange={e => set('description',e.target.value)} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost px-6 py-2.5 text-sm rounded-none">Cancel</button>
            <button type="submit" className="btn-gold px-6 py-2.5 text-sm rounded-none">Create Request</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
