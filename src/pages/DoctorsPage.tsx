import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PublicLayout } from '../shared/ui/layout/PublicLayout'
import { DoctorCard } from '../entities/doctor/ui/DoctorCard'
import { fetchDoctors } from '../entities/doctor/api'

export function DoctorsPage() {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('')

  const { data: doctors, isLoading, isError } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  })

  const specialties = useMemo(
    () => Array.from(new Set((doctors ?? []).map((d) => d.specialty))).sort(),
    [doctors],
  )

  const filtered = useMemo(() => {
    return (doctors ?? []).filter((doctor) => {
      const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
      const matchesSearch = search.trim() === '' || fullName.includes(search.toLowerCase())
      const matchesSpecialty = specialty === '' || doctor.specialty === specialty
      return matchesSearch && matchesSpecialty
    })
  }, [doctors, search, specialty])

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-page-title text-slate-900">Médecins</h1>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            placeholder="Rechercher un médecin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">Toutes les spécialités</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <p className="mt-8 text-center text-slate-500">Chargement...</p>}
        {isError && (
          <p className="mt-8 text-center text-danger-600">
            Impossible de charger la liste des médecins.
          </p>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <p className="mt-8 text-center text-slate-500">Aucun médecin ne correspond à votre recherche.</p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} bookHref={`/book/${doctor.id}`} />
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
