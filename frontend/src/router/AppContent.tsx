import { useMetadata } from '@/utils/helmet'

import { PrivateRoutes } from './PrivateRoutes'
import { PublicRoutes } from './PublicRoutes'

import { Navbar } from '../components'
import { useIsAuthenticated, useIsInitialized } from '../store/authStore'

const LoadingSpinner = () => (
	<div className="flex items-center justify-center min-h-screen">
		<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
	</div>
)

export const AppContent = () => {
	const isAuthenticated = useIsAuthenticated()
	const isInitialized = useIsInitialized()

	useMetadata({
		title: 'Minecraft Servers',
		description: 'Minecraft Servers',
		keywords: 'Minecraft, Servers, Minecraft Servers',
	})

	if (!isInitialized) {
		return <LoadingSpinner />
	}

	return (
		<>
			<Navbar />
			{isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
		</>
	)
}
