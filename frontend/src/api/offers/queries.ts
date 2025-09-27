import { offersApi, type Offer } from '@/api/offers'
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query'

export const useGetOffersQuery = (options?: UseQueryOptions<Offer[], Error>) => {
	return useQuery<Offer[], Error>({
		queryKey: ['offers'],
		queryFn: async () => {
            return await offersApi.getOffers()
        },
		...options,
	})
}

export const useGetOfferQuery = (id: string, options?: UseQueryOptions<Offer, Error>) => {
	return useQuery<Offer, Error>({
		queryKey: ['offer', id],
		queryFn: async () => {
            return await offersApi.getOffer(id)
        },
        enabled: !!id,
		...options,
	})
}

export const usePurchaseOfferMutation = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation<void, Error, string>({
		mutationFn: async (id) => {
			return await offersApi.purchaseOffer(id)
		},
		...options,
	})
}