import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuth, useSignOut } from '../../../features/auth/model/use-auth'
import { logout } from '../../../features/auth/api/auth-api'
import { Button } from '../Button'
import { NotificationBell } from './NotificationBell'

function displayName(user: ReturnType<typeof useAuth>['user']): string {
  const profile = user?.patient ?? user?.doctor ?? user?.admin
  if (!profile) return user?.email ?? ''
  return `${profile.firstName} ${profile.lastName}`
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function AppTopbar() {
  const { user } = useAuth()
  const signOut = useSignOut()
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      signOut()
      navigate('/login', { replace: true })
    },
  })

  const name = displayName(user)

  return (
    <header className="flex h-16 items-center justify-between bg-white px-4 shadow-[var(--shadow-soft)] sm:px-6">
      <div />
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="h-6 w-px bg-slate-200" />
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-brand-400 to-brand-600 text-sm font-semibold text-white shadow-[var(--shadow-soft)]"
          title={name}
        >
          {initials(name) || '?'}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logoutMutation.mutate()}
          isLoading={logoutMutation.isPending}
        >
          Déconnexion
        </Button>
      </div>
    </header>
  )
}
