export interface Offer {
	id: string
	name: string
	description: string
	price: number
	cpuLimit: string
	memoryLimitGb: number
	storageGb: number
	maxPlayers: number
	isActive: boolean
	createdAt: Date
	updatedAt: Date
}
