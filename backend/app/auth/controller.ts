import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import i18nManager from '@adonisjs/i18n/services/main'

import AuthService from './service.js'
import { loginValidator, refreshTokenValidator, registerValidator } from './validators.js'

@inject()
export default class AuthController {
    constructor(private authService: AuthService) {}

    async register(ctx: HttpContext) {
        const { request, response } = ctx
        const i18n = ctx.i18n || i18nManager.locale('en')

        const payload = await request.validateUsing(registerValidator)
        const result = await this.authService.register(payload)

        return response.created({
            message: i18n.t('messages.auth.user_created'),
            user: result.user,
            tokens: result.tokens,
        })
    }

    async login(ctx: HttpContext) {
        const { request, response } = ctx
        const i18n = ctx.i18n || i18nManager.locale('en')

        const payload = await request.validateUsing(loginValidator)
        const result = await this.authService.login(payload.email, payload.password)

        if (!result) {
            return response.unauthorized({
                message: i18n.t('messages.auth.invalid_credentials'),
            })
        }

        return response.ok({
            message: i18n.t('messages.auth.login_successful'),
            user: result.user,
            tokens: result.tokens,
        })
    }

    async refresh(ctx: HttpContext) {
        const { request, response } = ctx
        const i18n = ctx.i18n || i18nManager.locale('en')

        const payload = await request.validateUsing(refreshTokenValidator)
        const result = await this.authService.refreshTokens(payload.refreshToken)

        return response.ok({
            message: i18n.t('messages.auth.tokens_refreshed'),
            user: result.user,
            tokens: result.tokens,
        })
    }

    async logout(ctx: HttpContext) {
        const { request, response } = ctx
        const i18n = ctx.i18n || i18nManager.locale('en')

        const refreshToken = request.input('refreshToken')
        await this.authService.logout(refreshToken)

        return response.ok({
            message: i18n.t('messages.auth.logout_successful'),
        })
    }

    async me(ctx: HttpContext) {
        const { response } = ctx
        const i18n = ctx.i18n || i18nManager.locale('en')

        if (!ctx.user) {
            return response.unauthorized({
                message: i18n.t('messages.auth.user_not_authenticated'),
            })
        }

        const user = await this.authService.getCurrentUser(ctx.user.email)

        if (!user) {
            return response.notFound({
                message: i18n.t('messages.auth.user_not_found'),
            })
        }

        return response.ok({
            user,
        })
    }

    async cleanupTokens(ctx: HttpContext) {
        const { response } = ctx
        const i18n = ctx.i18n || i18nManager.locale('en')

        await this.authService.cleanupExpiredTokens()
        return response.ok({
            message: i18n.t('messages.auth.tokens_cleanup_completed'),
        })
    }
}
