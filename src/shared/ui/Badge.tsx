import type { HTMLAttributes } from 'react'

type Tone = 'brand' | 'success' | 'danger' | 'warning' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/10',
  success: 'bg-success-50 text-success-700 ring-1 ring-inset ring-success-600/10',
  danger: 'bg-danger-50 text-danger-700 ring-1 ring-inset ring-danger-600/10',
  warning: 'bg-warning-50 text-warning-700 ring-1 ring-inset ring-warning-600/10',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-600/10',
}

export function Badge({ tone = 'neutral', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
