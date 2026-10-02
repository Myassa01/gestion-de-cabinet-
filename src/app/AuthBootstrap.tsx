import { useEffect, useState, type ReactNode } from 'react'
import { refresh } from '../features/auth/api/auth-api'
import { setAccessToken } from '../shared/api/auth-token-store'

/**
 * On first load, the access token only ever lives in memory (see
 * auth-token-store.ts), so a full page reload always starts with none.
 * This silently attempts /auth/refresh against the httpOnly cookie before
 * rendering the app, so a returning user with a valid session doesn't get
 * bounced to /login just because they refreshed the page.
 */
export function AuthBootstrap({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    refresh()
      .then((token) => {
        if (!cancelled) setAccessToken(token)
      })
      .catch(() => {
        // No valid refresh cookie — fine, user is simply not logged in.
      })
      .finally(() => {
        if (!cancelled) setIsReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
