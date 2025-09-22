import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import type { NextFn } from '@adonisjs/core/types/http'

import AuthService from '#auth/service'

export default class AuthMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		const { request, response } = ctx
		const authService = new AuthService()

		try {
			const authHeader = request.header('Authorization')

			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return response.unauthorized({
					message: "Token d'accès requis",
					error: 'MISSING_TOKEN',
				})
			}

			const token = authHeader.substring(7)

			const decoded = await authService.verifyAccessToken(token)

			ctx.user = {
				id: decoded.sub,
				email: decoded.email,
				username: decoded.username,
			}

			await next()
		} catch (error) {
			logger.error(error)
			return response.unauthorized({
				message: 'Token invalide ou expiré',
				error: 'INVALID_TOKEN',
			})
		}
	}
}
