import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { DoctorCard } from '../../entities/doctor/ui/DoctorCard'
import { fetchDoctors } from '../../entities/doctor/api'

export function FindDoctorPage() {
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
    <AppLayout>
      <h1 className="text-page-title text-slate-900">Médecins</h1>
      <p className="mt-1 text-sm text-slate-500">Trouvez un médecin et prenez rendez-vous.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Rechercher un médecin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} bookHref={`/book/${doctor.id}`} />
        ))}
      </div>
    </AppLayout>
  )
}
