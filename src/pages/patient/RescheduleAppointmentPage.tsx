import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ArrowLeft } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Button } from '../../shared/ui/Button'
import { StepChooseSlot } from '../../features/book-appointment/ui/StepChooseSlot'
import { fetchAppointment, rescheduleAppointment } from '../../entities/appointment/api'
import { fetchDoctor } from '../../entities/doctor/api'

export function RescheduleAppointmentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [date, setDate] = useState<string | null>(null)
  const [slotStart, setSlotStart] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: appointment } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => fetchAppointment(id!),
    enabled: !!id,
  })

  const { data: doctor } = useQuery({
    queryKey: ['doctor', appointment?.doctorId],
    queryFn: () => fetchDoctor(appointment!.doctorId),
    enabled: !!appointment,
  })

  const rescheduleMutation = useMutation({
    mutationFn: () => rescheduleAppointment(id!, slotStart!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      queryClient.invalidateQueries({ queryKey: ['appointments', 'mine'] });
      navigate(`/app/appointments/${id}`, { replace: true })
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.status === 409) {
        setError("Ce créneau n'est plus disponible. Veuillez en choisir un autre.")
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.')
      }
    },
  })

  if (!appointment || !doctor) {
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
      <h1 className="mt-3 text-page-title text-slate-900">Modifier le rendez-vous</h1>
      <p className="mt-1 text-sm text-slate-500">
        Choisissez un nouveau créneau. Le médecin devra confirmer à nouveau le rendez-vous.
      </p>

      <Card className="mt-6">
        <StepChooseSlot
          doctor={doctor}
          date={date}
          selectedSlot={slotStart}
          onSelectDate={setDate}
          onSelectSlot={setSlotStart}
        />

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button
            onClick={() => rescheduleMutation.mutate()}
            disabled={!slotStart}
            isLoading={rescheduleMutation.isPending}
          >
            Confirmer le nouveau créneau
          </Button>
        </div>
      </Card>
    </AppLayout>
  )
}
