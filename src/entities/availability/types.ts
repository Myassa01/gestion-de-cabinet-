export interface RecurringSchedule {
  id: string
  doctorId: string
  dayOfWeek: number // 0 = Sunday .. 6 = Saturday
  startTime: string // "HH:mm"
  endTime: string
  slotDurationMinutes: number
}

export interface Absence {
  id: string
  doctorId: string
  type: 'ABSENCE' | 'EXTRA'
  startsAt: string
  endsAt: string
  reason: string | null
}
