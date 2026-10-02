import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import { fetchMyAppointments } from '../../entities/appointment/api'
import { statusLabel, statusTone } from '../../shared/lib/appointment-status'
import { formatDateTimeFr } from '../../shared/lib/date'

type FilterKey = 'ALL' | 'UPCOMING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'ALL', label: 'Tous' },
  { key: 'UPCOMING', label: 'À venir' },
  { key: 'CONFIRMED', label: 'Confirmés' },
  { key: 'COMPLETED', label: 'Terminés' },
  { key: 'CANCELLED', label: 'Annulés' },
]

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

export function MyAppointmentsPage() {
  const [filter, setFilter] = useState<FilterKey>('ALL')
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', 'mine'],
    queryFn: fetchMyAppointments,
  })

  // Frozen once per mount rather than read fresh on every render — avoids
  // two renders in the same paint (React 18+ concurrent rendering) briefly
  // disagreeing on which side of "now" a given appointment falls.
  const now = useMemo(() => Date.now(), [])
  const filtered = (appointments ?? []).filter((appt) => {
    switch (filter) {
      case 'UPCOMING':
        return new Date(appt.slotStart).getTime() > now && appt.status !== 'CANCELLED'
      case 'CONFIRMED':
        return appt.status === 'CONFIRMED'
      case 'COMPLETED':
        return appt.status === 'COMPLETED'
      case 'CANCELLED':
        return appt.status === 'CANCELLED'
      default:
        return true
    }
  })

  return (
    <AppLayout>
      <h1 className="text-page-title text-slate-900">Mes rendez-vous</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {isLoading && <p className="py-8 text-center text-slate-500">Chargement...</p>}

        {!isLoading && filtered.length === 0 && (
          <Card className="py-8 text-center text-slate-500">Aucun rendez-vous dans cette catégorie.</Card>
        )}

        {filtered.map((appt) => (
          <Card key={appt.id} className="flex flex-wrap items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {initials(appt.doctor.firstName, appt.doctor.lastName)}
            </div>
            <div className="min-w-45 flex-1">
              <p className="font-medium text-slate-900">
                Dr. {appt.doctor.firstName} {appt.doctor.lastName}
              </p>
              <p className="text-sm text-slate-500">{appt.doctor.specialty}</p>
            </div>
            <p className="text-sm capitalize text-slate-600">{formatDateTimeFr(appt.slotStart)}</p>
            <Badge tone={statusTone(appt.status)}>{statusLabel(appt.status)}</Badge>
            <Link to={`/app/appointments/${appt.id}`}>
              <Button size="sm">Détails</Button>
            </Link>
          </Card>
        ))}
      </div>
    </AppLayout>
  )
}
