import { type RegisterForm, useRegister } from '@/api/auth'
import { Button, Input } from '@/components'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
	const { mutateAsync: register, isPending } = useRegister()
	const navigate = useNavigate()
	const [errors, setErrors] = useState<{ [key: string]: string } | null>(null)

	const { register: registerFormInput, handleSubmit } = useForm<RegisterForm>(
		{
			defaultValues: {
				email: '',
				username: '',
				password: '',
			},
		},
	)

	const handleRegister = async (data: RegisterForm) => {
		try {
			setErrors(null)
			await register(data)
			navigate('/')
		} catch (err: unknown) {
			console.error(err)
			setErrors({
				email: "Erreur lors de l'inscription. Veuillez vérifier vos informations.",
			})
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center text-gray-900">
					Inscription
				</h1>
				<form
					onSubmit={handleSubmit(handleRegister)}
					className="space-y-4"
				>
					<Input
						type="text"
						{...registerFormInput('username')}
						error={errors?.username}
						placeholder="Nom d'utilisateur"
						disabled={isPending}
					/>
					<Input
						type="email"
						{...registerFormInput('email')}
						error={errors?.email}
						placeholder="Email"
						disabled={isPending}
					/>
					<Input
						type="password"
						{...registerFormInput('password')}
						error={errors?.password}
						placeholder="Mot de passe"
						disabled={isPending}
					/>
					<Button
						onClick={handleSubmit(handleRegister)}
						variant="primary"
						disabled={isPending}
					>
						{isPending ? 'Inscription...' : "S'inscrire"}
					</Button>
				</form>
				<Link to="/login" className="text-blue-600 hover:text-blue-800">
					Se connecter
				</Link>
			</div>
		</div>
	)
}
