'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { FACILITIES } from '@/lib/utils'

const STEPS = ['Basic Info', 'Facilities & Pricing', 'Floors & Rooms']

interface Room { number: string; sharing: number }
interface Floor { number: number; name: string; rooms: Room[] }

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  // Step 1
  const [info, setInfo] = useState({ name: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', description: '' })
  const setI = (k: string, v: string) => setInfo(i => ({ ...i, [k]: v }))

  // Step 2
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [sharingPrices, setSharingPrices] = useState([
    { sharing: 1, price: 0 }, { sharing: 2, price: 0 }, { sharing: 3, price: 0 }
  ])

  // Step 3
  const [floors, setFloors] = useState<Floor[]>([{ number: 0, name: 'Ground Floor', rooms: [] }])

  const toggleFacility = (f: string) =>
    setSelectedFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  function addFloor() {
    const num = floors.length
    setFloors(prev => [...prev, { number: num, name: num === 0 ? 'Ground Floor' : `Floor ${num}`, rooms: [] }])
  }

  function addRoom(floorIdx: number) {
    setFloors(prev => prev.map((f, i) => i === floorIdx ? { ...f, rooms: [...f.rooms, { number: '', sharing: 2 }] } : f))
  }

  function updateRoom(floorIdx: number, roomIdx: number, key: string, value: string | number) {
    setFloors(prev => prev.map((f, i) => i === floorIdx ? {
      ...f,
      rooms: f.rooms.map((r, j) => j === roomIdx ? { ...r, [key]: value } : r)
    } : f))
  }

  function removeRoom(floorIdx: number, roomIdx: number) {
    setFloors(prev => prev.map((f, i) => i === floorIdx ? { ...f, rooms: f.rooms.filter((_, j) => j !== roomIdx) } : f))
  }

  async function handleFinish() {
    if (!info.name) { toast.error('Hostel name is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/hostel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...info,
          facilities: selectedFacilities,
          sharingPrices: sharingPrices.filter(sp => sp.price > 0),
          floors: floors.map(f => ({ ...f, rooms: f.rooms.filter(r => r.number) })),
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      toast.success('Your hostel is ready!')
      router.push('/dashboard')
    } finally { setSaving(false) }
  }

  const pct = Math.round(((step + 1) / STEPS.length) * 100)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'linear-gradient(135deg, #111010 0%, #130f08 100%)' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-cinzel text-2xl tracking-widest mb-1" style={{ color: '#e8c97a' }}>HostelHub</div>
          <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(245,240,232,0.3)' }}>Setup Wizard</div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-0 mb-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-light transition-all"
                  style={{
                    background: i < step ? 'rgba(201,168,76,0.2)' : i === step ? '#c9a84c' : 'transparent',
                    border: i < step ? '1px solid #c9a84c' : i === step ? 'none' : '1px solid rgba(201,168,76,0.2)',
                    color: i < step ? '#c9a84c' : i === step ? '#1a1a1a' : 'rgba(245,240,232,0.3)',
                    fontFamily: 'Cormorant Garamond, serif',
                  }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-xs tracking-wide" style={{ color: i === step ? '#e8c97a' : 'rgba(245,240,232,0.3)', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-16 h-px mx-3 mb-5" style={{ background: i < step ? '#c9a84c' : 'rgba(201,168,76,0.15)' }} />}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-0.5 mb-1" style={{ background: 'rgba(201,168,76,0.1)' }}>
            <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(to right, #8b6914, #e8c97a)' }} />
          </div>
          <div className="text-right text-xs" style={{ color: 'rgba(201,168,76,0.5)' }}>{pct}% complete</div>
        </div>

        {/* Card */}
        <div className="p-8" style={{ background: '#14100c', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>

          {/* STEP 1 */}
          {step === 0 && (
            <div>
              <h2 className="font-cormorant text-2xl font-light mb-6" style={{ color: '#faf8f3' }}>Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Hostel Name *</label>
                  <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="Sunshine Boys Hostel" value={info.name} onChange={e => setI('name', e.target.value)} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Address</label>
                  <input className="input-gold w-full px-4 py-3 text-sm rounded-none" placeholder="123 Main Street" value={info.address} onChange={e => setI('address', e.target.value)} />
                </div>
                {[['city','City'],['state','State'],['pincode','Pincode'],['phone','Phone'],['email','Email']].map(([k, l]) => (
                  <div key={k}>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>{l}</label>
                    <input className="input-gold w-full px-4 py-3 text-sm rounded-none" value={(info as any)[k]} onChange={e => setI(k, e.target.value)} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(245,240,232,0.4)' }}>Description</label>
                  <textarea className="input-gold w-full px-4 py-3 text-sm rounded-none resize-none" rows={3} value={info.description} onChange={e => setI('description', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div>
              <h2 className="font-cormorant text-2xl font-light mb-6" style={{ color: '#faf8f3' }}>Facilities & Pricing</h2>
              <div className="mb-6">
                <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(245,240,232,0.4)' }}>Available Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {FACILITIES.map(f => (
                    <button key={f} type="button" onClick={() => toggleFacility(f)}
                      className="px-3 py-1.5 text-xs transition-all rounded-none"
                      style={{
                        background: selectedFacilities.includes(f) ? 'rgba(201,168,76,0.15)' : 'transparent',
                        border: `1px solid ${selectedFacilities.includes(f) ? '#c9a84c' : 'rgba(201,168,76,0.15)'}`,
                        color: selectedFacilities.includes(f) ? '#e8c97a' : 'rgba(245,240,232,0.4)',
                        cursor: 'pointer',
                      }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(245,240,232,0.4)' }}>Monthly Rent by Sharing</label>
                <div className="flex flex-col gap-3">
                  {sharingPrices.map((sp, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-xs tracking-wide w-20" style={{ color: 'rgba(245,240,232,0.4)' }}>
                        {sp.sharing === 1 ? 'Single' : sp.sharing === 2 ? 'Double' : sp.sharing === 3 ? 'Triple' : `${sp.sharing}-sharing`}
                      </span>
                      <input type="number" className="input-gold flex-1 px-4 py-2 text-sm rounded-none" placeholder="Monthly rent ₹"
                        value={sp.price || ''} onChange={e => setSharingPrices(prev => prev.map((p, j) => j === i ? { ...p, price: parseFloat(e.target.value) || 0 } : p))} />
                    </div>
                  ))}
                  <button type="button" onClick={() => setSharingPrices(prev => [...prev, { sharing: prev.length + 1, price: 0 }])}
                    className="text-xs flex items-center gap-1 mt-1" style={{ color: 'rgba(201,168,76,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Plus size={12} /> Add more sharing types
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div>
              <h2 className="font-cormorant text-2xl font-light mb-6" style={{ color: '#faf8f3' }}>Floors & Rooms</h2>
              <div className="flex flex-col gap-6 max-h-80 overflow-y-auto pr-2">
                {floors.map((floor, fi) => (
                  <div key={fi} className="p-4" style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.08)' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <input className="input-gold flex-1 px-3 py-2 text-sm rounded-none" placeholder="Floor name" value={floor.name}
                        onChange={e => setFloors(prev => prev.map((f, i) => i === fi ? { ...f, name: e.target.value } : f))} />
                      <span className="text-xs" style={{ color: 'rgba(245,240,232,0.3)' }}>Floor {floor.number}</span>
                    </div>
                    {floor.rooms.map((room, ri) => (
                      <div key={ri} className="flex items-center gap-2 mb-2">
                        <input className="input-gold flex-1 px-3 py-2 text-sm rounded-none" placeholder="Room no. e.g. 101"
                          value={room.number} onChange={e => updateRoom(fi, ri, 'number', e.target.value)} />
                        <select className="input-gold px-3 py-2 text-sm rounded-none w-32"
                          value={room.sharing} onChange={e => updateRoom(fi, ri, 'sharing', parseInt(e.target.value))}>
                          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n === 1 ? 'Single' : n === 2 ? 'Double' : n === 3 ? 'Triple' : `${n}-share`}</option>)}
                        </select>
                        <button type="button" onClick={() => removeRoom(fi, ri)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.25)', padding: '4px' }}
                          onMouseEnter={e => e.currentTarget.style.color='#f87171'} onMouseLeave={e => e.currentTarget.style.color='rgba(245,240,232,0.25)'}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addRoom(fi)}
                      className="text-xs flex items-center gap-1 mt-2" style={{ color: 'rgba(201,168,76,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <Plus size={11} /> Add room to this floor
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addFloor} className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm mt-4 rounded-none">
                <Plus size={14} /> Add Floor
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 text-sm transition-all rounded-none"
                style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.15)', color: 'rgba(245,240,232,0.5)', padding: '10px 20px', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#c9a84c'; e.currentTarget.style.color='#e8c97a' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.15)'; e.currentTarget.style.color='rgba(245,240,232,0.5)' }}>
                <ChevronLeft size={14} /> Back
              </button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button onClick={() => { if (step === 0 && !info.name) { toast.error('Hostel name required'); return } setStep(s => s + 1) }}
                className="btn-gold flex items-center gap-2 px-6 py-2.5 text-sm rounded-none">
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={handleFinish} disabled={saving} className="btn-gold flex items-center gap-2 px-8 py-2.5 text-sm rounded-none">
                {saving ? 'Setting up...' : 'Launch Hostel'} {!saving && <ChevronRight size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
