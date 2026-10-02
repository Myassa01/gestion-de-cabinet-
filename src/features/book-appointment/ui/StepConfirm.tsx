import { Calendar } from 'lucide-react'
import type { Doctor } from '../../../entities/doctor/types'
import { formatDateTimeFr } from '../../../shared/lib/date'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

interface StepConfirmProps {
  doctor: Doctor
  slotStart: string
  reason: string
}

export function StepConfirm({ doctor, slotStart, reason }: StepConfirmProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-700">
        {initials(doctor.firstName, doctor.lastName)}
      </div>
      <p className="mt-3 text-lg font-semibold text-slate-900">
        Dr. {doctor.firstName} {doctor.lastName}
      </p>
      <p className="text-sm text-slate-500">{doctor.specialty}</p>

      <div className="mt-6 w-full max-w-sm rounded-lg bg-slate-50 p-4 text-left text-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="capitalize">{formatDateTimeFr(slotStart)}</span>
        </div>
        {reason && (
          <div className="mt-2 border-t border-slate-200 pt-2 text-slate-600">
            <span className="font-medium">Motif : </span>
            {reason}
          </div>
        )}
      </div>
    </div>
  )
}
