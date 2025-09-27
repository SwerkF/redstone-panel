import { type LoginForm } from '@/api/auth'
import { Button, Input } from '@/components'
import {
	useAuthStore,
	useIsAuthenticated,
	useIsLoading,
} from '@/store/authStore'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
	const login = useAuthStore(state => state.login)
	const isAuthenticated = useIsAuthenticated()
	const isLoading = useIsLoading()
	const navigate = useNavigate()
	const [errors, setErrors] = useState<{ [key: string]: string } | null>(null)

	useEffect(() => {
		if (isAuthenticated) {
			navigate('/')
		}
	}, [isAuthenticated, navigate])

	const { register, handleSubmit } = useForm<LoginForm>({
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const handleLogin = async (data: LoginForm) => {
		try {
			setErrors(null)
			await login(data)
		} catch (err) {
			console.error(err)
			setErrors({
				email: 'Erreur de connexion. Vérifiez vos identifiants.',
			})
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center text-gray-900">
					Connexion
				</h1>
				<form
					onSubmit={handleSubmit(handleLogin)}
					className="space-y-4"
				>
					<Input
						{...register('email')}
						error={errors?.email}
						placeholder="Email"
						disabled={isLoading}
					/>
					<Input
						{...register('password')}
						error={errors?.password}
						placeholder="Mot de passe"
						disabled={isLoading}
					/>
					<Button
						onClick={handleSubmit(handleLogin)}
						variant="primary"
						disabled={isLoading}
					>
						{isLoading ? 'Connexion...' : 'Se connecter'}
					</Button>
				</form>
				<Link
					to="/register"
					className="text-blue-600 hover:text-blue-800"
				>
					S'inscrire
				</Link>
			</div>
		</div>
	)
}
