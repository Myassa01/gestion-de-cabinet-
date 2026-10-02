import { apiClient } from '../../shared/api/client'
import type { AdminDoctorListItem, Doctor, Slot } from './types'
import type { CreateDoctorFormValues } from './schemas'

export async function fetchDoctors(): Promise<Doctor[]> {
  const res = await apiClient.get<Doctor[]>('/doctors')
  return res.data
}

export async function fetchDoctorsForAdmin(): Promise<AdminDoctorListItem[]> {
  const res = await apiClient.get<AdminDoctorListItem[]>('/doctors/all')
  return res.data
}

export async function deactivateDoctor(id: string): Promise<Doctor> {
  const res = await apiClient.patch<Doctor>(`/doctors/${id}/deactivate`)
  return res.data
}

export async function reactivateDoctor(id: string): Promise<Doctor> {
  const res = await apiClient.patch<Doctor>(`/doctors/${id}/reactivate`)
  return res.data
}

export async function createDoctor(input: CreateDoctorFormValues): Promise<Doctor> {
  const res = await apiClient.post<Doctor>('/doctors', input)
  return res.data
}

export async function fetchDoctor(id: string): Promise<Doctor> {
  const res = await apiClient.get<Doctor>(`/doctors/${id}`)
  return res.data
}

export async function fetchAvailableSlots(doctorId: string, date: string): Promise<Slot[]> {
  const res = await apiClient.get<Slot[]>(`/doctors/${doctorId}/slots`, { params: { date } })
  return res.data
}
