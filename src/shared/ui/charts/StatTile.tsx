import type { LucideIcon } from 'lucide-react'
import { Card } from '../Card'

interface StatTileProps {
  label: string
  value: number | string
  icon?: LucideIcon
}

export function StatTile({ label, value, icon: Icon }: StatTileProps) {
  return (
    <Card className="flex items-center gap-3.5 transition-shadow hover:shadow-[var(--shadow-soft-hover)]">
      {Icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <div>
        {/* Proportional figures, not tabular-nums — this is a standalone
            hero-style value, not a column that must align (marks-and-anatomy.md) */}
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </Card>
  )
}
