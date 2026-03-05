import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'HostelHub — Premium Hostel Management',
  description: 'The refined way to manage your hostel. Students, payments, rooms, complaints and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=Cinzel:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster theme="dark" position="top-right" toastOptions={{ style: { background: '#1a1510', border: '1px solid rgba(201,168,76,0.2)', color: '#f5f0e8' } }} />
      </body>
    </html>
  )
}
