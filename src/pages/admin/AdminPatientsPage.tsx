import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Button } from '../../shared/ui/Button'
import { fetchAdminPatients } from '../../entities/admin-patients/api'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

export function AdminPatientsPage() {
  const [search, setSearch] = useState('')

  const { data: patients, isLoading, isError } = useQuery({
    queryKey: ['admin', 'patients'],
    queryFn: fetchAdminPatients,
  })

  const filtered = (patients ?? []).filter((p) => {
    const haystack = `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase()
    return search.trim() === '' || haystack.includes(search.toLowerCase())
  })

  return (
    <AppLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-page-title text-slate-900">Patients</h1>
        <Link to="/app/admin-patients/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter un patient
          </Button>
        </Link>
      </div>

      <input
        type="search"
        placeholder="Rechercher un patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-4 w-full max-w-sm rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />

      <Card className="mt-4 overflow-x-auto p-0">
        {isLoading && <p className="p-8 text-center text-slate-500">Chargement...</p>}
        {isError && <p className="p-8 text-center text-danger-600">Impossible de charger les patients.</p>}

        {patients && (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium">Rendez-vous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                        {initials(patient.firstName, patient.lastName)}
                      </div>
                      <span className="font-medium text-slate-900">
                        {patient.firstName} {patient.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{patient.email}</td>
                  <td className="px-4 py-3 text-slate-600">{patient.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{patient.appointmentCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {patients && filtered.length === 0 && (
          <p className="p-8 text-center text-slate-500">Aucun patient ne correspond à cette recherche.</p>
        )}
      </Card>
    </AppLayout>
  )
}
