import type { AppointmentStatus } from './appointment-status'

// Fixed status-palette hexes from the dataviz skill (palette.md) — never
// re-themed. Order below is deliberate, not alphabetical: validated via
// scripts/validate_palette.js, this ordering is the best-available pairing
// (CVD deutan/protan clears the >=8 floor on every adjacent pair; the
// warning<->serious pair fails the normal-vision floor and low-contrast
// checks by the palette's own documented design — mitigated by always
// showing direct labels, never relying on hue alone in this chart).
const STATUS_COLOR: Record<AppointmentStatus, string> = {
  CONFIRMED: '#0ca30c', // good
  COMPLETED: '#2a78d6', // neutral (a finished visit isn't "good" or "bad" — just done)
  PENDING: '#fab219', // warning
  NO_SHOW: '#d03b3b', // critical
  CANCELLED: '#ec835a', // serious
}

const STATUS_ORDER: AppointmentStatus[] = ['CONFIRMED', 'COMPLETED', 'PENDING', 'NO_SHOW', 'CANCELLED']

export function statusChartColor(status: AppointmentStatus): string {
  return STATUS_COLOR[status]
}

export function sortByStatusOrder<T extends { status: AppointmentStatus }>(items: T[]): T[] {
  return [...items].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
}
