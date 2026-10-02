import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Button } from '../../shared/ui/Button'
import { StepIndicator } from '../../features/book-appointment/ui/StepIndicator'
import { StepChooseDoctor } from '../../features/book-appointment/ui/StepChooseDoctor'
import { StepChooseSlot } from '../../features/book-appointment/ui/StepChooseSlot'
import { StepReason } from '../../features/book-appointment/ui/StepReason'
import { StepConfirm } from '../../features/book-appointment/ui/StepConfirm'
import { useBookingFlow } from '../../features/book-appointment/model/use-booking-flow'
import { fetchDoctor } from '../../entities/doctor/api'
import { createAppointment } from '../../entities/appointment/api'

export function BookAppointmentPage() {
  const { doctorId } = useParams<{ doctorId?: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: preselectedDoctor } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => fetchDoctor(doctorId!),
    enabled: !!doctorId,
  })

  const { state, selectDoctor, selectDate, selectSlot, setReason, goNext, goBack } =
    useBookingFlow(preselectedDoctor ?? null)

  // preselectedDoctor arrives async after the hook's initial state — adopt
  // it once loaded if the flow hasn't already picked a (possibly different)
  // doctor via the search step.
  if (preselectedDoctor && !state.doctor) {
    selectDoctor(preselectedDoctor)
  }

  const bookingMutation = useMutation({
    mutationFn: () =>
      createAppointment({
        doctorId: state.doctor!.id,
        slotStart: state.slotStart!,
        reason: state.reason || undefined,
      }),
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'mine'] })
      navigate(`/app/appointments/${appointment.id}`, { replace: true })
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 409) {
        setSubmitError(
          "Ce créneau vient d'être réservé par quelqu'un d'autre. Veuillez en choisir un autre.",
        )
      } else if (error instanceof AxiosError && error.response?.status === 400) {
        setSubmitError(error.response.data?.message ?? 'Ce créneau n’est plus valide.')
      } else {
        setSubmitError('Une erreur est survenue. Veuillez réessayer.')
      }
    },
  })

  const handleConfirm = () => {
    setSubmitError(null)
    bookingMutation.mutate()
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-page-title text-slate-900">Prenez votre rendez-vous</h1>

        <div className="mt-6">
          <StepIndicator currentStep={state.step} />
        </div>

        <Card className="mt-8">
          {state.step === 1 && <StepChooseDoctor onSelect={selectDoctor} />}

          {state.step === 2 && state.doctor && (
            <StepChooseSlot
              doctor={state.doctor}
              date={state.date}
              selectedSlot={state.slotStart}
              onSelectDate={selectDate}
              onSelectSlot={selectSlot}
            />
          )}

          {state.step === 3 && <StepReason reason={state.reason} onChange={setReason} />}

          {state.step === 4 && state.doctor && state.slotStart && (
            <StepConfirm doctor={state.doctor} slotStart={state.slotStart} reason={state.reason} />
          )}

          {submitError && (
            <p role="alert" className="mt-4 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {submitError}
            </p>
          )}

          <div className="mt-6 flex justify-between border-t border-slate-100 pt-5">
            <Button variant="secondary" onClick={goBack} disabled={state.step === 1}>
              Retour
            </Button>

            {state.step < 3 && (
              <Button onClick={goNext} disabled={state.step === 2 ? !state.slotStart : false}>
                Continuer
              </Button>
            )}
            {state.step === 3 && <Button onClick={goNext}>Continuer</Button>}
            {state.step === 4 && (
              <Button onClick={handleConfirm} isLoading={bookingMutation.isPending}>
                Confirmer le rendez-vous
              </Button>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
