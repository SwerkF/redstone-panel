export interface LoginForm {
	email: string
	password: string
}

export interface RegisterForm {
	email: string
	password: string
	username: string
}

export interface User {
	id: string
	email: string
	username: string
	createdAt?: string
	updatedAt?: string
}

export interface Tokens {
	accessToken: string
	refreshToken: string
}

export interface AuthResponse {
	user: User
	tokens: Tokens
	message?: string
}
