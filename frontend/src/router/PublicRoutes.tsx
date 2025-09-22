import Landing from '@/pages/landing'
import Login from '@/pages/login'
import Register from '@/pages/register'
import { useIsAuthenticated } from '@/store/authStore'

import { Navigate, Route, Routes } from 'react-router-dom'

export const PublicRoutes = () => {
	const isAuthenticated = useIsAuthenticated()

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />
	}

	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}
