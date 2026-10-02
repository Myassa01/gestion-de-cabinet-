import { apiClient } from '../../shared/api/client'
import type { AdminPatientListItem } from './types'
import type { CreatePatientFormValues } from './schemas'

export async function fetchAdminPatients(): Promise<AdminPatientListItem[]> {
  const res = await apiClient.get<AdminPatientListItem[]>('/admin/patients')
  return res.data
}

export async function createPatient(input: CreatePatientFormValues): Promise<{ id: string }> {
  const res = await apiClient.post<{ id: string }>('/admin/patients', input)
  return res.data
}
