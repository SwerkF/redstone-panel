import { useGetOffersQuery, usePurchaseOfferMutation } from '@/api/offers'
import { Button } from '@/components'

export default function Offers() {
	const { data: offers, isLoading, error } = useGetOffersQuery()

	const { mutate: purchaseOffer, isPending } = usePurchaseOfferMutation()

	if (error) {
		return <div>Error: {error.message}</div>
	}

	if (isLoading) {
		return <div>Loading...</div>
	}

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Offers</h1>
			{offers?.map(offer => (
				<div key={offer.id}>
					<h2>{offer.name}</h2>
					<p>{offer.description}</p>
					<p>{offer.price}</p>
					<Button
						onClick={() => purchaseOffer(offer.id)}
						disabled={isPending}
					>
						{isPending ? 'Purchasing...' : 'Purchase'}
					</Button>
				</div>
			))}
		</div>
	)
}
