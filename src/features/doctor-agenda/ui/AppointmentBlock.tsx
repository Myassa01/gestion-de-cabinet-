import type { Appointment } from '../../../entities/appointment/types'
import { formatTimeFr } from '../../../shared/lib/date'

// Soft fills (not the saturated chart-status hexes) — these are large filled
// blocks with text on top, not thin chart marks, so they follow the same
// tone system as Badge (bg-{tone}-50/text-{tone}-700 family) for contrast
// and visual consistency with the rest of the app.
const BLOCK_CLASSES: Record<Appointment['status'], string> = {
  PENDING: 'bg-warning-50 text-warning-700 border-warning-100',
  CONFIRMED: 'bg-success-50 text-success-700 border-success-100',
  CANCELLED: 'bg-danger-50 text-danger-700 border-danger-100',
  COMPLETED: 'bg-slate-100 text-slate-600 border-slate-200',
  NO_SHOW: 'bg-danger-50 text-danger-700 border-danger-100',
}

interface AppointmentBlockProps {
  appointment: Appointment
  onClick: () => void
}

export function AppointmentBlock({ appointment, onClick }: AppointmentBlockProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md border px-2 py-1.5 text-left text-xs transition-shadow hover:shadow-sm ${BLOCK_CLASSES[appointment.status]}`}
    >
      <p className="truncate font-medium">
        {appointment.patient.firstName} {appointment.patient.lastName}
      </p>
      <p className="truncate opacity-80">{formatTimeFr(appointment.slotStart)}</p>
    </button>
  )
}
