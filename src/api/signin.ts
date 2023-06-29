import {
	setBearerAuthorization,
	useClient,
	setBasicAuthorization,
} from "@/clients/AxiosClient"
import { Routes } from "@/utils/enum"
import { setIsAuthenticated, setPermission } from "@/utils/permissions"

export const signin = async (user: any) => {
	try {
		const encode = btoa(`${user.username}:${user.password}`)

		setBasicAuthorization(useClient(), encode)

		const res = await useClient().post(Routes.LOGIN)

		if (res?.status == 401) {
			return res
		}

		const token = res.data.token
		const refresh_token = res.data.refreshToken

		setBearerAuthorization(useClient(), token)

		const payload: any = await getPayload()

		const userId = payload.data.userId

		const idCompany = payload.data.company

		const roles = payload.data.permission

		setIsAuthenticated(token, refresh_token)

		setPermission(roles)

		return { res, userId, idCompany }
	} catch (error) {
		return error
	}
}

export const getPayload = async () => {
	try {
		const res = await useClient().get(Routes.PAYLOAD)

		return res
	} catch (error: any) {
		return error.response.status
	}
}
