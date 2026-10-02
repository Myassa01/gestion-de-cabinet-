import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import {
  fetchAppointment,
  confirmAppointment,
  rejectAppointment,
  cancelAppointment,
} from '../../entities/appointment/api'
import { statusLabel, statusTone } from '../../shared/lib/appointment-status'
import { formatDateTimeFr } from '../../shared/lib/date'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

type ConfirmDialog = 'reject' | 'cancel' | null

export function DoctorAppointmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [dialog, setDialog] = useState<ConfirmDialog>(null)

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => fetchAppointment(id!),
    enabled: !!id,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['appointment', id] })
    queryClient.invalidateQueries({ queryKey: ['appointments', 'mine'] })
  }

  const confirmMutation = useMutation({
    mutationFn: () => confirmAppointment(id!),
    onSuccess: invalidate,
  })
  const rejectMutation = useMutation({
    mutationFn: () => rejectAppointment(id!),
    onSuccess: () => {
      invalidate()
      setDialog(null)
    },
  })
  const cancelMutation = useMutation({
    mutationFn: () => cancelAppointment(id!),
    onSuccess: () => {
      invalidate()
      setDialog(null)
    },
  })

  if (isLoading || !appointment) {
    return (
      <AppLayout>
        <p className="py-12 text-center text-slate-500">Chargement...</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour
      </button>
      <h1 className="mt-3 text-page-title text-slate-900">Détails du rendez-vous</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-base font-semibold text-brand-700">
                {initials(appointment.patient.firstName, appointment.patient.lastName)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </p>
                <p className="text-sm text-slate-500">
                  {appointment.patient.phone ?? 'Téléphone non renseigné'}
                </p>
              </div>
            </div>
            <Badge tone={statusTone(appointment.status)}>{statusLabel(appointment.status)}</Badge>
          </div>

          <p className="mt-4 capitalize text-slate-700">{formatDateTimeFr(appointment.slotStart)}</p>

          {appointment.status === 'CANCELLED' && appointment.cancellationReason && (
            <p className="mt-6 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
              Motif d'annulation : {appointment.cancellationReason}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            {appointment.status === 'PENDING' && (
              <>
                <Button onClick={() => confirmMutation.mutate()} isLoading={confirmMutation.isPending}>
                  Confirmer le rendez-vous
                </Button>
                <Button variant="danger" onClick={() => setDialog('reject')}>
                  Refuser
                </Button>
              </>
            )}
            {appointment.status === 'CONFIRMED' && (
              <Button variant="danger" onClick={() => setDialog('cancel')}>
                Annuler le rendez-vous
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <p className="text-section-title text-slate-900">Motif de consultation</p>
          <p className="mt-2 text-sm text-slate-600">{appointment.reason || 'Aucun motif renseigné.'}</p>
        </Card>
      </div>

      {dialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-sm">
            <p className="font-semibold text-slate-900">
              {dialog === 'reject' ? 'Refuser ce rendez-vous ?' : 'Annuler ce rendez-vous ?'}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Le patient sera notifié. Cette action est irréversible.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDialog(null)}>
                Retour
              </Button>
              <Button
                variant="danger"
                onClick={() => (dialog === 'reject' ? rejectMutation.mutate() : cancelMutation.mutate())}
                isLoading={rejectMutation.isPending || cancelMutation.isPending}
              >
                Confirmer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  )
}
