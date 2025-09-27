import { useMutation } from '@tanstack/react-query'

import { authApi } from '@/api'

import type { LoginForm, RegisterForm } from './types'

export const useLogin = () => {
	return useMutation({
		mutationKey: ['login'],
		mutationFn: (data: LoginForm) => authApi.login(data),
	})
}

export const useRegister = () => {
	return useMutation({
		mutationKey: ['register'],
		mutationFn: (data: RegisterForm) => authApi.register(data),
	})
}
