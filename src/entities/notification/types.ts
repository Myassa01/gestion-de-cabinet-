export type NotificationType =
  | 'APPOINTMENT_CREATED'
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_REJECTED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED'
  | 'APPOINTMENT_REMINDER'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  isRead: boolean
  createdAt: string
  appointmentId: string | null
}
