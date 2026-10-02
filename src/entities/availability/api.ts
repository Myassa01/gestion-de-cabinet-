import { apiClient } from '../../shared/api/client'
import type { RecurringSchedule, Absence } from './types'

export interface CreateScheduleInput {
  dayOfWeek: number
  startTime: string
  endTime: string
  slotDurationMinutes: number
}

export async function fetchMySchedule(): Promise<RecurringSchedule[]> {
  const res = await apiClient.get<RecurringSchedule[]>('/me/schedule')
  return res.data
}

export async function createSchedule(input: CreateScheduleInput): Promise<RecurringSchedule> {
  const res = await apiClient.post<RecurringSchedule>('/me/schedule', input)
  return res.data
}

export async function updateSchedule(
  id: string,
  input: Partial<CreateScheduleInput>,
): Promise<RecurringSchedule> {
  const res = await apiClient.patch<RecurringSchedule>(`/me/schedule/${id}`, input)
  return res.data
}

export async function deleteSchedule(id: string): Promise<void> {
  await apiClient.delete(`/me/schedule/${id}`)
}

export async function fetchMyAbsences(): Promise<Absence[]> {
  const res = await apiClient.get<Absence[]>('/me/absences')
  return res.data
}

export interface CreateAbsenceInput {
  startsAt: string
  endsAt: string
  reason?: string
}

export async function createAbsence(input: CreateAbsenceInput): Promise<Absence> {
  const res = await apiClient.post<Absence>('/me/absences', input)
  return res.data
}

export async function deleteAbsence(id: string): Promise<void> {
  await apiClient.delete(`/me/absences/${id}`)
}
