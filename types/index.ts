export interface User {
  id: string
  email: string
  name: string
  phone?: string | null
  createdAt: string
  hostel?: Hostel | null
}

export interface Hostel {
  id: string
  name: string
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  phone?: string | null
  email?: string | null
  description?: string | null
  totalFloors: number
  totalRooms: number
  totalBeds: number
  facilities?: Facility[]
  sharingPrices?: SharingPrice[]
  floors?: Floor[]
}

export interface Facility {
  id: string
  name: string
  icon?: string | null
}

export interface SharingPrice {
  id: string
  sharing: number
  price: number
}

export interface Floor {
  id: string
  number: number
  name?: string | null
  rooms?: Room[]
}

export interface Room {
  id: string
  number: string
  sharing: number
  totalBeds: number
  floor?: Floor
  beds?: Bed[]
  availableBeds?: number
  occupiedBeds?: number
}

export interface Bed {
  id: string
  number: number
  isOccupied: boolean
  roomId: string
  student?: Student | null
}

export interface Student {
  id: string
  name: string
  phone: string
  email?: string | null
  address?: string | null
  aadharNumber?: string | null
  foodPreference: string
  monthlyRent: number
  dueDate: number
  joinDate: string
  bed?: Bed & { room?: Room & { floor?: Floor } } | null
  payments?: Payment[]
}

export interface Payment {
  id: string
  studentId: string
  amount: number
  paymentDate: string
  month: string
  method: string
  status: string
  notes?: string | null
  student?: { name: string; bed?: { room?: { number: string } } | null }
}

export interface Expense {
  id: string
  category: string
  description: string
  amount: number
  date: string
}

export interface Visitor {
  id: string
  studentId?: string | null
  name: string
  phone?: string | null
  purpose: string
  inTime: string
  outTime?: string | null
}

export interface Complaint {
  id: string
  studentId?: string | null
  studentName: string
  title: string
  description: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
}

export interface Maintenance {
  id: string
  roomNumber: string
  issue: string
  description?: string | null
  status: string
  priority: string
  cost?: number | null
  createdAt: string
  updatedAt: string
}

export interface Notice {
  id: string
  title: string
  content: string
  priority: string
  expiryDate?: string | null
  isActive: boolean
  createdAt: string
}

export interface Invoice {
  id: string
  studentId?: string | null
  studentName: string
  roomNumber?: string | null
  amount: number
  month: string
  status: string
  dueDate?: string | null
  createdAt: string
}

export interface OldStudent {
  id: string
  name: string
  phone: string
  email?: string | null
  roomNumber?: string | null
  monthlyRent?: number | null
  totalPaid: number
  joinDate?: string | null
  leaveDate: string
}

export interface DashboardStats {
  totalStudents: number
  totalRooms: number
  totalBeds: number
  availableBeds: number
  occupiedBeds: number
  occupancyRate: number
  vegStudents: number
  nonVegStudents: number
  oldStudentsCount: number
  revenue: {
    currentMonth: number
    pending: number
  }
  dueSoonStudents: Student[]
}
