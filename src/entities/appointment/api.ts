import { apiClient } from '../../shared/api/client'
import type { Appointment } from './types'

export interface CreateAppointmentInput {
  doctorId: string
  slotStart: string
  reason?: string
}

export async function createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
  const res = await apiClient.post<Appointment>('/appointments', input)
  return res.data
}

export async function fetchMyAppointments(): Promise<Appointment[]> {
  const res = await apiClient.get<Appointment[]>('/appointments/me')
  return res.data
}

export interface AdminAppointmentsQuery {
  doctorId?: string
  patientId?: string
  status?: string
}

export async function fetchAllAppointments(query: AdminAppointmentsQuery = {}): Promise<Appointment[]> {
  const res = await apiClient.get<Appointment[]>('/appointments', { params: query })
  return res.data
}

export async function fetchAppointment(id: string): Promise<Appointment> {
  const res = await apiClient.get<Appointment>(`/appointments/${id}`)
  return res.data
}

export async function cancelAppointment(id: string, reason?: string): Promise<Appointment> {
  const res = await apiClient.patch<Appointment>(`/appointments/${id}/cancel`, { reason })
  return res.data
}

export async function rescheduleAppointment(id: string, slotStart: string): Promise<Appointment> {
  const res = await apiClient.patch<Appointment>(`/appointments/${id}/reschedule`, { slotStart })
  return res.data
}

export async function confirmAppointment(id: string): Promise<Appointment> {
  const res = await apiClient.patch<Appointment>(`/appointments/${id}/confirm`)
  return res.data
}

export async function rejectAppointment(id: string, reason?: string): Promise<Appointment> {
  const res = await apiClient.patch<Appointment>(`/appointments/${id}/reject`, { reason })
  return res.data
}
