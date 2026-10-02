import { apiClient } from '../../../shared/api/client'
import type { CurrentUser } from '../model/types'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

interface TokenResponse {
  accessToken: string
}

export async function login(input: LoginInput): Promise<string> {
  const res = await apiClient.post<TokenResponse>('/auth/login', input)
  return res.data.accessToken
}

export async function register(input: RegisterInput): Promise<string> {
  const res = await apiClient.post<TokenResponse>('/auth/register', input)
  return res.data.accessToken
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const res = await apiClient.get<CurrentUser>('/auth/me')
  return res.data
}

export async function refresh(): Promise<string> {
  const res = await apiClient.post<TokenResponse>('/auth/refresh')
  return res.data.accessToken
}
