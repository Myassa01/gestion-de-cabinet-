import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AxiosError } from 'axios'
import { PublicLayout } from '../shared/ui/layout/PublicLayout'
import { Card } from '../shared/ui/Card'
import { Input } from '../shared/ui/Input'
import { Button } from '../shared/ui/Button'
import { loginSchema, type LoginFormValues } from '../features/auth/model/schemas'
import { login as loginRequest } from '../features/auth/api/auth-api'
import { setAccessToken } from '../shared/api/auth-token-store'
import { useQueryClient } from '@tanstack/react-query'
import { CURRENT_USER_QUERY_KEY } from '../features/auth/model/use-auth'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    try {
      const token = await loginRequest(values)
      setAccessToken(token)
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY })
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/app'
      navigate(redirectTo, { replace: true })
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setServerError('E-mail ou mot de passe incorrect.')
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.')
      }
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
        <Card>
          <h1 className="text-page-title text-slate-900">Connexion</h1>
          <p className="mt-1 text-sm text-slate-600">Accédez à votre espace personnel.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
            <Input
              label="Adresse e-mail"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError && (
              <p role="alert" className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
                {serverError}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
              Se connecter
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:underline">
              S'inscrire
            </Link>
          </p>
        </Card>
      </div>
    </PublicLayout>
  )
}
