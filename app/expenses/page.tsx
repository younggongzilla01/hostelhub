'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/ui/Modal'
import { formatCurrency, formatDate, EXPENSE_CATEGORIES } from '@/lib/utils'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ category: 'electricity', description: '', amount: '', date: new Date().toISOString().split('T')[0] })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const load = () => fetch(`/api/expenses?category=${category}`).then(r => r.json()).then(d => { setExpenses(Array.isArray(d) ? d : []); setLoading(false) })
  useEffect(() => { load() }, [category])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Expense added'); setShowAdd(false); load() }
    else toast.error('Failed')
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <PageHeader title="Expenses" subtitle={`${formatCurrency(total)} total`}
        actions={<button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-none"><Plus size={15} /> Add Expense</button>}
      />
      <div className="flex flex-wrap gap-1 mb-6">
        {[{ value: 'all', label: 'All' }, ...EXPENSE_CATEGORIES].map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)} className="px-4 py-2 text-xs tracking-wide uppercase transition-all rounded-none"
            style={{ background: category===c.value?'rgba(201,168,76,0.12)':'transparent', color: category===c.value?'#e8c97a':'rgba(245,240,232,0.4)', border:`1px solid ${category===c.value?'rgba(201,168,76,0.3)':'rgba(201,168,76,0.08)'}`, cursor:'pointer' }}>
            {c.label}
          </button>
        ))}
      </div>
      {loading ? <div className="h-64 skeleton" /> : (
        <div style={{ border: '1px solid rgba(201,168,76,0.1)' }}>
          {expenses.length === 0 ? <div className="text-center py-16 text-sm" style={{ color: 'rgba(245,240,232,0.3)' }}>No expenses found</div> :
          expenses.map((e: any) => {
            const cat = EXPENSE_CATEGORIES.find(c => c.value === e.category)
            return (
              <div key={e.id} className="flex items-center justify-between px-6 py-4 border-b transition-colors"
                style={{ borderColor: 'rgba(201,168,76,0.06)' }}
                onMouseEnter={el => el.currentTarget.style.background='rgba(201,168,76,0.03)'}
                onMouseLeave={el => el.currentTarget.style.background='transparent'}>
                <div className="flex items-center gap-4">
                  <span className="text-lg">{cat?.icon || '📦'}</span>
                  <div>
                    <div className="text-sm" style={{ color: 'rgba(245,240,232,0.8)' }}>{e.description}</div>
                    <div className="text-xs mt-0.5 capitalize" style={{ color: 'rgba(245,240,232,0.35)' }}>{e.category} · {formatDate(e.date)}</div>
                  </div>
                </div>
                <span className="font-cormorant text-xl" style={{ color: '#e8c97a' }}>{formatCurrency(e.amount)}</span>
              </div>
            )
          })}
        </div>
      )}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Expense">
        <form onSubmit={handleAdd} className="flex flex-col gap-5">
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Category</label>
            <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.category} onChange={e => set('category',e.target.value)}>
              {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select></div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Description *</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.description} onChange={e => set('description',e.target.value)} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Amount (₹) *</label>
              <input type="number" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.amount} onChange={e => set('amount',e.target.value)} required /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Date</label>
              <input type="date" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.date} onChange={e => set('date',e.target.value)} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost px-6 py-2.5 text-sm rounded-none">Cancel</button>
            <button type="submit" className="btn-gold px-6 py-2.5 text-sm rounded-none">Add Expense</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
