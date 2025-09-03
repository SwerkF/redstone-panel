import handler from '#config/handler'
import { inject } from '@adonisjs/core'
import AuthService from './service.js'
import {
	loginValidator,
	refreshTokenValidator,
	registerValidator,
} from './validators.js'

@inject()
export default class AuthController {
	private authService = new AuthService()

	register = handler(async ({ request, response }) => {
		const payload = await request.validateUsing(registerValidator)
		const result = await this.authService.register(payload)

		return response.created({
			message: 'User created successfully',
			user: result.user,
			tokens: result.tokens,
		})
	})

	login = handler(async ({ request, response }) => {
		const payload = await request.validateUsing(loginValidator)
		const result = await this.authService.login(
			payload.email,
			payload.password,
		)
		if (!result) {
			return response.unauthorized({
				message: 'Invalid credentials',
			})
		}
		return response.ok({
			message: 'Login successful',
			user: result.user,
			tokens: result.tokens,
		})
	})

	refresh = handler(async ({ request, response }) => {
		const payload = await request.validateUsing(refreshTokenValidator)
		const result = await this.authService.refreshTokens(
			payload.refreshToken,
		)
		return response.ok({
			message: 'Tokens refreshed successfully',
			user: result.user,
			tokens: result.tokens,
		})
	})

	logout = handler(async ({ request, response }) => {
		const refreshToken = request.input('refreshToken')
		const result = await this.authService.logout(refreshToken)

		return response.ok(result)
	})

	me = handler(async ctx => {
		const { response } = ctx

		if (!ctx.user) {
			return response.unauthorized({
				message: 'Utilisateur non authentifié',
			})
		}

		const user = await this.authService.getCurrentUser(ctx.user.email)

		if (!user) {
			return response.notFound({
				message: 'Utilisateur non trouvé',
			})
		}

		return response.ok({
			user,
		})
	})

	cleanupTokens = handler(async ({ response }) => {
		await this.authService.cleanupExpiredTokens()
		return response.ok({
			message: 'Expired tokens cleanup completed',
		})
	})

	test = handler(async ({ response }) => {
		return response.ok({
			message: 'Test successful',
		})
	})
}
