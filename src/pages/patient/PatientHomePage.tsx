import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../features/auth/model/use-auth'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import { fetchMyAppointments } from '../../entities/appointment/api'
import { statusLabel, statusTone } from '../../shared/lib/appointment-status'
import { formatDateTimeFr } from '../../shared/lib/date'

export function PatientHomePage() {
  const { user } = useAuth()
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', 'mine'],
    queryFn: fetchMyAppointments,
  })

  const now = useMemo(() => Date.now(), [])
  const upcoming = (appointments ?? [])
    .filter((a) => new Date(a.slotStart).getTime() > now && a.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime())
  const nextAppointment = upcoming[0]

  const confirmedCount = (appointments ?? []).filter((a) => a.status === 'CONFIRMED').length
  const pendingCount = (appointments ?? []).filter((a) => a.status === 'PENDING').length
  const completedCount = (appointments ?? []).filter((a) => a.status === 'COMPLETED').length

  const recent = [...(appointments ?? [])]
    .sort((a, b) => new Date(b.slotStart).getTime() - new Date(a.slotStart).getTime())
    .slice(0, 5)

  return (
    <AppLayout>
      <h1 className="text-page-title text-slate-900">Bonjour, {user?.patient?.firstName}</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-section-title text-slate-900">Prochain rendez-vous</p>
          {isLoading && <p className="mt-3 text-sm text-slate-500">Chargement...</p>}
          {!isLoading && !nextAppointment && (
            <p className="mt-3 text-sm text-slate-500">Aucun rendez-vous à venir.</p>
          )}
          {nextAppointment && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">
                  Dr. {nextAppointment.doctor.firstName} {nextAppointment.doctor.lastName}
                </p>
                <p className="text-sm capitalize text-slate-500">
                  {formatDateTimeFr(nextAppointment.slotStart)}
                </p>
              </div>
              <Badge tone={statusTone(nextAppointment.status)}>{statusLabel(nextAppointment.status)}</Badge>
            </div>
          )}
          <Link to="/app/doctors">
            <Button className="mt-4">Prendre un nouveau rendez-vous</Button>
          </Link>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <p className="text-2xl font-bold text-slate-900">{confirmedCount}</p>
            <p className="text-sm text-slate-500">Confirmés</p>
          </Card>
          <Card>
            <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
            <p className="text-sm text-slate-500">En attente</p>
          </Card>
          <Card>
            <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
            <p className="text-sm text-slate-500">Terminés</p>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-section-title text-slate-900">Rendez-vous récents</p>
          <Link to="/app/appointments" className="text-sm font-medium text-brand-600 hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="mt-3 flex flex-col divide-y divide-slate-100">
          {recent.map((appt) => (
            <div key={appt.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-slate-700">
                Dr. {appt.doctor.firstName} {appt.doctor.lastName}
              </span>
              <span className="capitalize text-slate-500">{formatDateTimeFr(appt.slotStart)}</span>
              <Badge tone={statusTone(appt.status)}>{statusLabel(appt.status)}</Badge>
            </div>
          ))}
          {recent.length === 0 && !isLoading && (
            <p className="py-3 text-sm text-slate-500">Aucun rendez-vous pour le moment.</p>
          )}
        </div>
      </Card>
    </AppLayout>
  )
}
