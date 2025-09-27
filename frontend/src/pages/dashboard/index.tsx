import { useUser } from '@/store/authStore'

import { Navigate } from 'react-router-dom'

export default function MainDashboard() {
	const user = useUser()

	if (!user) {
		return <Navigate to="/login" replace />
	}

	return (
		<div className="flex flex-col h-screen gap-4">
			<h1 className="uppercase">
				Bienvenue, <span className="font-bold">{user?.username}</span>.
			</h1>
			<hr />
		</div>
	)
}
