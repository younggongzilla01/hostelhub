'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default function ComplaintsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ studentName: '', title: '', description: '', priority: 'normal' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const load = () => fetch(`/api/complaints?status=${status}`).then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
  useEffect(() => { load() }, [status])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/complaints', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Complaint registered'); setShowAdd(false); load() }
    else toast.error('Failed')
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch(`/api/complaints/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
    toast.success('Status updated'); load()
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <PageHeader title="Complaints" subtitle={`${items.length} complaints`}
        actions={<button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-none"><Plus size={15} /> Register</button>}
      />
      <div className="flex gap-1 mb-6">
        {['all','pending','in-progress','resolved'].map(s => (
          <button key={s} onClick={() => setStatus(s)} className="px-4 py-2 text-xs tracking-widest uppercase transition-all rounded-none"
            style={{ background: status===s?'rgba(201,168,76,0.12)':'transparent', color: status===s?'#e8c97a':'rgba(245,240,232,0.4)', border:`1px solid ${status===s?'rgba(201,168,76,0.3)':'rgba(201,168,76,0.08)'}`, cursor:'pointer' }}>
            {s.replace('-',' ')}
          </button>
        ))}
      </div>
      {loading ? <div className="h-64 skeleton" /> : (
        <div className="flex flex-col gap-3">
          {items.length === 0 ? <div className="text-center py-16 text-sm" style={{ color: 'rgba(245,240,232,0.3)' }}>No complaints found</div> :
          items.map((c: any) => (
            <div key={c.id} className="p-5" style={{ background: 'rgba(20,16,12,0.8)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <Badge label={c.priority} />
                  <span className="font-cormorant text-lg" style={{ color: '#faf8f3' }}>{c.title}</span>
                </div>
                <Badge label={c.status} variant={c.status} />
              </div>
              <p className="text-sm mb-3" style={{ color: 'rgba(245,240,232,0.5)' }}>{c.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs" style={{ color: 'rgba(245,240,232,0.3)' }}>By {c.studentName} · {formatDate(c.createdAt)}</div>
                <div className="flex gap-2">
                  {c.status === 'pending' && <button onClick={() => updateStatus(c.id,'in-progress')} className="btn-ghost px-3 py-1 text-xs rounded-none">In Progress</button>}
                  {c.status !== 'resolved' && <button onClick={() => updateStatus(c.id,'resolved')} className="btn-gold px-3 py-1 text-xs rounded-none">Resolve</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Register Complaint">
        <form onSubmit={handleAdd} className="flex flex-col gap-5">
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Student Name *</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.studentName} onChange={e => set('studentName',e.target.value)} required /></div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Title *</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.title} onChange={e => set('title',e.target.value)} required /></div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Description</label>
            <textarea className="input-gold w-full px-4 py-3 text-sm rounded-none resize-none" rows={3} value={form.description} onChange={e => set('description',e.target.value)} /></div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Priority</label>
            <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.priority} onChange={e => set('priority',e.target.value)}>
              <option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>
            </select></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost px-6 py-2.5 text-sm rounded-none">Cancel</button>
            <button type="submit" className="btn-gold px-6 py-2.5 text-sm rounded-none">Register</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
