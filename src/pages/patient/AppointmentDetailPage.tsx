import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import { fetchAppointment, cancelAppointment } from '../../entities/appointment/api'
import { statusLabel, statusTone } from '../../shared/lib/appointment-status'
import { formatDateTimeFr } from '../../shared/lib/date'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

const TIMELINE_STEPS = [
  { key: 'PENDING', label: 'Demande envoyée' },
  { key: 'CONFIRMED', label: 'Rendez-vous confirmé' },
  { key: 'COMPLETED', label: 'Terminé' },
]

export function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => fetchAppointment(id!),
    enabled: !!id,
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelAppointment(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', id] })
      queryClient.invalidateQueries({ queryKey: ['appointments', 'mine'] })
      setShowCancelConfirm(false)
    },
  })

  if (isLoading || !appointment) {
    return (
      <AppLayout>
        <p className="py-12 text-center text-slate-500">Chargement...</p>
      </AppLayout>
    )
  }

  const isCancelled = appointment.status === 'CANCELLED'
  const isNoShow = appointment.status === 'NO_SHOW'
  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.key === appointment.status)
  const canModify = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'

  return (
    <AppLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour
      </button>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-page-title text-slate-900">Détails du rendez-vous</h1>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-base font-semibold text-brand-700">
                {initials(appointment.doctor.firstName, appointment.doctor.lastName)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                </p>
                <p className="text-sm text-slate-500">{appointment.doctor.specialty}</p>
              </div>
            </div>
            <Badge tone={statusTone(appointment.status)}>{statusLabel(appointment.status)}</Badge>
          </div>

          <p className="mt-4 capitalize text-slate-700">{formatDateTimeFr(appointment.slotStart)}</p>

          {!isCancelled && !isNoShow && (
            <div className="mt-8 flex items-center">
              {TIMELINE_STEPS.map((step, index) => {
                const isDone = index <= currentStepIndex
                return (
                  <div key={step.key} className="flex flex-1 flex-col items-center last:flex-none">
                    <div className="flex w-full items-center">
                      <div
                        className={`h-3 w-3 shrink-0 rounded-full ${isDone ? 'bg-brand-600' : 'bg-slate-200'}`}
                      />
                      {index < TIMELINE_STEPS.length - 1 && (
                        <div className={`h-0.5 flex-1 ${isDone ? 'bg-brand-600' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <span className="mt-1.5 text-center text-xs text-slate-500">{step.label}</span>
                  </div>
                )
              })}
            </div>
          )}

          {appointment.status === 'CANCELLED' && appointment.cancellationReason && (
            <p className="mt-6 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
              Motif d'annulation : {appointment.cancellationReason}
            </p>
          )}

          {canModify && (
            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
              <Button
                variant="secondary"
                onClick={() => navigate(`/app/appointments/${appointment.id}/reschedule`)}
              >
                Modifier
              </Button>
              <Button variant="danger" onClick={() => setShowCancelConfirm(true)}>
                Annuler
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <p className="text-section-title text-slate-900">Informations du rendez-vous</p>
          <p className="mt-2 text-sm text-slate-600">
            {appointment.reason || 'Aucun motif renseigné.'}
          </p>
        </Card>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-sm">
            <p className="font-semibold text-slate-900">Annuler ce rendez-vous ?</p>
            <p className="mt-1 text-sm text-slate-600">Cette action est irréversible.</p>
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowCancelConfirm(false)}>
                Retour
              </Button>
              <Button
                variant="danger"
                onClick={() => cancelMutation.mutate()}
                isLoading={cancelMutation.isPending}
              >
                Confirmer l'annulation
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  )
}
