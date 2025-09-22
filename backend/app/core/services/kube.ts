import * as k8s from '@kubernetes/client-node'

import logger from '@adonisjs/core/services/logger'

import { Prisma } from '#generated/index'

export default class kubeService {
	private k8sApi: k8s.CoreV1Api
	private kubeConfig: k8s.KubeConfig

	constructor() {
		this.kubeConfig = new k8s.KubeConfig()

		try {
			this.kubeConfig.loadFromDefault()
		} catch (error) {
			logger.error(
				'Error while loading the Kubernetes configuration:',
				error,
			)
			throw new Error('Invalid Kubernetes configuration')
		}

		if (
			process.env.NODE_ENV === 'development' ||
			process.env.KUBE_SKIP_TLS_VERIFY === 'true'
		) {
			const cluster = this.kubeConfig.getCurrentCluster()
			if (cluster) {
				;(cluster as any).skipTLSVerify = true
			}
		}

		this.k8sApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api)
	}

	async checkConnection(): Promise<boolean> {
		try {
			await this.k8sApi.listNamespace()
			return true
		} catch (error) {
			logger.error(
				'Error while checking the connection to the Kubernetes cluster:',
				error,
			)
			return false
		}
	}

	async createServer(
		server: Prisma.ServerGetPayload<{
			include: {
				settings: true
				subscription: {
					include: {
						offer: true
					}
				}
			}
		}>,
	) {
		const serverProperties = server.serverProperties as Record<
			string,
			string
		>

		let podManifest: k8s.V1Pod = {
			metadata: {
				name: server.podName || 'minecraft-server',
				labels: {
					app: 'minecraft-server',
					'server-id': server.serverId,
				},
			},
			spec: {
				containers: [
					{
						name: 'minecraft-server',
						image: 'itzg/minecraft-server:latest',
						tty: true,
						stdin: true,
						env: [
							{ name: 'EULA', value: 'TRUE' },
							{ name: 'SERVER_NAME', value: server.serverName },
							{
								name: 'MAX_PLAYERS',
								value: serverProperties.maxPlayers
									? serverProperties.maxPlayers
									: '10',
							},
						],
						ports: [
							{
								protocol: 'TCP',
								containerPort: 25565,
								name: 'minecraft',
							},
						],
						resources: {
							limits: {
								cpu: server.subscription.offer.cpuLimit,
								memory: `${server.subscription.offer.memoryLimitGb}Gi`,
							},
							requests: {
								cpu: `${Number.parseFloat(server.subscription.offer.cpuLimit) * 0.5}`,
								memory: `${Math.floor(server.subscription.offer.memoryLimitGb * 0.5)}Gi`,
							},
						},
					},
				],
			},
		}

		try {
			let pod = await this.k8sApi.createNamespacedPod({
				namespace: 'default',
				body: podManifest,
			})

			const nodePort = await this.getAvailablePort()
			const serviceManifest: k8s.V1Service = {
				metadata: {
					name: `service-${server.serverId}`,
					labels: {
						app: 'minecraft-server',
						'server-id': server.serverId,
					},
				},
				spec: {
					type: 'NodePort',
					selector: {
						'server-id': server.serverId,
					},
					ports: [
						{
							protocol: 'TCP',
							port: 25565,
							targetPort: 25565,
							nodePort: nodePort,
						},
					],
				},
			}

			logger.info(
				`Service created for server ${server.serverId} with node port ${nodePort}`,
			)

			const service = await this.k8sApi.createNamespacedService({
				namespace: 'default',
				body: serviceManifest,
			})

			logger.info(
				`Service created for server ${server.serverId} with node port ${nodePort}`,
			)

			return { pod, service, nodePort }
		} catch (error) {
			logger.error('Error while creating the server:', error)
			throw error
		}
	}

	async getHostIP(): Promise<string> {
		try {
			const nodes = await this.k8sApi.listNode()
			if (nodes.items.length > 0) {
				const node = nodes.items[0]
				const addresses = node.status?.addresses || []

				const externalIP = addresses.find(
					addr => addr.type === 'ExternalIP',
				)
				if (externalIP) {
					return externalIP.address
				}

				const internalIP = addresses.find(
					addr => addr.type === 'InternalIP',
				)
				if (internalIP) {
					return internalIP.address
				}
			}
		} catch (error) {
			logger.error('Error while retrieving the host IP:', error)
		}

		return 'localhost'
	}

	async getAvailablePort(): Promise<number> {
		const services = await this.k8sApi.listNamespacedService({
			namespace: 'default',
		})

		const usedPorts = new Set<number>()
		services.items.forEach(service => {
			const ports = service.spec?.ports || []
			ports.forEach(port => {
				if (port.nodePort) {
					usedPorts.add(port.nodePort)
				}
			})
		})

		for (let port = 30000; port <= 32767; port++) {
			if (!usedPorts.has(port)) {
				return port
			}
		}

		logger.error('No port available in the NodePort range 30000-32767')
		throw new Error('No port available in the NodePort range 30000-32767')
	}
}
