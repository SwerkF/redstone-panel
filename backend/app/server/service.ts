import { inject } from '@adonisjs/core'

import { serverProperties } from '#assets/server.properties'
import prisma from '#config/prisma'
import KubeService from '#core/services/kube'
import {
	Offer,
	Server,
	ServerStatus,
	UserSubscription,
} from '#generated/client'
import { uuidv4 } from '#utils/uuid'

@inject()
export default class ServerService {
	constructor(private kubeService: KubeService) {}

	async createServer(
		userId: number,
		offer: Offer,
	): Promise<{
		subscription: UserSubscription
		server: Server
	}> {
		return prisma.$transaction(async tx => {
			const subscription = await tx.userSubscription.create({
				data: {
					userId,
					offerId: offer.id,
				},
			})

			let uuid = uuidv4()

			const server = await tx.server.create({
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

			await tx.server.update({
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

			const userSubscription = await tx.userSubscription.update({
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
		})
	}
}
