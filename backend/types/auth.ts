/**
 * Extension des types pour l'authentification
 */

declare module '@adonisjs/core/http' {
	interface HttpContext {
		user?: {
			id: string
			email: string
			username: string
		}
	}
}
