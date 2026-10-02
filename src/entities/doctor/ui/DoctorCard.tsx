import { Link } from 'react-router-dom'
import { Card } from '../../../shared/ui/Card'
import { Button } from '../../../shared/ui/Button'
import type { Doctor } from '../types'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

interface DoctorCardProps {
  doctor: Doctor
  bookHref: string
}

export function DoctorCard({ doctor, bookHref }: DoctorCardProps) {
  return (
    <Card className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700">
        {initials(doctor.firstName, doctor.lastName)}
      </div>
      <div>
        <p className="font-semibold text-slate-900">
          Dr. {doctor.firstName} {doctor.lastName}
        </p>
        <p className="text-sm text-slate-500">{doctor.specialty}</p>
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <Link to={`/doctors/${doctor.id}`}>
          <Button variant="secondary" size="sm" className="w-full">
            Voir le profil
          </Button>
        </Link>
        <Link to={bookHref}>
          <Button size="sm" className="w-full">
            Prendre RDV
          </Button>
        </Link>
      </div>
    </Card>
  )
}
