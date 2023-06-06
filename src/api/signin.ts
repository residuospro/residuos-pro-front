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

		const token = res.data.token

		setBearerAuthorization(useClient(), token)

		const payload: any = await getPayload()

		console.log(payload)

		const exp = payload.data.exp
		const roles = payload.data.permission

		setIsAuthenticated(token, exp)

		setPermission(roles)

		return res
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
