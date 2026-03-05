interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div className="p-6 transition-all duration-300"
      style={{ background: accent ? 'rgba(201,168,76,0.06)' : 'rgba(20,16,12,0.8)', border: `1px solid ${accent ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.1)'}` }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.background = accent ? 'rgba(201,168,76,0.06)' : 'rgba(20,16,12,0.8)')}>
      <div className="font-cormorant text-4xl font-light mb-1" style={{ color: '#e8c97a', lineHeight: 1 }}>{value}</div>
      <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(245,240,232,0.4)' }}>{label}</div>
      {sub && <div className="text-xs mt-2" style={{ color: 'rgba(245,240,232,0.3)' }}>{sub}</div>}
    </div>
  )
}
