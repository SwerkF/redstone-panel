import { serverProperties } from '#assets/server.properties'
import prisma from '#config/prisma'
import KubeService from '#core/services/kube'
import { Offer, ServerStatus } from '#generated/client'
import { uuidv4 } from '#utils/uuid'

export default class ServerService {
	constructor(private kubeService: KubeService) {}

	async createServer(userId: number, offer: Offer) {
		const subscription = await prisma.userSubscription.create({
			data: {
				userId,
				offerId: offer.id,
			},
		})

		let uuid = uuidv4()

		const server = await prisma.server.create({
			data: {
				userId,
				subscriptionId: subscription.id,
				podName: `server-${uuid}`,
				serverId: uuid,
				serverName: `Server ${subscription.id}`,
				serverProperties: serverProperties,
			},
			include: {
				settings: true,
				subscription: {
					include: {
						offer: true,
					},
				},
			},
		})

		let kubeResult = await this.kubeService.createServer(server)
		let hostIP = await this.kubeService.getHostIP()

		await prisma.server.update({
			where: {
				id: server.id,
			},
			data: {
				status: ServerStatus.RUNNING,
				ipAddress: hostIP,
				port: kubeResult.nodePort,
				kubernetesNamespace: kubeResult.pod?.metadata?.namespace,
				lastStarted: new Date(),
				lastStopped: null,
			},
			include: {
				settings: true,
				subscription: {
					include: {
						offer: true,
					},
				},
			},
		})

		const userSubscription = await prisma.userSubscription.update({
			where: {
				id: subscription.id,
			},
			data: {
				server: {
					connect: {
						id: server.id,
					},
				},
			},
			include: {
				server: true,
			},
		})

		return {
			subscription: userSubscription,
			server: server,
		}
	}
}
