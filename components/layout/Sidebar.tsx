'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  LayoutDashboard, Users, BedDouble, CreditCard, Receipt,
  UserCheck, MessageSquare, Wrench, Bell, FileText,
  Archive, LogOut, Menu, X, ChevronLeft, Download
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/rooms', label: 'Rooms & Beds', icon: BedDouble },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/expenses', label: 'Expenses', icon: Receipt },
  { href: '/visitors', label: 'Visitors', icon: UserCheck },
  { href: '/complaints', label: 'Complaints', icon: MessageSquare },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench },
  { href: '/notices', label: 'Notice Board', icon: Bell },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/old-students', label: 'Archive', icon: Archive },
]

interface SidebarProps {
  hostelName?: string
  userName?: string
}

export default function Sidebar({ hostelName, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Signed out')
    router.push('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
        <div className="font-cinzel text-lg tracking-widest" style={{ color: '#e8c97a' }}>HostelHub</div>
        {hostelName && <div className="text-xs mt-1 truncate" style={{ color: 'rgba(245,240,232,0.35)', letterSpacing: '0.05em' }}>{hostelName}</div>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <a key={href} href={href}
              onClick={e => { e.preventDefault(); setOpen(false); router.push(href) }}
              className="flex items-center gap-3 px-6 py-3 text-sm transition-all"
              style={{
                color: active ? '#e8c97a' : 'rgba(245,240,232,0.45)',
                background: active ? 'rgba(201,168,76,0.07)' : 'transparent',
                borderLeft: active ? '2px solid #c9a84c' : '2px solid transparent',
                letterSpacing: '0.04em',
              }}>
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </a>
          )
        })}
      </nav>

      {/* Export */}
      <div className="px-4 pb-2">
        <div className="text-xs tracking-widest uppercase px-2 mb-2" style={{ color: 'rgba(245,240,232,0.2)' }}>Export Data</div>
        {['students', 'payments', 'expenses'].map(type => (
          <a key={type} href={`/api/export?type=${type}`} download
            className="flex items-center gap-2 px-2 py-2 text-xs rounded-none transition-colors"
            style={{ color: 'rgba(245,240,232,0.3)', letterSpacing: '0.05em' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.3)')}>
            <Download size={11} /> {type}.csv
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
        {userName && <div className="text-xs mb-3 px-2 truncate" style={{ color: 'rgba(245,240,232,0.35)' }}>{userName}</div>}
        <button onClick={logout} className="flex items-center gap-2 w-full px-2 py-2 text-sm transition-colors text-left rounded-none"
          style={{ color: 'rgba(245,240,232,0.3)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ff5f57')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,240,232,0.3)')}>
          <LogOut size={14} strokeWidth={1.5} /> Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0"
        style={{ background: '#0a0805', borderRight: '1px solid rgba(201,168,76,0.1)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2"
        style={{ background: 'rgba(10,8,5,0.9)', border: '1px solid rgba(201,168,76,0.2)', color: '#e8c97a' }}>
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}
          style={{ background: 'rgba(0,0,0,0.6)' }} />
      )}

      {/* Mobile drawer */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-56 z-50 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#0a0805', borderRight: '1px solid rgba(201,168,76,0.1)' }}>
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4"
          style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,0.4)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>
    </>
  )
}
