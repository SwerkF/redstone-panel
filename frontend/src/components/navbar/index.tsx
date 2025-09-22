import { useAuthStore, useIsAuthenticated, useUser } from '@/store/authStore'

import { Link } from 'react-router-dom'

export default function Navbar() {
	const isAuthenticated = useIsAuthenticated()
	const user = useUser()
	const logout = useAuthStore(state => state.logout)

	const handleLogout = async () => {
		try {
			await logout()
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error)
		}
	}

	return (
		<nav className="bg-blue-600 text-white shadow-md">
			<div className="container mx-auto px-4 py-3 flex justify-between items-center">
				<div>
					<Link
						to="/"
						className="text-xl font-bold hover:text-blue-200"
					>
						Minecraft Servers
					</Link>
				</div>

				<div className="flex items-center space-x-4">
					{isAuthenticated && user ? (
						<>
							<span className="text-blue-200">
								Bonjour, {user.username}
							</span>
							<button
								onClick={handleLogout}
								className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors"
							>
								Déconnexion
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="hover:text-blue-200 transition-colors"
							>
								Connexion
							</Link>
							<Link
								to="/register"
								className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors"
							>
								S'inscrire
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	)
}
