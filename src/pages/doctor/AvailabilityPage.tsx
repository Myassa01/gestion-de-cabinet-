import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, X, Plus } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Button } from '../../shared/ui/Button'
import {
  fetchMySchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../../entities/availability/api'
import type { RecurringSchedule } from '../../entities/availability/types'

const DAY_LABELS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
// Displayed Monday-first, matching French convention and the reference UI —
// backend dayOfWeek stays 0=Sunday under the hood.
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

const DEFAULT_START = '09:00'
const DEFAULT_END = '12:00'
const DEFAULT_SLOT_MINUTES = 30

interface EditingWindow {
  id: string // real id, or a temp key for a not-yet-created window
  dayOfWeek: number
  startTime: string
  endTime: string
  slotDurationMinutes: number
}

export function AvailabilityPage() {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<EditingWindow | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['availability', 'schedule'],
    queryFn: fetchMySchedule,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['availability', 'schedule'] })

  const createMutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      invalidate()
      setDraft(null)
    },
    onError: () => setFormError("Cette plage horaire n'est pas valide (l'heure de fin doit suivre le début)."),
  })
  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; input: Partial<EditingWindow> }) => updateSchedule(vars.id, vars.input),
    onSuccess: () => {
      invalidate()
      setDraft(null)
    },
    onError: () => setFormError("Cette plage horaire n'est pas valide."),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: invalidate,
  })
  // Deactivating a day can remove several windows at once — firing them
  // through deleteMutation.mutate() in a loop reuses the same mutation's
  // in-flight state for each call, so overlapping requests on a multi-window
  // day could clobber each other's pending/success state and sometimes left
  // the UI showing a window that the server had actually already deleted.
  // Running the raw calls in parallel and invalidating once, after all of
  // them settle, makes "deactivate" an atomic-looking UI action again.
  const deactivateDayMutation = useMutation({
    mutationFn: (windows: RecurringSchedule[]) =>
      Promise.all(windows.map((w) => deleteSchedule(w.id))),
    onSuccess: invalidate,
  })

  const schedulesByDay = (dayOfWeek: number): RecurringSchedule[] =>
    (schedules ?? [])
      .filter((s) => s.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const startEditing = (window: EditingWindow) => {
    setFormError(null)
    setDraft(window)
  }

  const addWindow = (dayOfWeek: number) => {
    startEditing({
      id: `new-${dayOfWeek}-${Date.now()}`,
      dayOfWeek,
      startTime: DEFAULT_START,
      endTime: DEFAULT_END,
      slotDurationMinutes: DEFAULT_SLOT_MINUTES,
    })
  }

  const saveDraft = () => {
    if (!draft) return
    setFormError(null)
    if (draft.endTime <= draft.startTime) {
      setFormError("L'heure de fin doit être après l'heure de début.")
      return
    }
    const isNew = draft.id.startsWith('new-')
    if (isNew) {
      createMutation.mutate({
        dayOfWeek: draft.dayOfWeek,
        startTime: draft.startTime,
        endTime: draft.endTime,
        slotDurationMinutes: draft.slotDurationMinutes,
      })
    } else {
      updateMutation.mutate({
        id: draft.id,
        input: {
          startTime: draft.startTime,
          endTime: draft.endTime,
          slotDurationMinutes: draft.slotDurationMinutes,
        },
      })
    }
  }

  const toggleDay = (dayOfWeek: number, windows: RecurringSchedule[]) => {
    if (windows.length > 0) {
      // Deactivating a day removes every window it has — the backend has
      // no separate "day enabled" flag, only the presence of schedule rows.
      deactivateDayMutation.mutate(windows)
    } else {
      createMutation.mutate({
        dayOfWeek,
        startTime: DEFAULT_START,
        endTime: DEFAULT_END,
        slotDurationMinutes: DEFAULT_SLOT_MINUTES,
      })
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <AppLayout>
      <h1 className="text-page-title text-slate-900">Disponibilités</h1>
      <p className="mt-1 text-sm text-slate-500">Définissez vos disponibilités hebdomadaires.</p>

      {isLoading && <p className="mt-8 text-center text-slate-500">Chargement...</p>}

      {schedules && (
        <Card className="mt-6">
          <div className="flex flex-col divide-y divide-slate-100">
            {DISPLAY_ORDER.map((dayOfWeek) => {
              const windows = schedulesByDay(dayOfWeek)
              const isActive = windows.length > 0
              return (
                <div key={dayOfWeek} className="flex flex-wrap items-center gap-3 py-3">
                  <button
                    role="switch"
                    aria-checked={isActive}
                    disabled={deactivateDayMutation.isPending || createMutation.isPending}
                    onClick={() => toggleDay(dayOfWeek, windows)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      isActive ? 'bg-brand-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        isActive ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className="w-24 shrink-0 text-sm font-medium text-slate-700">
                    {DAY_LABELS[dayOfWeek]}
                  </span>

                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    {!isActive && <span className="text-sm text-slate-400">Jour non travaillé</span>}
                    {windows.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-sm text-slate-700"
                      >
                        <span>
                          {w.startTime} – {w.endTime}
                        </span>
                        <button
                          onClick={() =>
                            startEditing({
                              id: w.id,
                              dayOfWeek: w.dayOfWeek,
                              startTime: w.startTime,
                              endTime: w.endTime,
                              slotDurationMinutes: w.slotDurationMinutes,
                            })
                          }
                          className="text-slate-400 hover:text-brand-600"
                          aria-label="Modifier ce créneau"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(w.id)}
                          className="text-slate-400 hover:text-danger-600"
                          aria-label="Supprimer ce créneau"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                    {isActive && (
                      <button
                        onClick={() => addWindow(dayOfWeek)}
                        className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        Ajouter un créneau
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Les patients ne pourront pas réserver en dehors de vos disponibilités actives.
          </p>
        </Card>
      )}

      {draft && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-sm">
            <p className="font-semibold text-slate-900">{DAY_LABELS[draft.dayOfWeek]}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Début</label>
                <input
                  type="time"
                  value={draft.startTime}
                  onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Fin</label>
                <input
                  type="time"
                  value={draft.endTime}
                  onChange={(e) => setDraft({ ...draft, endTime: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium text-slate-700">Durée des créneaux (minutes)</label>
              <input
                type="number"
                min={5}
                max={240}
                step={5}
                value={draft.slotDurationMinutes}
                onChange={(e) => setDraft({ ...draft, slotDurationMinutes: Number(e.target.value) })}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            {formError && (
              <p role="alert" className="mt-3 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
                {formError}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDraft(null)}>
                Annuler
              </Button>
              <Button onClick={saveDraft} isLoading={isSaving}>
                Enregistrer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AppLayout>
  )
}
