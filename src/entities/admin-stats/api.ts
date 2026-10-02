import { apiClient } from '../../shared/api/client'
import type { DashboardStats } from './types'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await apiClient.get<DashboardStats>('/admin/stats')
  return res.data
}
