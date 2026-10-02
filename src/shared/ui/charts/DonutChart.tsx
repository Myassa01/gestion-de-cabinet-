import { useId, useState } from 'react'

export interface DonutSlice {
  key: string
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutSlice[]
  size?: number
}

const GAP_DEGREES = 2 // surface-gap spacer between adjacent segments (marks-and-anatomy.md)

export function DonutChart({ data, size = 160 }: DonutChartProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const titleId = useId()
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = size / 2
  const strokeWidth = radius * 0.32
  const innerRadius = radius - strokeWidth / 2
  const circumference = 2 * Math.PI * innerRadius

  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400"
        style={{ width: size, height: size }}
      >
        Aucune donnée
      </div>
    )
  }

  // Pre-computed as a pure pass (no mutation during the JSX map below,
  // which oxlint's react/purity rule correctly flags as unsafe under
  // concurrent rendering — two renders reading a variable mutated mid-loop
  // could observe inconsistent state).
  const segments = data.reduce<Array<DonutSlice & { startDegrees: number; grossDegrees: number }>>(
    (acc, slice) => {
      const previous = acc[acc.length - 1];
      const startDegrees = previous ? previous.startDegrees + previous.grossDegrees : 0;
      const grossDegrees = (slice.value / total) * 360;
      return [...acc, { ...slice, startDegrees, grossDegrees }];
    },
    [],
  )

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-labelledby={titleId}
        className="shrink-0"
      >
        <title id={titleId}>Répartition des rendez-vous par statut</title>
        <g transform={`rotate(-90 ${radius} ${radius})`}>
          {segments.map((slice) => {
            const fraction = slice.value / total
            const netDegrees = Math.max(slice.grossDegrees - GAP_DEGREES, 0)
            const startDegrees = slice.startDegrees + GAP_DEGREES / 2
            const dashLength = (netDegrees / 360) * circumference
            const isHovered = hovered === slice.key
            const isDimmed = hovered !== null && !isHovered

            return (
              <circle
                key={slice.key}
                cx={radius}
                cy={radius}
                r={innerRadius}
                fill="none"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth * 1.08 : strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={-((startDegrees / 360) * circumference)}
                opacity={isDimmed ? 0.35 : 1}
                style={{ transition: 'opacity 120ms, stroke-width 120ms' }}
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`${slice.label}: ${slice.value} (${Math.round(fraction * 100)}%)`}
                onPointerEnter={() => setHovered(slice.key)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(slice.key)}
                onBlur={() => setHovered(null)}
              />
            )
          })}
        </g>
        <text
          x={radius}
          y={radius - 6}
          textAnchor="middle"
          className="fill-slate-900 text-lg font-semibold"
        >
          {total}
        </text>
        <text x={radius} y={radius + 14} textAnchor="middle" className="fill-slate-500 text-xs">
          total
        </text>
      </svg>

      {/* Legend doubles as direct labels — mandatory here since two status
          colors (warning/serious) sit below the 3:1 contrast floor and
          below the CVD tritan gate on this surface (see status-chart-colors.ts) */}
      <ul className="flex flex-col gap-2">
        {data.map((slice) => {
          const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0
          return (
            <li
              key={slice.key}
              className={`flex items-center gap-2 text-sm transition-opacity ${
                hovered !== null && hovered !== slice.key ? 'opacity-40' : ''
              }`}
              onPointerEnter={() => setHovered(slice.key)}
              onPointerLeave={() => setHovered(null)}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
                aria-hidden="true"
              />
              <span className="text-slate-700">{slice.label}</span>
              <span className="font-medium text-slate-900">{slice.value}</span>
              <span className="text-slate-400">({pct}%)</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
