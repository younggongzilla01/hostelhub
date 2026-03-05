'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  actions?: React.ReactNode
}

export default function PageHeader({ title, subtitle, backHref, actions }: PageHeaderProps) {
  const router = useRouter()
  return (
    <div className="flex items-start justify-between px-8 pt-8 pb-6">
      <div className="flex items-start gap-4">
        {backHref && (
          <button onClick={() => router.push(backHref)}
            className="mt-1 flex items-center justify-center w-8 h-8 transition-all"
            style={{ border: '1px solid rgba(201,168,76,0.2)', background: 'transparent', cursor: 'pointer', color: 'rgba(245,240,232,0.5)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#c9a84c'; e.currentTarget.style.color='#e8c97a' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.2)'; e.currentTarget.style.color='rgba(245,240,232,0.5)' }}>
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
        )}
        <div>
          <h1 className="font-cormorant text-3xl font-light" style={{ color: '#faf8f3' }}>{title}</h1>
          {subtitle && <p className="text-sm mt-1" style={{ color: 'rgba(245,240,232,0.4)' }}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
