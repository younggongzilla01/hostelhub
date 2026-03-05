'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className={`w-full ${widths[size]} rounded-none`}
        style={{ background: '#14100c', border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', animation: 'modalIn .3s cubic-bezier(.22,1,.36,1)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <h2 className="font-cormorant text-xl font-light" style={{ color: '#faf8f3' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.35)', padding: '4px', transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8c97a')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.35)')}>
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  )
}
