import { apiClient } from '../../shared/api/client'
import type { Notification } from './types'

export async function fetchMyNotifications(): Promise<Notification[]> {
  const res = await apiClient.get<Notification[]>('/notifications/me')
  return res.data
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`)
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all')
}
