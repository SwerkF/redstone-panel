import Cookies from 'js-cookie'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { authApi } from '@/api/auth'
import type { LoginForm, RegisterForm, User } from '@/api/auth'

interface AuthState {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	isInitialized: boolean
}

interface AuthActions {
	login: (credentials: LoginForm) => Promise<void>
	register: (data: RegisterForm) => Promise<void>
	logout: () => Promise<void>
	checkAuth: () => Promise<void>
	setUser: (user: User | null) => void
	setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
	devtools(
		persist(
			set => ({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				isInitialized: false,

				login: async (credentials: LoginForm) => {
					try {
						set({ isLoading: true })
						const response = await authApi.login(credentials)

						set({
							user: response.user,
							isAuthenticated: true,
							isLoading: false,
						})
					} catch (error) {
						set({
							user: null,
							isAuthenticated: false,
							isLoading: false,
						})
						throw error
					}
				},

				register: async (data: RegisterForm) => {
					try {
						set({ isLoading: true })
						const response = await authApi.register(data)

						set({
							user: response.user,
							isAuthenticated: true,
							isLoading: false,
						})
					} catch (error) {
						set({
							user: null,
							isAuthenticated: false,
							isLoading: false,
						})
						throw error
					}
				},

				logout: async () => {
					try {
						set({ isLoading: true })

						const refreshToken = Cookies.get('refreshToken')
						if (refreshToken) {
							await authApi.logout()
						}

						Cookies.remove('accessToken')
						Cookies.remove('refreshToken')

						set({
							user: null,
							isAuthenticated: false,
							isLoading: false,
						})
					} catch (error) {
						console.error(error)
						Cookies.remove('accessToken')
						Cookies.remove('refreshToken')

						set({
							user: null,
							isAuthenticated: false,
							isLoading: false,
						})
					}
				},

				checkAuth: async () => {
					const accessToken = Cookies.get('accessToken')

					if (!accessToken) {
						set({
							user: null,
							isAuthenticated: false,
							isLoading: false,
							isInitialized: true,
						})
						return
					}

					try {
						set({ isLoading: true })
						const response = await authApi.me()

						set({
							user: response,
							isAuthenticated: true,
							isLoading: false,
							isInitialized: true,
						})
					} catch (error) {
						console.error(error)
						Cookies.remove('accessToken')
						Cookies.remove('refreshToken')

						set({
							user: null,
							isAuthenticated: false,
							isLoading: false,
							isInitialized: true,
						})
					}
				},

				setUser: (user: User | null) => {
					set({
						user,
						isAuthenticated: !!user,
					})
				},

				setLoading: (loading: boolean) => {
					set({ isLoading: loading })
				},
			}),
			{
				name: 'auth-storage',
				partialize: state => ({
					user: state.user,
					isAuthenticated: state.isAuthenticated,
				}),
			},
		),
		{
			name: 'auth-store',
		},
	),
)

export const useUser = () => useAuthStore(state => state.user)
export const useIsAuthenticated = () =>
	useAuthStore(state => state.isAuthenticated)
export const useIsLoading = () => useAuthStore(state => state.isLoading)
export const useIsInitialized = () => useAuthStore(state => state.isInitialized)
