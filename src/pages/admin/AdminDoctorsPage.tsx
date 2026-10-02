import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Badge } from '../../shared/ui/Badge'
import { Button } from '../../shared/ui/Button'
import { fetchDoctorsForAdmin, deactivateDoctor, reactivateDoctor } from '../../entities/doctor/api'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

export function AdminDoctorsPage() {
  const [search, setSearch] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  const queryClient = useQueryClient()

  const { data: doctors, isLoading, isError } = useQuery({
    queryKey: ['admin', 'doctors'],
    queryFn: fetchDoctorsForAdmin,
  })

  const toggleMutation = useMutation({
    mutationFn: (vars: { id: string; isActive: boolean }) =>
      vars.isActive ? deactivateDoctor(vars.id) : reactivateDoctor(vars.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] }),
  })

  const specialties = Array.from(new Set((doctors ?? []).map((d) => d.specialty))).sort()

  const filtered = (doctors ?? []).filter((d) => {
    const fullName = `${d.firstName} ${d.lastName}`.toLowerCase()
    const matchesSearch = search.trim() === '' || fullName.includes(search.toLowerCase())
    const matchesSpecialty = specialtyFilter === '' || d.specialty === specialtyFilter
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && d.isActive) ||
      (statusFilter === 'INACTIVE' && !d.isActive)
    return matchesSearch && matchesSpecialty && matchesStatus
  })

  return (
    <AppLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-slate-900">Médecins</h1>
        <Link to="/app/doctors/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter un médecin
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Rechercher un médecin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
        >
          <option value="">Toutes spécialités</option>
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
        >
          <option value="ALL">Tous statuts</option>
          <option value="ACTIVE">Actif</option>
          <option value="INACTIVE">Inactif</option>
        </select>
      </div>

      <Card className="mt-4 overflow-x-auto p-0">
        {isLoading && <p className="p-8 text-center text-slate-500">Chargement...</p>}
        {isError && <p className="p-8 text-center text-danger-600">Impossible de charger les médecins.</p>}

        {doctors && (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Médecin</th>
                <th className="px-4 py-3 font-medium">Spécialité</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Aujourd'hui</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                        {initials(doctor.firstName, doctor.lastName)}
                      </div>
                      <span className="font-medium text-slate-900">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{doctor.specialty}</td>
                  <td className="px-4 py-3">
                    <Badge tone={doctor.isActive ? 'success' : 'neutral'}>
                      {doctor.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {doctor.absentToday ? (
                      <Badge tone="warning">Absent</Badge>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant={doctor.isActive ? 'danger' : 'secondary'}
                      onClick={() => toggleMutation.mutate({ id: doctor.id, isActive: doctor.isActive })}
                      isLoading={toggleMutation.isPending && toggleMutation.variables?.id === doctor.id}
                    >
                      {doctor.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {doctors && filtered.length === 0 && (
          <p className="p-8 text-center text-slate-500">Aucun médecin ne correspond à ces filtres.</p>
        )}
      </Card>
    </AppLayout>
  )
}
