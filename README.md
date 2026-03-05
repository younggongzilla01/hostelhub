# HostelHub — Premium Hostel Management System

A complete, production-ready hostel management web application built with Next.js 14, TypeScript, Tailwind CSS, and Prisma + SQLite.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
```bash
mkdir -p db
npx prisma generate
npx prisma db push
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## First Time Use

1. Go to `/login` and click **Create Account**
2. Register with your name, email, and password
3. You'll be redirected to the **Setup Wizard** (3 steps):
   - **Step 1**: Enter hostel name, address, contact info
   - **Step 2**: Select facilities, set monthly rent by sharing type
   - **Step 3**: Add floors and rooms (beds auto-created)
4. Hit **Launch Hostel** → you're on the dashboard!

---

## Features

| Module | Description |
|--------|-------------|
| Dashboard | Real-time stats, revenue, occupancy, due-soon list |
| Students | Add, search, view, remove (auto-archived) |
| Rooms & Beds | Visual bed map per floor/room |
| Payments | Record, filter, mark paid |
| Expenses | Track by category with totals |
| Visitors | Check-in/check-out with timestamps |
| Complaints | Register, prioritize, resolve |
| Maintenance | Track issues from pending to completion |
| Notices | Post, manage, delete |
| Invoices | Generate and track |
| Archive | Search past student records |
| Export | Download CSV for students/payments/expenses |

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom gold/dark luxury theme)
- **Prisma ORM** + **SQLite** (local file database)
- **Sonner** for toast notifications
- **Lucide React** for icons

---

## Database Commands

```bash
# View database in browser
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Re-generate Prisma client after schema changes
npx prisma generate
```

---

## Environment Variables

Create a `.env` file (already included):
```
DATABASE_URL="file:./db/hostelhub.db"
SESSION_SECRET="your-secret-here"
```

---

## Project Structure

```
hostelhub/
├── app/
│   ├── api/               # All REST API routes
│   ├── login/             # Auth page
│   ├── setup/             # 3-step wizard
│   ├── dashboard/         # Main dashboard
│   ├── students/          # Student management
│   ├── rooms/             # Room & bed tracker
│   ├── payments/          # Payment tracking
│   ├── expenses/          # Expense management
│   ├── visitors/          # Visitor logbook
│   ├── complaints/        # Complaint handling
│   ├── maintenance/       # Maintenance requests
│   ├── notices/           # Notice board
│   ├── invoices/          # Invoice generation
│   └── old-students/      # Alumni archive
├── components/
│   ├── layout/            # Sidebar, AppLayout, PageHeader
│   └── ui/                # Modal, Badge, StatCard
├── lib/
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # Auth utilities
│   └── utils.ts           # Helpers
├── prisma/
│   └── schema.prisma      # 17 database models
└── types/
    └── index.ts           # TypeScript types
```
