import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAccessToken, setAccessToken } from '../../../shared/api/auth-token-store'
import { fetchCurrentUser } from '../api/auth-api'
import type { CurrentUser, Role } from './types'

export const CURRENT_USER_QUERY_KEY = ['auth', 'me'] as const

export interface AuthState {
  user: CurrentUser | undefined
  isAuthenticated: boolean
  isLoading: boolean
  role: Role | null
}

export function useAuth(): AuthState {
  const hasToken = !!getAccessToken()

  const { data, isLoading } = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
    enabled: hasToken,
    retry: false,
    staleTime: 60_000,
  })

  return {
    user: data,
    isAuthenticated: !!data,
    isLoading: hasToken && isLoading,
    role: data?.role ?? null,
  }
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return () => {
    setAccessToken(null)
    queryClient.setQueryData(CURRENT_USER_QUERY_KEY, undefined)
    queryClient.clear()
  }
}
