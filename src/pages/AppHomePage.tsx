import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/model/use-auth'

/**
 * Entry point for the bare "/app" route. React Router only tries the FIRST
 * matching route for a given path — with three separate ProtectedRoute
 * groups each declaring their own index route on "/app", only the first
 * (PATIENT) was ever reached, so a DOCTOR or ADMIN logging in was bounced
 * to /403 before their own group's index route ever got a chance to match.
 *
 * Fixed by making "/app" itself role-agnostic: it renders here (inside the
 * top-level ProtectedRoute that only checks "is logged in", not role — see
 * router.tsx), reads the real role from the authenticated user, and
 * redirects to that role's actual dashboard path.
 */
export function AppHomePage() {
  const { role } = useAuth()

  if (role === 'DOCTOR') return <Navigate to="/app/doctor-home" replace />
  if (role === 'ADMIN') return <Navigate to="/app/dashboard" replace />
  return <Navigate to="/app/home" replace />
}
