import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, setAccessToken } from './auth-token-store'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true, // sends the httpOnly refresh-token cookie
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

// Serializes concurrent refresh attempts: if five requests all get a 401 at
// once, only the first triggers a real /auth/refresh call — the rest await
// its result instead of firing four redundant (and racing) refreshes.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post<{ accessToken: string }>('/auth/refresh')
      .then((res) => res.data.accessToken)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined

    const isAuthEndpoint = config?.url?.startsWith('/auth/')
    if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint) {
      throw error
    }

    config._retried = true
    try {
      const newToken = await refreshAccessToken()
      setAccessToken(newToken)
      config.headers.Authorization = `Bearer ${newToken}`
      return apiClient.request(config)
    } catch (refreshError) {
      setAccessToken(null)
      throw refreshError
    }
  },
)
