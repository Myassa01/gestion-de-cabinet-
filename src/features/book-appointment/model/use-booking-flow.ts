import { useState } from 'react'
import type { Doctor } from '../../../entities/doctor/types'

// 1 = Médecin, 2 = Créneau (date + heure combinés), 3 = Motif, 4 = Confirmation
export interface BookingState {
  step: number
  doctor: Doctor | null
  date: string | null // YYYY-MM-DD
  slotStart: string | null // full ISO
  reason: string
}

export function useBookingFlow(initialDoctor: Doctor | null = null) {
  const [state, setState] = useState<BookingState>({
    step: initialDoctor ? 2 : 1,
    doctor: initialDoctor,
    date: null,
    slotStart: null,
    reason: '',
  })

  const selectDoctor = (doctor: Doctor) =>
    setState((s) => ({ ...s, doctor, step: 2, date: null, slotStart: null }))

  const selectDate = (date: string) => setState((s) => ({ ...s, date, slotStart: null }))

  const selectSlot = (slotStart: string) => setState((s) => ({ ...s, slotStart }))

  const setReason = (reason: string) => setState((s) => ({ ...s, reason }))

  const goNext = () => setState((s) => ({ ...s, step: Math.min(s.step + 1, 4) }))
  const goBack = () => setState((s) => ({ ...s, step: Math.max(s.step - 1, 1) }))

  return { state, selectDoctor, selectDate, selectSlot, setReason, goNext, goBack }
}
