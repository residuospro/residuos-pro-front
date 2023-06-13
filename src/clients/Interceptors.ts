// import { getNewToken } from "@/repositories/refreshToken"
// import { removeItems } from "@/utils/permissions"
// import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"

// abstract class Interceptor {
// 	abstract onRequest(
// 		options: InternalAxiosRequestConfig
// 	): Promise<InternalAxiosRequestConfig>

// 	abstract onResponse(response: AxiosResponse): Promise<AxiosResponse>

// 	abstract onError(error: any): Promise<never>
// }

// export class RefreshTokenInterceptor implements Interceptor {
// 	async onRequest(
// 		options: InternalAxiosRequestConfig<any>
// 	): Promise<InternalAxiosRequestConfig<any>> {
// 		return options
// 	}

// 	async onResponse(
// 		response: AxiosResponse<any, any>
// 	): Promise<AxiosResponse<any, any>> {
// 		if (response.status === 401) {
// 			const token = await getNewToken()

// 			if (token) {
// 				const instance = axios.create()

// 				response.config.headers["Authorization"] = `Bearer ${token}`

// 				const result = await instance.request({
// 					...response.config,
// 				})

// 				return result
// 			} else {
// 				alert(
// 					"Sua sessão expirou. Você será redirecionado para a página de login."
// 				)

// 				removeItems()
// 				location.href = "/"
// 			}
// 		}

// 		return response
// 	}

// 	onError(error: any): Promise<never> {
// 		return Promise.reject(error)
// 	}
// }
