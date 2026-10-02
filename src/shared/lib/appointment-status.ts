export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'

type Tone = 'brand' | 'success' | 'danger' | 'warning' | 'neutral'

const STATUS_INFO: Record<AppointmentStatus, { label: string; tone: Tone }> = {
  PENDING: { label: 'En attente', tone: 'warning' },
  CONFIRMED: { label: 'Confirmé', tone: 'success' },
  CANCELLED: { label: 'Annulé', tone: 'danger' },
  COMPLETED: { label: 'Terminé', tone: 'neutral' },
  NO_SHOW: { label: 'Absence', tone: 'danger' },
}

export function statusLabel(status: AppointmentStatus): string {
  return STATUS_INFO[status].label
}

export function statusTone(status: AppointmentStatus): Tone {
  return STATUS_INFO[status].tone
}
