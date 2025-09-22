import type { LoginForm, RegisterForm } from './types'

import axios from '../axios'

class AuthApi {
	async login(data: LoginForm) {
		const response = await axios.post('/auth/login', data)
		return response.data
	}

	async register(data: RegisterForm) {
		const response = await axios.post('/auth/register', data)
		return response.data
	}

	async refresh() {
		const response = await axios.post('/auth/refresh')
		return response.data
	}

	async logout() {
		const response = await axios.post('/auth/logout')
		return response.data
	}

	async me() {
		const response = await axios.get('/auth/me')
		return response.data
	}
}

export default new AuthApi()
