import { I18n } from '@adonisjs/i18n'

declare module '@adonisjs/core/http' {
	interface HttpContext {
		i18n?: I18n
	}
}
