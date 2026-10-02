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
import { createPatientSchema, type CreatePatientFormValues } from '../../entities/admin-patients/schemas'
import { createPatient } from '../../entities/admin-patients/api'

export function NewPatientPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePatientFormValues>({ resolver: zodResolver(createPatientSchema) })

  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] })
      navigate('/app/admin-patients', { replace: true })
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 409) {
        setServerError('Un compte existe déjà avec cette adresse e-mail.')
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.')
      }
    },
  })

  const onSubmit = (values: CreatePatientFormValues) => {
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
      <h1 className="mt-3 text-page-title text-slate-900">Ajouter un patient</h1>

      <Card className="mt-6 max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Nom" error={errors.lastName?.message} {...register('lastName')} />
          </div>
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
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date de naissance (optionnel)"
              type="date"
              error={errors.dateOfBirth?.message}
              {...register('dateOfBirth')}
            />
            <Input label="Téléphone (optionnel)" error={errors.phone?.message} {...register('phone')} />
          </div>
          <Input label="Adresse (optionnel)" error={errors.address?.message} {...register('address')} />

          {serverError && (
            <p role="alert" className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {serverError}
            </p>
          )}

          <div className="mt-2 flex gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              Créer le compte patient
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
