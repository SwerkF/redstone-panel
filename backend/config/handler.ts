import { HttpContext } from '@adonisjs/core/http'

/**
 * Handler pour automatiser la gestion des try/catch dans les contrôleurs
 * @param func - Fonction à exécuter avec gestion automatique des erreurs
 * @returns Fonction qui prend le contexte HTTP et gère les erreurs
 */
const handler = (func: (ctx: HttpContext) => Promise<any>) => {
	return async (ctx: HttpContext) => {
		const { response } = ctx
		try {
			return await func(ctx)
		} catch (error: any) {
			console.error('Erreur dans le handler:', error)

			if (error.code === 'E_VALIDATION_ERROR') {
				return response.badRequest({
					message: 'Erreur de validation',
					errors: error.messages,
				})
			}

			if (error.code === 'E_UNAUTHORIZED_ACCESS') {
				return response.unauthorized({
					message: 'Accès non autorisé',
					errors: error.message,
				})
			}

			return response.internalServerError({
				message: 'Erreur interne du serveur',
				errors: error.message || "Une erreur inattendue s'est produite",
			})
		}
	}
}

export default handler
