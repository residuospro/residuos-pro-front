import axios, { AxiosInstance } from "axios"
import { Credential } from "@/utils/interfaces"

let restClient: AxiosInstance

export const setupClient = (baseUrl: string | undefined) => {
	restClient = axios.create({
		baseURL: baseUrl,
	})
}

export const setBearerAuthorization = (
	client: AxiosInstance,
	token: string
) => {
	client.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

export const setBasicAuthorization = (
	client: AxiosInstance,
	encode: string
) => {
	client.defaults.headers.common["Authorization"] = `Basic ${encode}`
}

export const setContentType = (client: AxiosInstance) => {
	client.defaults.headers.common["Content-Type"] = "application/json"
}

export const useClient = () => restClient
