import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  })
}

export function getCurrentMonth(): string {
  return new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).replace(' ', '-')
}

export const FACILITIES = [
  'Food (Breakfast, Lunch, Dinner)',
  'Drinking Water',
  'Filter Water',
  'Washing Machine',
  'Fridge',
  'Lift',
  'Dining Area',
  'Hot & Cold Water',
  'WiFi',
  'AC',
  'Cupboard',
  'Locker',
  'Washroom',
  'Room Cleaning',
  'Parking',
  'CCTV',
  'Security Guard',
  'Gym',
  'Iron',
]

export const EXPENSE_CATEGORIES = [
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'water', label: 'Water', icon: '💧' },
  { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { value: 'salary', label: 'Salary', icon: '👥' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'other', label: 'Other', icon: '📦' },
]

export const PAYMENT_METHODS = ['cash', 'upi', 'card', 'bank']

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  normal: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  high: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  urgent: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'in-progress': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  resolved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  paid: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
}
