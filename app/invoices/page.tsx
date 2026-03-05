'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate, getCurrentMonth } from '@/lib/utils'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ studentId: '', studentName: '', roomNumber: '', amount: '', month: getCurrentMonth(), dueDate: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    Promise.all([fetch('/api/invoices').then(r=>r.json()), fetch('/api/students').then(r=>r.json())])
      .then(([inv, stu]) => { setInvoices(Array.isArray(inv)?inv:[]); setStudents(Array.isArray(stu)?stu:[]); setLoading(false) })
  }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Invoice created'); setShowAdd(false); setInvoices(await fetch('/api/invoices').then(r=>r.json())) }
    else toast.error('Failed')
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <PageHeader title="Invoices" subtitle={`${invoices.length} total`}
        actions={<button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-none"><Plus size={15} /> Generate</button>}
      />
      {loading ? <div className="h-64 skeleton" /> : (
        <div style={{ border: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="grid text-xs tracking-widest uppercase px-6 py-3 border-b" style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr', borderColor:'rgba(201,168,76,0.08)', color:'rgba(245,240,232,0.3)', background:'rgba(201,168,76,0.03)' }}>
            <span>Student</span><span>Month</span><span>Amount</span><span>Status</span>
          </div>
          {invoices.length === 0 ? <div className="text-center py-16 text-sm" style={{ color: 'rgba(245,240,232,0.3)' }}>No invoices yet</div> :
          invoices.map((inv: any) => (
            <div key={inv.id} className="grid items-center px-6 py-4 border-b transition-colors"
              style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr', borderColor:'rgba(201,168,76,0.05)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <div>
                <div className="text-sm" style={{ color:'rgba(245,240,232,0.8)' }}>{inv.studentName}</div>
                {inv.roomNumber && <div className="text-xs mt-0.5" style={{ color:'rgba(245,240,232,0.3)' }}>Room {inv.roomNumber}</div>}
              </div>
              <span className="text-sm" style={{ color:'rgba(245,240,232,0.5)' }}>{inv.month}</span>
              <span className="font-cormorant text-xl" style={{ color:'#e8c97a' }}>{formatCurrency(inv.amount)}</span>
              <Badge label={inv.status} />
            </div>
          ))}
        </div>
      )}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Generate Invoice">
        <form onSubmit={handleAdd} className="flex flex-col gap-5">
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Student</label>
            <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.studentId} onChange={e => { const s=students.find(x=>x.id===e.target.value); set('studentId',e.target.value); if(s){set('studentName',s.name);set('roomNumber',s.bed?.room?.number||'');set('amount',String(s.monthlyRent))}}}>
              <option value="">Select student</option>
              {students.map((s:any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Amount (₹)</label>
              <input type="number" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.amount} onChange={e => set('amount',e.target.value)} required /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Month</label>
              <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.month} onChange={e => set('month',e.target.value)} /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Due Date</label>
              <input type="date" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.dueDate} onChange={e => set('dueDate',e.target.value)} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost px-6 py-2.5 text-sm rounded-none">Cancel</button>
            <button type="submit" className="btn-gold px-6 py-2.5 text-sm rounded-none">Generate</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
