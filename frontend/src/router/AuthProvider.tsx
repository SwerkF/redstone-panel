import { type ReactNode, useEffect } from 'react'

import { useAuthStore } from '../store/authStore'

interface authProviderProps {
	children: ReactNode
}

export const AuthProvider = ({ children }: authProviderProps) => {
	const checkAuth = useAuthStore(state => state.checkAuth)
	const isInitialized = useAuthStore(state => state.isInitialized)

	useEffect(() => {
		if (!isInitialized) {
			checkAuth()
		}
	}, [checkAuth, isInitialized])

	return <>{children}</>
}
