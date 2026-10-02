export function toDateOnly(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateFr(dateOnly: string): string {
  const date = new Date(`${dateOnly}T00:00:00`)
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function formatTimeFr(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTimeFr(iso: string): string {
  const date = new Date(iso)
  return `${date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${formatTimeFr(iso)}`
}

/** Next 14 calendar days starting today, as YYYY-MM-DD strings. */
export function nextDays(count: number): string[] {
  const result: string[] = []
  const today = new Date()
  for (let i = 0; i < count; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    result.push(toDateOnly(date))
  }
  return result
}

/** The Monday on/before the given date (French week convention). */
export function startOfWeek(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay() // 0=Sun..6=Sat
  const diff = day === 0 ? -6 : 1 - day // move back to Monday
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

/** The 7 days of the week containing `date`, Monday first. */
export function weekDays(date: Date): Date[] {
  const monday = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}

export function formatShortDayFr(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')
}

export function isSameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
