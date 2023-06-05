import { setBearerAuthorization, useClient } from "@/clients/AxiosClient"
import { Routes } from "@/utils/enum"
import { setIsAuthenticated, setPermission } from "@/utils/permissions"
import axios from "axios"

export const signIn = async (user: any) => {
	try {
		const config = {
			auth: { username: user.username.trim(), password: user.password.trim() },
		}
		const res: any = await useClient().post(Routes.LOGIN, config)

		console.log(res)

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
