import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Badge } from '../../shared/ui/Badge'
import { fetchAllAppointments } from '../../entities/appointment/api'
import { fetchDoctorsForAdmin } from '../../entities/doctor/api'
import { statusLabel, statusTone, type AppointmentStatus } from '../../shared/lib/appointment-status'
import { formatDateTimeFr, toDateOnly } from '../../shared/lib/date'

type StatusFilter = 'ALL' | AppointmentStatus

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: 'Tous' },
  { key: 'PENDING', label: 'En attente' },
  { key: 'CONFIRMED', label: 'Confirmés' },
  { key: 'COMPLETED', label: 'Terminés' },
  { key: 'CANCELLED', label: 'Annulés' },
]

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

export function AdminAppointmentsPage() {
  const [search, setSearch] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')

  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: ['admin', 'appointments'],
    queryFn: () => fetchAllAppointments(),
  })

  const { data: doctors } = useQuery({
    queryKey: ['admin', 'doctors'],
    queryFn: fetchDoctorsForAdmin,
  })

  const filtered = (appointments ?? []).filter((appt) => {
    const haystack = `${appt.patient.firstName} ${appt.patient.lastName} ${appt.doctor.firstName} ${appt.doctor.lastName}`.toLowerCase()
    const matchesSearch = search.trim() === '' || haystack.includes(search.toLowerCase())
    const matchesDoctor = doctorFilter === '' || appt.doctorId === doctorFilter
    const matchesDate = dateFilter === '' || toDateOnly(new Date(appt.slotStart)) === dateFilter
    const matchesStatus = statusFilter === 'ALL' || appt.status === statusFilter
    return matchesSearch && matchesDoctor && matchesDate && matchesStatus
  })

  return (
    <AppLayout>
      <h1 className="text-page-title text-slate-900">Rendez-vous</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === f.key ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Rechercher patient ou médecin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
        />
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
        >
          <option value="">Tous les médecins</option>
          {(doctors ?? []).map((d) => (
            <option key={d.id} value={d.id}>
              Dr. {d.firstName} {d.lastName}
            </option>
          ))}
        </select>
      </div>

      <Card className="mt-4 overflow-x-auto p-0">
        {isLoading && <p className="p-8 text-center text-slate-500">Chargement...</p>}
        {isError && (
          <p className="p-8 text-center text-danger-600">Impossible de charger les rendez-vous.</p>
        )}

        {appointments && (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Médecin</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((appt) => (
                <tr key={appt.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                        {initials(appt.patient.firstName, appt.patient.lastName)}
                      </div>
                      <span className="font-medium text-slate-900">
                        {appt.patient.firstName} {appt.patient.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    Dr. {appt.doctor.firstName} {appt.doctor.lastName}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">
                    {formatDateTimeFr(appt.slotStart)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(appt.status)}>{statusLabel(appt.status)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {appointments && filtered.length === 0 && (
          <p className="p-8 text-center text-slate-500">Aucun rendez-vous ne correspond à ces filtres.</p>
        )}
      </Card>
    </AppLayout>
  )
}
