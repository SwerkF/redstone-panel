import AuthService from '#auth/service'
import handler from '#config/handler'
import ServerService from '#server/service'
import { inject } from '@adonisjs/core'
import OfferService from './service.js'

@inject()
export default class OfferController {
	private offerService = new OfferService()
	private userService = new AuthService()
	private serverService = new ServerService()

	getAllOffers = handler(async ({ response }) => {
		const offers = await this.offerService.getAllOffers()
		return response.ok(offers)
	})

	purchaseOffer = handler(async ctx => {
		const { request, response } = ctx
		const { offerId } = request.params()

		if (!ctx.user) {
			return response.unauthorized({
				message: 'Utilisateur non authentifié',
			})
		}

		const offer = await this.offerService.findOfferById(Number(offerId))
		if (!offer) {
			return response.notFound({
				message: 'Offre non trouvée',
			})
		}

		const user = await this.userService.getCurrentUser(ctx.user.email)
		if (!user) {
			return response.unauthorized({
				message: 'Utilisateur non trouvé',
			})
		}

		await this.serverService.createServer(user.id, offer)
		return response.ok(offer)
	})
}
