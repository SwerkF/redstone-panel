import axios from '@/api/axios'
import type { Offer } from './types'

class OffersApi {
	async getOffers() : Promise<Offer[]> {
		const response = await axios.get('/offers')
		return response.data
	}

	async getOffer(id: string) : Promise<Offer> {
		const response = await axios.get(`/offers/${id}`)
		return response.data
	}

	async purchaseOffer(id: string) : Promise<void> {
		const response = await axios.post(`/offers/${id}/purchase`)
		return response.data
	}

}

export const offersApi = new OffersApi()
