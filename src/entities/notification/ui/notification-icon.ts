import type { NotificationType } from '../types'

const ICON: Record<NotificationType, string> = {
  APPOINTMENT_CREATED: '📅',
  APPOINTMENT_CONFIRMED: '✅',
  APPOINTMENT_REJECTED: '❌',
  APPOINTMENT_CANCELLED: '❌',
  APPOINTMENT_RESCHEDULED: '🔄',
  APPOINTMENT_REMINDER: '⏰',
}

export function notificationIcon(type: NotificationType): string {
  return ICON[type]
}
