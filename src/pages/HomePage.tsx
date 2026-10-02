import { Link } from 'react-router-dom'
import { Calendar, Clock, Lock, MessageCircle, Stethoscope, type LucideIcon } from 'lucide-react'
import { PublicLayout } from '../shared/ui/layout/PublicLayout'
import { Button } from '../shared/ui/Button'

const FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: Calendar, label: 'Rappels de rendez-vous' },
  { icon: Clock, label: 'Suivi en temps réel' },
  { icon: Lock, label: 'Gestion sécurisée' },
  { icon: MessageCircle, label: 'Messagerie sécurisée' },
]

export function HomePage() {
  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            Votre santé, <span className="text-brand-600">un rendez-vous</span> à la fois.
          </h1>
          <p className="mt-4 max-w-md text-slate-600">
            Prenez rendez-vous en ligne avec votre médecin en quelques minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/doctors">
              <Button size="lg">Prendre rendez-vous</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex h-64 w-64 items-center justify-center rounded-full bg-brand-50 text-brand-600 md:h-80 md:w-80">
            <Stethoscope className="h-24 w-24 md:h-32 md:w-32" strokeWidth={1.5} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.label} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <feature.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-slate-700">{feature.label}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
