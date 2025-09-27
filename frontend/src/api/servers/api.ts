import axios from '@/api/axios'

class ServersApi {
	async getServers() {
		const response = await axios.get('/servers')
		return response.data
	}

	async getServer(id: string) {
		const response = await axios.get(`/servers/${id}`)
		return response.data
	}

}

export const serversApi = new ServersApi()
