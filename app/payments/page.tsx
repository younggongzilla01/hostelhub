'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, CheckCircle } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate, getCurrentMonth } from '@/lib/utils'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ studentId: '', amount: '', paymentDate: new Date().toISOString().split('T')[0], month: getCurrentMonth(), method: 'cash', status: 'paid', notes: '' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const load = () => {
    Promise.all([
      fetch(`/api/payments?status=${status}`).then(r => r.json()),
      fetch('/api/students').then(r => r.json()),
    ]).then(([p, s]) => { setPayments(Array.isArray(p) ? p : []); setStudents(Array.isArray(s) ? s : []); setLoading(false) })
  }

  useEffect(() => { load() }, [status])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const res = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Payment recorded'); setShowAdd(false); load() }
    else { const d = await res.json(); toast.error(d.error) }
    setSaving(false)
  }

  async function markPaid(id: string) {
    await fetch(`/api/payments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'paid', paymentDate: new Date() }) })
    toast.success('Marked as paid'); load()
  }

  const total = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <PageHeader title="Payments" subtitle={`${payments.length} records · ${formatCurrency(total)} collected`}
        actions={
          <button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-none">
            <Plus size={15} /> Record Payment
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6">
        {['all', 'paid', 'pending'].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className="px-4 py-2 text-xs tracking-widest uppercase transition-all rounded-none"
            style={{ background: status === s ? 'rgba(201,168,76,0.12)' : 'transparent', color: status === s ? '#e8c97a' : 'rgba(245,240,232,0.4)', border: `1px solid ${status === s ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.08)'}`, cursor: 'pointer' }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <div className="h-64 skeleton" /> : (
        <div style={{ border: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="grid text-xs tracking-widest uppercase px-6 py-3 border-b" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', borderColor: 'rgba(201,168,76,0.08)', color: 'rgba(245,240,232,0.3)', background: 'rgba(201,168,76,0.03)' }}>
            <span>Student</span><span>Month</span><span>Amount</span><span>Method</span><span>Status</span>
          </div>
          {payments.length === 0 ? (
            <div className="text-center py-16 text-sm" style={{ color: 'rgba(245,240,232,0.3)' }}>No payments found</div>
          ) : payments.map((p: any) => (
            <div key={p.id} className="grid items-center px-6 py-4 border-b transition-colors"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', borderColor: 'rgba(201,168,76,0.05)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <div>
                <div className="text-sm" style={{ color: 'rgba(245,240,232,0.8)' }}>{p.student?.name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(245,240,232,0.3)' }}>Room {p.student?.bed?.room?.number || '-'}</div>
              </div>
              <span className="text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>{p.month}</span>
              <span className="text-sm font-cormorant text-lg" style={{ color: '#e8c97a' }}>{formatCurrency(p.amount)}</span>
              <span className="text-xs capitalize" style={{ color: 'rgba(245,240,232,0.4)' }}>{p.method}</span>
              <div className="flex items-center gap-2">
                <Badge label={p.status} />
                {p.status === 'pending' && (
                  <button onClick={() => markPaid(p.id)} title="Mark paid" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4ade80', padding: '2px' }}>
                    <CheckCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Record Payment">
        <form onSubmit={handleAdd} className="flex flex-col gap-5">
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Student *</label>
            <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.studentId} onChange={e => { set('studentId', e.target.value); const s = students.find(s => s.id === e.target.value); if (s) set('amount', String(s.monthlyRent)) }} required>
              <option value="">Select student</option>
              {students.map((s: any) => <option key={s.id} value={s.id}>{s.name} — Room {s.bed?.room?.number || 'Unassigned'}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Amount (₹)</label>
              <input type="number" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.amount} onChange={e => set('amount', e.target.value)} required /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Month</label>
              <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.month} onChange={e => set('month', e.target.value)} /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Payment Date</label>
              <input type="date" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.paymentDate} onChange={e => set('paymentDate', e.target.value)} /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Method</label>
              <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.method} onChange={e => set('method', e.target.value)}>
                <option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="bank">Bank Transfer</option>
              </select></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Status</label>
              <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="paid">Paid</option><option value="pending">Pending</option>
              </select></div>
          </div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Notes</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="Optional notes" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost px-6 py-2.5 text-sm rounded-none">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold px-6 py-2.5 text-sm rounded-none">{saving ? 'Saving...' : 'Record Payment'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
