import type { LoginForm, RegisterForm, Tokens, User } from '@/api/auth'

import axios from '@/api/axios'

class AuthApi {
	async login(data: LoginForm) : Promise<{ user: User, tokens: Tokens }> {
		const response = await axios.post('/auth/login', data)
		return response.data
	}

	async register(data: RegisterForm) : Promise<{ user: User, tokens: Tokens }> {
		const response = await axios.post('/auth/register', data)
		return response.data
	}

	async refresh() : Promise<{ user: User, tokens: Tokens }> {
		const response = await axios.post('/auth/refresh')
		return response.data
	}

	async logout() : Promise<void> {
		const response = await axios.post('/auth/logout')
		return response.data
	}

	async me() : Promise<User> {
		const response = await axios.get('/auth/me')
		return response.data
	}
}

export const authApi = new AuthApi()
