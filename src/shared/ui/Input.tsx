import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id ?? props.name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-shadow placeholder:text-slate-400 focus:outline-none focus:ring-4 ${
            error
              ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500/10'
              : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/10'
          } ${className}`}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-xs text-danger-600">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
