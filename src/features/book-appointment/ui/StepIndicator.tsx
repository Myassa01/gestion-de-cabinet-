import { Check } from 'lucide-react'

const STEP_LABELS = ['Médecin', 'Créneau', 'Motif', 'Confirmation']

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto flex max-w-lg items-center justify-between">
      {STEP_LABELS.map((label, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isDone = stepNumber < currentStep
        return (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isDone
                    ? 'bg-brand-600 text-white'
                    : isActive
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                      : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : stepNumber}
              </div>
              {index < STEP_LABELS.length - 1 && (
                <div className={`h-0.5 flex-1 ${isDone ? 'bg-brand-600' : 'bg-slate-200'}`} />
              )}
            </div>
            <span
              className={`mt-1.5 hidden text-xs sm:block ${isActive ? 'font-medium text-brand-700' : 'text-slate-500'}`}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
