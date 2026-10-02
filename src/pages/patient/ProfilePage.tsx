import { useAuth } from '../../features/auth/model/use-auth'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Badge } from '../../shared/ui/Badge'
import { Input } from '../../shared/ui/Input'
import { Button } from '../../shared/ui/Button'

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

const ROLE_LABEL = { PATIENT: 'Patient', DOCTOR: 'Médecin', ADMIN: 'Administrateur' } as const

// Shared across all three roles — the profile shape differs (specialty for
// a doctor, phone for a patient, neither for an admin) but the layout and
// "editing not wired up yet" honesty are the same everywhere.
export function ProfilePage() {
  const { user } = useAuth()
  const profile = user?.patient ?? user?.doctor ?? user?.admin

  if (!user || !profile) {
    return (
      <AppLayout>
        <p className="py-12 text-center text-slate-500">Chargement...</p>
      </AppLayout>
    )
  }

  const specialty = user.doctor?.specialty

  return (
    <AppLayout>
      <h1 className="text-page-title text-slate-900">Mon profil</h1>

      <Card className="mt-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-700">
          {initials(profile.firstName, profile.lastName)}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {profile.firstName} {profile.lastName}
          </p>
          {specialty && <p className="text-sm text-slate-500">{specialty}</p>}
          <div className="mt-1 flex items-center gap-2">
            <Badge tone="success">Compte actif</Badge>
            <Badge tone="neutral">{ROLE_LABEL[user.role]}</Badge>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="text-section-title text-slate-900">Informations personnelles</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Prénom" defaultValue={profile.firstName} disabled />
          <Input label="Nom" defaultValue={profile.lastName} disabled />
          <Input label="Email" defaultValue={user.email} disabled />
          {user.patient && <Input label="Téléphone" defaultValue={user.patient.phone ?? ''} disabled />}
          {user.doctor && <Input label="Spécialité" defaultValue={user.doctor.specialty} disabled />}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          La modification du profil sera disponible prochainement.
        </p>
      </Card>

      <Card className="mt-4">
        <p className="text-section-title text-slate-900">Sécurité</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Mot de passe actuel" type="password" disabled />
          <Input label="Nouveau mot de passe" type="password" disabled />
        </div>
        <Button className="mt-4" disabled>
          Enregistrer
        </Button>
      </Card>
    </AppLayout>
  )
}
