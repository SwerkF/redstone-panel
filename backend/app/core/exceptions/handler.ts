import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import i18nManager from '@adonisjs/i18n/services/main'

export default class HttpExceptionHandler extends ExceptionHandler {
    protected debug = !app.inProduction

    async handle(error: any, ctx: HttpContext) {
        const { response } = ctx

        const i18n = ctx.i18n || i18nManager.locale('en')

        if (error.code === 'E_VALIDATION_ERROR') {
            return response.badRequest({
                message: i18n.t('messages.errors.validation_error'),
                errors: error.messages,
            })
        }

        if (error.code === 'E_UNAUTHORIZED_ACCESS') {
            return response.unauthorized({
                message: i18n.t('messages.errors.unauthorized_access'),
                errors: error.message,
            })
        }

        logger.error("Erreur capturée par le gestionnaire d'exceptions")
        logger.error(error)

        if (app.inProduction) {
            return response.internalServerError({
                message: i18n.t('messages.errors.internal_server_error'),
                errors: i18n.t('messages.errors.unexpected_error'),
            })
        }

        return super.handle(error, ctx)
    }

    async report(error: unknown, ctx: HttpContext) {
        return super.report(error, ctx)
    }
}
