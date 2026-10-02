import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ArrowLeft } from 'lucide-react'
import { AppLayout } from '../../shared/ui/layout/AppLayout'
import { Card } from '../../shared/ui/Card'
import { Input } from '../../shared/ui/Input'
import { Button } from '../../shared/ui/Button'
import { createDoctorSchema, type CreateDoctorFormValues } from '../../entities/doctor/schemas'
import { createDoctor } from '../../entities/doctor/api'

export function NewDoctorPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateDoctorFormValues>({ resolver: zodResolver(createDoctorSchema) })

  const createMutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
      navigate('/app/admin-doctors', { replace: true })
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 409) {
        setServerError('Un compte existe déjà avec cette adresse e-mail.')
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.')
      }
    },
  })

  const onSubmit = (values: CreateDoctorFormValues) => {
    setServerError(null)
    createMutation.mutate(values)
  }

  return (
    <AppLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour
      </button>
      <h1 className="mt-3 text-page-title text-slate-900">Ajouter un médecin</h1>

      <Card className="mt-6 max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Nom" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Spécialité" error={errors.specialty?.message} {...register('specialty')} />
          <Input
            label="Adresse e-mail"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Mot de passe initial"
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input label="Numéro de salle (optionnel)" error={errors.roomNo?.message} {...register('roomNo')} />

          {serverError && (
            <p role="alert" className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {serverError}
            </p>
          )}

          <div className="mt-2 flex gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              Créer le compte médecin
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </AppLayout>
  )
}
