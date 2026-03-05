'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import PageHeader from '@/components/layout/PageHeader'
import Modal from '@/components/ui/Modal'
import { Plus } from 'lucide-react'

export default function RoomsPage() {
  const [floors, setFloors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ floorId: '', number: '', sharing: '2' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const load = () => {
    fetch(`/api/rooms${availableOnly ? '?available=true' : ''}`)
      .then(r => r.json()).then(d => { setFloors(Array.isArray(d) ? d : []); setLoading(false) })
  }

  useEffect(() => { load() }, [availableOnly])

  async function handleAddRoom(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success('Room added'); setShowAdd(false); load() }
    else toast.error('Failed to add room')
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <PageHeader title="Rooms & Beds" subtitle="Visual occupancy overview"
        actions={
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'rgba(245,240,232,0.5)' }}>
              <div onClick={() => setAvailableOnly(v => !v)} className="relative w-9 h-5 rounded-full transition-colors cursor-pointer"
                style={{ background: availableOnly ? '#c9a84c' : 'rgba(255,255,255,0.1)' }}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: availableOnly ? 'translateX(18px)' : 'translateX(2px)' }} />
              </div>
              Available only
            </label>
            <button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm rounded-none">
              <Plus size={15} /> Add Room
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="grid gap-6">{[...Array(2)].map(i => <div key={i} className="h-40 skeleton" />)}</div>
      ) : floors.length === 0 ? (
        <div className="text-center py-20">
          <div className="font-cormorant text-2xl font-light mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>No rooms yet</div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {floors.map((floor: any) => (
            <div key={floor.id}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(201,168,76,0.6)' }}>
                  {floor.name || `Floor ${floor.number}`}
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(201,168,76,0.1)' }} />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(floor.rooms || []).map((room: any) => (
                  <div key={room.id} className="p-5" style={{ background: 'rgba(20,16,12,0.8)', border: '1px solid rgba(201,168,76,0.1)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-cormorant text-lg" style={{ color: '#faf8f3' }}>Room {room.number}</span>
                      <span className="text-xs tracking-wide" style={{ color: 'rgba(245,240,232,0.3)' }}>{room.sharing} sharing</span>
                    </div>
                    {/* Bed grid */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(room.beds || []).map((bed: any) => (
                        <div key={bed.id} className="flex flex-col items-center gap-1">
                          <div className="w-12 h-10 flex items-center justify-center text-xs transition-all"
                            style={{
                              background: bed.isOccupied ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.1)',
                              border: `1px solid ${bed.isOccupied ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.3)'}`,
                              color: bed.isOccupied ? '#f87171' : '#4ade80',
                            }}>
                            B{bed.number}
                          </div>
                          {bed.student && (
                            <span className="text-center" style={{ fontSize: '9px', color: 'rgba(245,240,232,0.4)', maxWidth: '48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {bed.student.name.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: 'rgba(245,240,232,0.35)' }}>
                      <span style={{ color: '#4ade80' }}>{room.availableBeds} free</span>
                      <span style={{ color: '#f87171' }}>{room.occupiedBeds} occupied</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Room">
        <form onSubmit={handleAddRoom} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Floor</label>
            <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.floorId} onChange={e => set('floorId', e.target.value)} required>
              <option value="">Select floor</option>
              {floors.map(f => <option key={f.id} value={f.id}>{f.name || `Floor ${f.number}`}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Room Number</label>
            <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="e.g. 201" value={form.number} onChange={e => set('number', e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Sharing Type</label>
            <select className="input-gold w-full px-4 py-3 text-sm rounded-none" value={form.sharing} onChange={e => set('sharing', e.target.value)}>
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n === 1 ? 'Single' : n === 2 ? 'Double' : n === 3 ? 'Triple' : `${n}-sharing`}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost px-6 py-2.5 text-sm rounded-none">Cancel</button>
            <button type="submit" className="btn-gold px-6 py-2.5 text-sm rounded-none">Add Room</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
