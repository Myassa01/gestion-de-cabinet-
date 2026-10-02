import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchDoctors } from '../../../entities/doctor/api'
import type { Doctor } from '../../../entities/doctor/types'
import { Card } from '../../../shared/ui/Card'
import { Button } from '../../../shared/ui/Button'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

export function StepChooseDoctor({ onSelect }: { onSelect: (doctor: Doctor) => void }) {
  const [search, setSearch] = useState('')
  const { data: doctors, isLoading } = useQuery({ queryKey: ['doctors'], queryFn: fetchDoctors })

  const filtered = (doctors ?? []).filter((d) =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <input
        type="search"
        placeholder="Rechercher un médecin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />

      {isLoading && <p className="mt-6 text-center text-slate-500">Chargement...</p>}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((doctor) => (
          <Card key={doctor.id} className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {initials(doctor.firstName, doctor.lastName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </p>
              <p className="truncate text-sm text-slate-500">{doctor.specialty}</p>
            </div>
            <Button size="sm" onClick={() => onSelect(doctor)}>
              Choisir
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
