import { useQuery } from '@tanstack/react-query'
import { fetchAvailableSlots } from '../../../entities/doctor/api'
import type { Doctor } from '../../../entities/doctor/types'
import { nextDays, formatDateFr, formatTimeFr, toDateOnly } from '../../../shared/lib/date'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

interface StepChooseSlotProps {
  doctor: Doctor
  date: string | null
  selectedSlot: string | null
  onSelectDate: (date: string) => void
  onSelectSlot: (slotStart: string) => void
}

export function StepChooseSlot({ doctor, date, selectedSlot, onSelectDate, onSelectSlot }: StepChooseSlotProps) {
  const availableDates = nextDays(21)
  const effectiveDate = date ?? availableDates[0]

  const { data: slots, isLoading } = useQuery({
    queryKey: ['slots', doctor.id, effectiveDate],
    queryFn: () => fetchAvailableSlots(doctor.id, effectiveDate),
  })

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="flex shrink-0 flex-col items-center gap-2 sm:w-48 sm:items-start">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-base font-semibold text-brand-700">
          {initials(doctor.firstName, doctor.lastName)}
        </div>
        <p className="text-center font-medium text-slate-900 sm:text-left">
          Dr. {doctor.firstName} {doctor.lastName}
        </p>
        <p className="text-sm text-slate-500">{doctor.specialty}</p>
      </div>

      <div className="flex-1">
        <label htmlFor="booking-date" className="text-sm font-medium text-slate-700">
          Date
        </label>
        <select
          id="booking-date"
          value={effectiveDate}
          onChange={(e) => onSelectDate(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 sm:w-64"
        >
          {availableDates.map((d) => (
            <option key={d} value={d}>
              {formatDateFr(d)}
              {d === toDateOnly(new Date()) ? " (aujourd'hui)" : ''}
            </option>
          ))}
        </select>

        <div className="mt-4">
          {isLoading && <p className="text-sm text-slate-500">Chargement des créneaux...</p>}
          {!isLoading && slots?.length === 0 && (
            <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              Aucun créneau disponible pour cette date. Essayez une autre date.
            </p>
          )}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots?.map((slot) => {
              const isSelected = slot.start === selectedSlot
              return (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => onSelectSlot(slot.start)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300 text-slate-700 hover:border-brand-400 hover:bg-brand-50'
                  }`}
                >
                  {formatTimeFr(slot.start)}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
