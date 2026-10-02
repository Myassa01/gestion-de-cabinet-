import type { ReactNode } from 'react'
import { useAuth } from '../../../features/auth/model/use-auth'
import { AppSidebar } from './AppSidebar'
import { AppTopbar } from './AppTopbar'

export function AppLayout({ children }: { children: ReactNode }) {
  const { role } = useAuth()

  if (!role) return null // ProtectedRoute guarantees this never renders without a role

  return (
    <div className="flex h-screen bg-slate-50">
      <AppSidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
