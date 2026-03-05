'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', priority: 'normal', expiryDate: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const load = () => fetch('/api/notices').then(r => r.json()).then(d => { setNotices(Array.isArray(d) ? d : []); setLoading(false) })
  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/notices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Notice posted'); setShowAdd(false); load() }
    else toast.error('Failed')
  }

  async function deleteNotice(id: string) {
    if (!confirm('Delete this notice?')) return
    await fetch(`/api/notices/${id}`, { method: 'DELETE' })
    toast.success('Notice deleted'); load()
  }

  const priorityBorderColor: Record<string, string> = {
    low: 'rgba(74,222,128,0.15)', normal: 'rgba(201,168,76,0.12)', high: 'rgba(251,191,36,0.2)', urgent: 'rgba(248,113,113,0.2)'
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <PageHeader title="Notice Board" subtitle={`${notices.length} active notices`}
        actions={<button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-none"><Plus size={15} /> Post Notice</button>}
      />
      {loading ? <div className="h-64 skeleton" /> : (
        <div className="flex flex-col gap-4">
          {notices.length === 0 ? <div className="text-center py-16 text-sm" style={{ color: 'rgba(245,240,232,0.3)' }}>No notices posted</div> :
          notices.map((n: any) => (
            <div key={n.id} className="p-6" style={{ background: 'rgba(20,16,12,0.8)', border: `1px solid ${priorityBorderColor[n.priority] || 'rgba(201,168,76,0.1)'}` }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <Badge label={n.priority} />
                  <h3 className="font-cormorant text-xl font-light" style={{ color: '#faf8f3' }}>{n.title}</h3>
                </div>
                <button onClick={() => deleteNotice(n.id)} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(245,240,232,0.25)',padding:'4px' }}
                  onMouseEnter={e => e.currentTarget.style.color='#f87171'} onMouseLeave={e => e.currentTarget.style.color='rgba(245,240,232,0.25)'}>
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(245,240,232,0.6)' }}>{n.content}</p>
              <div className="text-xs" style={{ color: 'rgba(245,240,232,0.3)' }}>
                Posted {formatDate(n.createdAt)}{n.expiryDate ? ` · Expires ${formatDate(n.expiryDate)}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Post Notice">
        <form onSubmit={handleAdd} className="flex flex-col gap-5">
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Title *</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.title} onChange={e => set('title',e.target.value)} required /></div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Content *</label>
            <textarea className="input-gold w-full px-4 py-3 text-sm rounded-none resize-none" rows={4} value={form.content} onChange={e => set('content',e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Priority</label>
              <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.priority} onChange={e => set('priority',e.target.value)}>
                <option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option>
              </select></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Expiry Date</label>
              <input type="date" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.expiryDate} onChange={e => set('expiryDate',e.target.value)} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost px-6 py-2.5 text-sm rounded-none">Cancel</button>
            <button type="submit" className="btn-gold px-6 py-2.5 text-sm rounded-none">Post Notice</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
