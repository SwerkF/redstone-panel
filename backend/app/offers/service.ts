import { inject } from '@adonisjs/core'

import prisma from '#config/prisma'

@inject()
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
