'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Search, User, Phone, BedDouble, UtensilsCrossed, Trash2 } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/ui/Modal'
import { formatCurrency, formatDate, getCurrentMonth } from '@/lib/utils'

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', aadharNumber: '', foodPreference: 'veg', bedId: '', monthlyRent: '', dueDate: '5', joinDate: new Date().toISOString().split('T')[0], initAmount: '', initMonth: getCurrentMonth(), initMethod: 'upi' })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const load = async () => {
    const [s, r] = await Promise.all([
      fetch(`/api/students?search=${search}`).then(r => r.json()),
      fetch('/api/rooms?available=true').then(r => r.json()),
    ])
    setStudents(Array.isArray(s) ? s : [])
    setRooms(Array.isArray(r) ? r : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [search])

  // Available beds flat list
  const availableBeds = rooms.flatMap((floor: any) =>
    (floor.rooms || []).flatMap((room: any) =>
      (room.beds || []).filter((b: any) => !b.isOccupied).map((b: any) => ({
        id: b.id, label: `Room ${room.number} — Bed ${b.number} (Floor ${floor.number === 0 ? 'G' : floor.number})`
      }))
    )
  )

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          initialPayment: form.initAmount ? { amount: form.initAmount, month: form.initMonth, method: form.initMethod } : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      toast.success('Student added successfully')
      setShowAdd(false)
      setForm({ name: '', phone: '', email: '', address: '', aadharNumber: '', foodPreference: 'veg', bedId: '', monthlyRent: '', dueDate: '5', joinDate: new Date().toISOString().split('T')[0], initAmount: '', initMonth: getCurrentMonth(), initMethod: 'upi' })
      load()
    } finally { setSaving(false) }
  }

  async function handleRemove(id: string, name: string) {
    if (!confirm(`Remove ${name} and archive their record?`)) return
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Student archived'); load() }
    else toast.error('Failed to remove student')
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <PageHeader title="Students" subtitle={`${students.length} active residents`}
        actions={
          <button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-none">
            <Plus size={15} /> Add Student
          </button>
        }
      />

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(245,240,232,0.3)' }} />
        <input className="input-gold w-full pl-10 pr-4 py-3 text-sm rounded-none" placeholder="Search by name or phone..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map(i => <div key={i} className="h-48 skeleton" />)}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-20">
          <div className="font-cormorant text-2xl font-light mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>No students found</div>
          <p className="text-sm" style={{ color: 'rgba(245,240,232,0.25)' }}>Add your first student to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s: any) => (
            <div key={s.id} className="p-5 transition-all"
              style={{ background: 'rgba(20,16,12,0.8)', border: '1px solid rgba(201,168,76,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(201,168,76,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='rgba(201,168,76,0.1)'}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 flex items-center justify-center font-cormorant text-lg" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#e8c97a' }}>
                  {s.name[0].toUpperCase()}
                </div>
                <button onClick={() => handleRemove(s.id, s.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.25)')}>
                  <Trash2 size={13} style={{ color: 'inherit', transition: 'color .2s' }} />
                </button>
              </div>
              <div className="font-cormorant text-xl font-light mb-3" style={{ color: '#faf8f3' }}>{s.name}</div>
              <div className="flex flex-col gap-2 text-xs" style={{ color: 'rgba(245,240,232,0.45)' }}>
                <div className="flex items-center gap-2"><Phone size={11} /> {s.phone}</div>
                {s.bed && <div className="flex items-center gap-2"><BedDouble size={11} /> Room {s.bed.room?.number} · Bed {s.bed.number}</div>}
                <div className="flex items-center gap-2"><UtensilsCrossed size={11} /> {s.foodPreference === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</div>
              </div>
              <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
                <span className="font-cormorant text-lg" style={{ color: '#e8c97a' }}>{formatCurrency(s.monthlyRent)}<span className="text-xs font-dm" style={{ color: 'rgba(245,240,232,0.3)' }}>/mo</span></span>
                <span className="text-xs" style={{ color: 'rgba(245,240,232,0.3)' }}>Due {s.dueDate}th</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Student Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Student" size="lg">
        <form onSubmit={handleAdd} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Full Name *</label>
              <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Phone *</label>
              <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} required /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Email</label>
              <input type="email" className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="john@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Aadhar Number</label>
              <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="1234-5678-9012" value={form.aadharNumber} onChange={e => set('aadharNumber', e.target.value)} /></div>
          </div>
          <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Address</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="Full address" value={form.address} onChange={e => set('address', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Food Preference</label>
              <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.foodPreference} onChange={e => set('foodPreference', e.target.value)}>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Assign Bed</label>
              <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.bedId} onChange={e => set('bedId', e.target.value)}>
                <option value="">No bed assigned</option>
                {availableBeds.map((b: any) => <option key={b.id} value={b.id}>{b.label}</option>)}
              </select></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Monthly Rent (₹) *</label>
              <input type="number" className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="8000" value={form.monthlyRent} onChange={e => set('monthlyRent', e.target.value)} required /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Due Date (Day of Month)</label>
              <input type="number" min="1" max="31" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} /></div>
            <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Join Date</label>
              <input type="date" className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.joinDate} onChange={e => set('joinDate', e.target.value)} /></div>
          </div>
          {/* Optional initial payment */}
          <div className="pt-4" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
            <div className="text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(201,168,76,0.6)' }}>Initial Payment (Optional)</div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Amount</label>
                <input type="number" className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="8000" value={form.initAmount} onChange={e => set('initAmount', e.target.value)} /></div>
              <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Month</label>
                <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="January-2024" value={form.initMonth} onChange={e => set('initMonth', e.target.value)} /></div>
              <div><label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Method</label>
                <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.initMethod} onChange={e => set('initMethod', e.target.value)}>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                </select></div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost px-6 py-2.5 text-sm rounded-none">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold px-6 py-2.5 text-sm rounded-none">{saving ? 'Adding...' : 'Add Student'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
