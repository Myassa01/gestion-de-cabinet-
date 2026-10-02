import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Hourglass, CheckCircle2, Clock, Palmtree } from 'lucide-react'
import { useAuth } from '../../features/auth/model/use-auth'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import { StatTile } from '../../shared/ui/charts/StatTile'
import { fetchMyAppointments } from '../../entities/appointment/api'
import { statusLabel, statusTone } from '../../shared/lib/appointment-status'
import { formatDateTimeFr } from '../../shared/lib/date'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

function isSameDay(iso: string, reference: Date): boolean {
  const date = new Date(iso)
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  )
}

export function DoctorDashboardPage() {
  const { user } = useAuth()
  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: ['appointments', 'mine'],
    queryFn: fetchMyAppointments,
  })

  // Frozen once per mount — see MyAppointmentsPage/PatientHomePage for why
  // (avoids two renders in the same paint briefly disagreeing on "now").
  const now = useMemo(() => new Date(), [])
  const todaysAppointments = (appointments ?? []).filter(
    (a) => isSameDay(a.slotStart, now) && a.status !== 'CANCELLED',
  )
  const pendingCount = (appointments ?? []).filter((a) => a.status === 'PENDING').length
  const confirmedCount = (appointments ?? []).filter((a) => a.status === 'CONFIRMED').length

  const upcoming = [...(appointments ?? [])]
    .filter((a) => new Date(a.slotStart).getTime() > now.getTime() && a.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime())
    .slice(0, 5)

  return (
    <AppLayout>
      <h1 className="text-page-title text-slate-900">
        Bonjour, Dr. {user?.doctor?.lastName}
      </h1>

      {isLoading && <p className="mt-8 text-center text-slate-500">Chargement...</p>}
      {isError && (
        <p className="mt-8 text-center text-danger-600">Impossible de charger vos rendez-vous.</p>
      )}

      {appointments && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile label="Rendez-vous aujourd'hui" value={todaysAppointments.length} icon={Calendar} />
            <StatTile label="En attente" value={pendingCount} icon={Hourglass} />
            <StatTile label="Confirmés" value={confirmedCount} icon={CheckCircle2} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-section-title text-slate-900">Prochains rendez-vous</p>
                <Link to="/app/doctor-appointments" className="text-sm font-medium text-brand-600 hover:underline">
                  Voir tout
                </Link>
              </div>
              <div className="mt-3 flex flex-col divide-y divide-slate-100">
                {upcoming.map((appt) => (
                  <div key={appt.id} className="flex items-center gap-3 py-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                      {initials(appt.patient.firstName, appt.patient.lastName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {appt.patient.firstName} {appt.patient.lastName}
                      </p>
                      <p className="truncate text-xs capitalize text-slate-500">
                        {formatDateTimeFr(appt.slotStart)}
                      </p>
                    </div>
                    <Badge tone={statusTone(appt.status)}>{statusLabel(appt.status)}</Badge>
                  </div>
                ))}
                {upcoming.length === 0 && (
                  <p className="py-3 text-sm text-slate-500">Aucun rendez-vous à venir.</p>
                )}
              </div>
            </Card>

            <Card>
              <p className="text-section-title text-slate-900">Actions rapides</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link to="/app/agenda">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    Voir mon agenda
                  </Button>
                </Link>
                <Link to="/app/availability">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    Gérer mes disponibilités
                  </Button>
                </Link>
                <Link to="/app/absences">
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <Palmtree className="h-4 w-4" aria-hidden="true" />
                    Déclarer une absence
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  )
}
