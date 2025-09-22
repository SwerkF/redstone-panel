import prisma from '#config/prisma'

export default class OfferService {
	async getAllOffers() {
		const offers = await prisma.offer.findMany()
		return offers
	}

	async findOfferById(id: number) {
		const offer = await prisma.offer.findUnique({
			where: {
				id,
			},
		})
		return offer
	}
}
