import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Button } from '../../shared/ui/Button'
import { AppointmentBlock } from '../../features/doctor-agenda/ui/AppointmentBlock'
import { fetchMyAppointments } from '../../entities/appointment/api'
import { weekDays, formatShortDayFr, isSameDate, formatDateFr, toDateOnly } from '../../shared/lib/date'

type ViewMode = 'day' | 'week'

export function AgendaPage() {
  const navigate = useNavigate()
  const [anchorDate, setAnchorDate] = useState(() => new Date())
  const [view, setView] = useState<ViewMode>('week')

  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: ['appointments', 'mine'],
    queryFn: fetchMyAppointments,
  })

  const days = view === 'week' ? weekDays(anchorDate) : [anchorDate]

  const shiftDate = (delta: number) => {
    const next = new Date(anchorDate)
    next.setDate(next.getDate() + delta * (view === 'week' ? 7 : 1))
    setAnchorDate(next)
  }

  const appointmentsFor = (day: Date) =>
    (appointments ?? [])
      .filter((a) => a.status !== 'CANCELLED' && isSameDate(new Date(a.slotStart), day))
      .sort((a, b) => new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime())

  return (
    <AppLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-slate-900">Agenda</h1>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-slate-300">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 text-sm font-medium ${view === 'day' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'}`}
            >
              Jour
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium ${view === 'week' ? 'bg-brand-600 text-white' : 'bg-white text-slate-600'}`}
            >
              Semaine
            </button>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => shiftDate(-1)}
            aria-label="Période précédente"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setAnchorDate(new Date())}>
            Aujourd'hui
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => shiftDate(1)}
            aria-label="Période suivante"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isLoading && <p className="mt-8 text-center text-slate-500">Chargement...</p>}
      {isError && (
        <p className="mt-8 text-center text-danger-600">Impossible de charger l'agenda.</p>
      )}

      {appointments && (
        <div
          className="mt-4 grid gap-3"
          style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
        >
          {days.map((day) => {
            const dayAppointments = appointmentsFor(day)
            const isToday = isSameDate(day, new Date())
            return (
              <Card key={toDateOnly(day)} className="flex flex-col gap-2 p-3">
                <div
                  className={`rounded-md px-2 py-1 text-center text-xs font-medium ${
                    isToday ? 'bg-brand-600 text-white' : 'text-slate-500'
                  }`}
                >
                  {view === 'week' ? (
                    <>
                      {formatShortDayFr(day)} {day.getDate()}
                    </>
                  ) : (
                    <span className="capitalize">{formatDateFr(toDateOnly(day))}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  {dayAppointments.map((appt) => (
                    <AppointmentBlock
                      key={appt.id}
                      appointment={appt}
                      onClick={() => navigate(`/app/doctor-appointments/${appt.id}`)}
                    />
                  ))}
                  {dayAppointments.length === 0 && (
                    <p className="py-2 text-center text-xs text-slate-300">—</p>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </AppLayout>
  )
}
