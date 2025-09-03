import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import i18nManager from '@adonisjs/i18n/services/main'

export default class DetectUserLocaleMiddleware {
	async handle(ctx: HttpContext, next: NextFn) {
		const userLocale = this.getRequestLocale(ctx)
		ctx.i18n = i18nManager.locale(userLocale)
		return await next()
	}

	protected getRequestLocale(ctx: HttpContext): string {
		const supportedLocales = ['en', 'fr']
		const defaultLocale = 'en'

		const acceptLanguage = ctx.request.header('accept-language')
		if (!acceptLanguage) {
			return defaultLocale
		}

		const preferredLanguages = acceptLanguage
			.split(',')
			.map(lang => {
				const [code, q] = lang.trim().split(';q=')
				return {
					code: code.toLowerCase().split('-')[0],
					quality: q ? parseFloat(q) : 1.0,
				}
			})
			.sort((a, b) => b.quality - a.quality)

		for (const lang of preferredLanguages) {
			if (supportedLocales.includes(lang.code)) {
				return lang.code
			}
		}

		return defaultLocale
	}
}
