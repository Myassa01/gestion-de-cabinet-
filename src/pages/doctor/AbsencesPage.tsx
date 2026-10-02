import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Button } from '../../shared/ui/Button'
import { Input } from '../../shared/ui/Input'
import { fetchMyAbsences, createAbsence, deleteAbsence } from '../../entities/availability/api'
import { formatDateFr, toDateOnly } from '../../shared/lib/date'

export function AbsencesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const { data: absences, isLoading } = useQuery({
    queryKey: ['availability', 'absences'],
    queryFn: fetchMyAbsences,
  })

  const createMutation = useMutation({
    mutationFn: createAbsence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', 'absences'] })
      setShowForm(false)
      setStartDate('')
      setEndDate('')
      setReason('')
    },
    onError: () => setFormError("Une erreur est survenue. Vérifiez que la date de fin suit la date de début."),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAbsence,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['availability', 'absences'] }),
  })

  const handleSubmit = () => {
    setFormError(null)
    if (!startDate || !endDate) {
      setFormError('Veuillez renseigner les deux dates.')
      return
    }
    createMutation.mutate({
      startsAt: new Date(`${startDate}T00:00:00`).toISOString(),
      endsAt: new Date(`${endDate}T23:59:59`).toISOString(),
      reason: reason || undefined,
    })
  }

  const upcoming = [...(absences ?? [])].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  )

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-slate-900">Absences</h1>
          <p className="mt-1 text-sm text-slate-500">Gérez vos congés et absences.</p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Déclarer une absence
        </Button>
      </div>

      <Card className="mt-6">
        <p className="text-section-title text-slate-900">Absences à venir</p>
        {isLoading && <p className="mt-3 text-sm text-slate-500">Chargement...</p>}
        <div className="mt-3 flex flex-col divide-y divide-slate-100">
          {upcoming.map((absence) => (
            <div key={absence.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium capitalize text-slate-900">
                  {formatDateFr(toDateOnly(new Date(absence.startsAt)))}
                  {toDateOnly(new Date(absence.startsAt)) !== toDateOnly(new Date(absence.endsAt)) && (
                    <> → {formatDateFr(toDateOnly(new Date(absence.endsAt)))}</>
                  )}
                </p>
                {absence.reason && <p className="text-sm text-slate-500">{absence.reason}</p>}
              </div>
              <button
                onClick={() => deleteMutation.mutate(absence.id)}
                className="text-sm font-medium text-danger-600 hover:underline"
              >
                Supprimer
              </button>
            </div>
          ))}
          {!isLoading && upcoming.length === 0 && (
            <p className="py-3 text-sm text-slate-500">Aucune absence prévue.</p>
          )}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Les patients ne pourront pas réserver pendant vos absences.
        </p>
      </Card>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-sm">
            <p className="font-semibold text-slate-900">Déclarer une absence</p>
            <div className="mt-4 flex flex-col gap-3">
              <Input
                label="Date de début"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="Date de fin"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Input
                label="Motif (optionnel)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Congés, formation..."
              />
            </div>

            {formError && (
              <p role="alert" className="mt-3 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
                {formError}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} isLoading={createMutation.isPending}>
                Enregistrer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  )
}
