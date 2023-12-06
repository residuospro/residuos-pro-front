import { getNewToken } from "@/api/refreshToken"
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { userStore } from "@/store/userStore"
import { removeItems } from "@/utils/permissions"

export const handleRequest = async (
	options: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
	return options
}

export const handleResponse = async (
	response: AxiosResponse
): Promise<AxiosResponse<any, any>> => {
	if (response.status === 401) {
		const userId = userStore().getUserId
		const token = await getNewToken(userId)

		if (token) {
			const instance = axios.create()
			response.config.headers["Authorization"] = `Bearer ${token}`

			const result = await instance.request({
				...response.config,
			})

			return result
		} else {
			removeItems()
			location.href = "/"
		}
	}

	return response
}

export const handleError = (error: any): Promise<never> => {
	return Promise.reject(error)
}

export const interceptors = {
	handleRequest,
	handleResponse,
	handleError,
}
