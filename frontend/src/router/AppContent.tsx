import { Navbar } from '@/components'
import { PrivateRoutes, PublicRoutes } from '@/router'
import { useIsAuthenticated, useIsInitialized } from '@/store/authStore'
import { useMetadata } from '@/utils/helmet'

import { Fragment } from 'react'

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
		<Fragment>
			<Navbar />
			<div className="container mx-auto py-4">
				{isAuthenticated && <PrivateRoutes />}
				<PublicRoutes />
			</div>
		</Fragment>
	)
}
