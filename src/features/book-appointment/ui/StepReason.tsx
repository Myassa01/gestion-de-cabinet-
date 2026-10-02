interface StepReasonProps {
  reason: string
  onChange: (reason: string) => void
}

export function StepReason({ reason, onChange }: StepReasonProps) {
  return (
    <div>
      <label htmlFor="booking-reason" className="text-sm font-medium text-slate-700">
        Motif de consultation (optionnel)
      </label>
      <textarea
        id="booking-reason"
        rows={4}
        value={reason}
        onChange={(e) => onChange(e.target.value)}
        maxLength={500}
        placeholder="Décrivez brièvement le motif de votre visite..."
        className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <p className="mt-1 text-right text-xs text-slate-400">{reason.length}/500</p>
    </div>
  )
}
