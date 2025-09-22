import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import i18nManager from '@adonisjs/i18n/services/main'

import AuthService from '#auth/service'
import ServerService from '#server/service'

import OfferService from './service.js'

@inject()
export default class OfferController {
	constructor(
		private offerService: OfferService,
		private userService: AuthService,
		private serverService: ServerService,
	) {}

	async getAllOffers({ response }: HttpContext) {
		const offers = await this.offerService.getAllOffers()
		return response.ok(offers)
	}

	async purchaseOffer(ctx: HttpContext) {
		const { request, response } = ctx
		const i18n = ctx.i18n || i18nManager.locale('en')
		const { offerId } = request.params()

		if (!ctx.user) {
			return response.unauthorized({
				message: i18n.t('messages.auth.user_not_authenticated'),
			})
		}

		const offer = await this.offerService.findOfferById(Number(offerId))
		if (!offer) {
			return response.notFound({
				message: i18n.t('messages.offers.offer_not_found'),
			})
		}

		const user = await this.userService.getCurrentUser(ctx.user.email)
		if (!user) {
			return response.unauthorized({
				message: i18n.t('messages.auth.user_not_found'),
			})
		}

		await this.serverService.createServer(user.id, offer)
		return response.ok(offer)
	}
}
