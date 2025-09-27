import { type Offer, offersApi } from '@/api/offers'
import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
} from '@tanstack/react-query'

export const useGetOffersQuery = (
	options?: UseQueryOptions<Offer[], Error>,
) => {
	return useQuery<Offer[], Error>({
		queryKey: ['offers'],
		queryFn: async () => {
			return await offersApi.getOffers()
		},
		...options,
	})
}

export const useGetOfferQuery = (
	id: string,
	options?: UseQueryOptions<Offer, Error>,
) => {
	return useQuery<Offer, Error>({
		queryKey: ['offer', id],
		queryFn: async () => {
			return await offersApi.getOffer(id)
		},
		enabled: !!id,
		...options,
	})
}

export const usePurchaseOfferMutation = (
	options?: UseMutationOptions<void, Error, string>,
) => {
	return useMutation<void, Error, string>({
		mutationFn: async id => {
			return await offersApi.purchaseOffer(id)
		},
		...options,
	})
}
