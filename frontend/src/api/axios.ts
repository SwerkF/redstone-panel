import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from 'axios'
import Cookies from 'js-cookie'

class AxiosService {
	private apiUrl: string
	private instance: AxiosInstance

	constructor() {
		this.apiUrl = import.meta.env.VITE_API_URL as string
		this.instance = axios.create({
			baseURL: this.apiUrl,
		})

		this.setupInterceptors()
	}

	private setupInterceptors(): void {
		this.instance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				const token = Cookies.get('accessToken')
				if (token) {
					config.headers.Authorization = `Bearer ${token}`
				}
				return config
			},
			error => {
				return Promise.reject(error)
			},
		)

		this.instance.interceptors.response.use(
			(response: AxiosResponse) => {
				const { accessToken, refreshToken } = response.data.tokens ?? {}
				if (accessToken && refreshToken) {
					Cookies.set('accessToken', accessToken, { expires: 1 })
					Cookies.set('refreshToken', refreshToken, { expires: 30 })
				}
				return response
			},
			async error => {
				const originalRequest = error.config
				const responseStatus = error?.response?.status
				const errorMessage = error?.response?.data?.message
				const refreshToken = Cookies.get('refreshToken')

				if (
					responseStatus === 401 &&
					errorMessage === 'Token expired' &&
					refreshToken &&
					!originalRequest._retry
				) {
					originalRequest._retry = true
					try {
						const refreshResponse = await axios.post(
							`${this.apiUrl}/auth/refresh-token`,
							{ refreshToken },
						)
						const {
							accessToken: newToken,
							refreshToken: newRefreshToken,
						} = refreshResponse.data
						if (newToken && newRefreshToken) {
							Cookies.set('accessToken', newToken)
							Cookies.set('refreshToken', newRefreshToken)
							originalRequest.headers.Authorization = `Bearer ${newToken}`
							return this.instance(originalRequest)
						}
					} catch (refreshError) {
						window.location.href = '/login'
						return Promise.reject(refreshError)
					}
				}
				return Promise.reject(error)
			},
		)
	}

	public getInstance(): AxiosInstance {
		return this.instance
	}
}

export default new AxiosService().getInstance()
