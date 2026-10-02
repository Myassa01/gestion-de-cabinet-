import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { PublicLayout } from '../shared/ui/layout/PublicLayout'
import { Card } from '../shared/ui/Card'
import { Input } from '../shared/ui/Input'
import { Button } from '../shared/ui/Button'

const contactSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  email: z.email('Adresse e-mail invalide'),
  subject: z.string().min(1, 'Sujet requis'),
  message: z.string().min(10, 'Votre message est un peu court (10 caractères minimum)').max(2000),
})
type ContactFormValues = z.infer<typeof contactSchema>

const INFO_ITEMS = [
  { icon: MapPin, label: '12 rue de la Santé, 75014 Paris' },
  { icon: Phone, label: '+33 1 23 45 67 89' },
  { icon: Mail, label: 'contact@cabinet.local' },
  { icon: Clock, label: 'Lun–Ven : 9h–12h et 14h–17h' },
]

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (): Promise<void> => {
    // No backend endpoint for contact messages yet — this confirms receipt
    // locally rather than silently pretending to send something nowhere.
    await new Promise((resolve) => setTimeout(resolve, 400))
    setSubmitted(true)
    reset()
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Contactez-nous</h1>
          <p className="mt-2 text-slate-600">
            Une question ? Notre équipe vous répond sous 48h ouvrées.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card className="flex flex-col gap-5">
              <p className="text-section-title text-slate-900">Nos coordonnées</p>
              {INFO_ITEMS.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <p className="pt-2 text-sm text-slate-700">{item.label}</p>
                </div>
              ))}
              <p className="text-xs text-slate-400">
                Pour une urgence médicale, contactez le 15 (SAMU) ou rendez-vous aux urgences les
                plus proches.
              </p>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              {submitted ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-50 text-success-600">
                    <Mail className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="font-semibold text-slate-900">Message envoyé</p>
                  <p className="text-sm text-slate-500">
                    Merci, nous reviendrons vers vous rapidement.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-2" onClick={() => setSubmitted(false)}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Nom complet" error={errors.name?.message} {...register('name')} />
                    <Input
                      label="Adresse e-mail"
                      type="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                  <Input label="Sujet" error={errors.subject?.message} {...register('subject')} />
                  <div>
                    <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      maxLength={2000}
                      placeholder="Votre message..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-shadow focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                      {...register('message')}
                    />
                    {errors.message?.message && (
                      <p className="mt-1 text-xs text-danger-600">{errors.message.message}</p>
                    )}
                  </div>
                  <Button type="submit" isLoading={isSubmitting} className="mt-2 self-start">
                    Envoyer le message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
