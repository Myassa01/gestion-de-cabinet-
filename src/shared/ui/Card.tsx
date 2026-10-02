import type { HTMLAttributes } from 'react'

export function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-[var(--shadow-soft)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
