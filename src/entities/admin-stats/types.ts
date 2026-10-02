import type { AppointmentStatus } from '../../shared/lib/appointment-status'

export interface DashboardStats {
  counts: {
    patients: number
    doctors: number
    appointmentsToday: number
    confirmedAppointments: number
  }
  appointmentsPerDay: { date: string; count: number }[]
  statusBreakdown: { status: AppointmentStatus; count: number }[]
  recentActivity: RecentActivityItem[]
}

export interface RecentActivityItem {
  type: 'APPOINTMENT_CREATED' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'USER_REGISTERED'
  message: string
  at: string
}
