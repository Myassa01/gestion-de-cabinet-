// Access token lives in memory only — never localStorage/sessionStorage,
// so it can't be exfiltrated via XSS the way a stored token could. It is
// lost on page reload by design; App.tsx recovers it via a silent refresh
// against the httpOnly refresh cookie on boot.
let accessToken: string | null = null
const listeners = new Set<(token: string | null) => void>()

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string | null): void {
  accessToken = token
  listeners.forEach((listener) => listener(token))
}

export function subscribeAccessToken(listener: (token: string | null) => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
