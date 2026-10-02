import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { PublicLayout } from '../shared/ui/layout/PublicLayout'
import { Card } from '../shared/ui/Card'
import { Input } from '../shared/ui/Input'
import { Button } from '../shared/ui/Button'
import { registerSchema, type RegisterFormValues } from '../features/auth/model/schemas'
import { register as registerRequest } from '../features/auth/api/auth-api'
import { setAccessToken } from '../shared/api/auth-token-store'
import { CURRENT_USER_QUERY_KEY } from '../features/auth/model/use-auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)
    try {
      const token = await registerRequest(values)
      setAccessToken(token)
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY })
      navigate('/app', { replace: true })
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        setServerError('Un compte existe déjà avec cette adresse e-mail.')
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.')
      }
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
        <Card>
          <h1 className="text-page-title text-slate-900">Créer un compte</h1>
          <p className="mt-1 text-sm text-slate-600">Rejoignez-nous pour prendre rendez-vous en ligne.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Prénom" error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Nom" error={errors.lastName?.message} {...register('lastName')} />
            </div>
            <Input
              label="Adresse e-mail"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Téléphone (optionnel)"
              type="tel"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Mot de passe"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && (
              <p role="alert" className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
                {serverError}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
              S'inscrire
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </Card>
      </div>
    </PublicLayout>
  )
}
