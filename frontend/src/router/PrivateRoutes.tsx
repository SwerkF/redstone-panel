import MainDashboard from '@/pages/dashboard'
import { useIsAuthenticated, useIsInitialized } from '@/store/authStore'

import { Navigate, Route, Routes } from 'react-router-dom'

export const PrivateRoutes = () => {
	const isAuthenticated = useIsAuthenticated()
	const isInitialized = useIsInitialized()

	if (!isInitialized) {
		return 'Chargement...'
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	return (
		<Routes>
			<Route path="/dashboard/*" element={<MainDashboard />} />
		</Routes>
	)
}
