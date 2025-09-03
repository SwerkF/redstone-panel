import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const OfferController = () => import('./controller.js')

router
	.group(() => {
		router.get('/', [OfferController, 'getAllOffers'])
		router
			.post('/purchase/:offerId', [OfferController, 'purchaseOffer'])
			.middleware([middleware.auth()])
	})
	.prefix('/offers')
