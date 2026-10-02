import { NavLink } from 'react-router-dom'
import {
  Home,
  Stethoscope,
  Calendar,
  User,
  ClipboardList,
  Clock,
  Palmtree,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '../../../features/auth/model/types'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

// Paths are role-prefixed where a literal segment would otherwise collide
// across role route-groups (appointments, profile) — see router.tsx's note
// on why sharing a bare path across ProtectedRoute groups silently always
// resolves to the first-declared group, regardless of the real user's role.
const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  PATIENT: [
    { to: '/app/home', label: 'Accueil', icon: Home },
    { to: '/app/doctors', label: 'Médecins', icon: Stethoscope },
    { to: '/app/appointments', label: 'Mes rendez-vous', icon: Calendar },
    { to: '/app/profile', label: 'Mon profil', icon: User },
  ],
  DOCTOR: [
    { to: '/app/doctor-home', label: 'Tableau de bord', icon: Home },
    { to: '/app/agenda', label: 'Agenda', icon: Calendar },
    { to: '/app/doctor-appointments', label: 'Rendez-vous', icon: ClipboardList },
    { to: '/app/availability', label: 'Disponibilités', icon: Clock },
    { to: '/app/absences', label: 'Absences', icon: Palmtree },
    { to: '/app/doctor-profile', label: 'Mon profil', icon: User },
  ],
  ADMIN: [
    { to: '/app/dashboard', label: 'Dashboard', icon: Home },
    { to: '/app/admin-doctors', label: 'Médecins', icon: Stethoscope },
    { to: '/app/admin-patients', label: 'Patients', icon: Users },
    { to: '/app/admin-appointments', label: 'Rendez-vous', icon: Calendar },
    { to: '/app/admin-profile', label: 'Mon profil', icon: User },
  ],
}

export function AppSidebar({ role }: { role: Role }) {
  const items = NAV_BY_ROLE[role]

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto bg-white shadow-[var(--shadow-soft)] md:block">
      <div className="flex h-20 items-center px-6">
        <img src="/logo-mark.png" alt="JasMed" className="h-12 object-contain" />
      </div>
      <nav className="flex flex-col gap-1 px-3.5 py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-[var(--shadow-soft)]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
