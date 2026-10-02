import { useState } from 'react'

export interface BarDatum {
  key: string
  label: string
  value: number
}

interface BarChartProps {
  data: BarDatum[]
  height?: number
}

const BAR_COLOR = '#2a78d6' // sequential default hue, single-series (palette.md)
const BAR_MAX_WIDTH = 24 // marks-and-anatomy.md: bar/column cap
const BAR_GAP = 2 // surface-gap spacer

export function BarChart({ data, height = 160 }: BarChartProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const maxValue = Math.max(...data.map((d) => d.value), 1)
  const axisHeight = 24

  return (
    <div>
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((datum) => {
          const barHeight = (datum.value / maxValue) * (height - axisHeight - 20)
          const isHovered = hoveredKey === datum.key
          return (
            <div
              key={datum.key}
              className="group relative flex flex-1 flex-col items-center justify-end"
              style={{ height: height - axisHeight }}
            >
              {isHovered && (
                <div className="absolute -top-8 z-10 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white shadow-lg">
                  {datum.value} RDV
                </div>
              )}
              <div
                role="graphics-symbol"
                aria-label={`${datum.label}: ${datum.value} rendez-vous`}
                tabIndex={0}
                onPointerEnter={() => setHoveredKey(datum.key)}
                onPointerLeave={() => setHoveredKey(null)}
                onFocus={() => setHoveredKey(datum.key)}
                onBlur={() => setHoveredKey(null)}
                className="rounded-t transition-[height,opacity] duration-150"
                style={{
                  height: Math.max(barHeight, 2),
                  width: BAR_MAX_WIDTH,
                  maxWidth: '100%',
                  backgroundColor: BAR_COLOR,
                  opacity: isHovered ? 1 : 0.85,
                  marginInline: BAR_GAP / 2,
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-1">
        {data.map((datum) => (
          <div key={datum.key} className="flex-1 text-center text-xs text-slate-500">
            {datum.label}
          </div>
        ))}
      </div>
    </div>
  )
}
