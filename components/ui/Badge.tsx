const STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  paid: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  pending: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  'in-progress': { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
  resolved: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  completed: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  active: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  low: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  normal: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
  high: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  urgent: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
}

interface BadgeProps {
  label: string
  variant?: string
}

export default function Badge({ label, variant }: BadgeProps) {
  const key = variant || label.toLowerCase()
  const style = STATUS_STYLES[key] || { color: 'rgba(245,240,232,0.5)', bg: 'rgba(245,240,232,0.05)', border: 'rgba(245,240,232,0.1)' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: style.color, background: style.bg, border: `1px solid ${style.border}`, borderRadius: '2px' }}>
      {label}
    </span>
  )
}
