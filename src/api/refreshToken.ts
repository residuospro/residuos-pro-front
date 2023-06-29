import { setBearerAuthorization, useClient } from "@/clients/AxiosClient"
import { Routes } from "@/utils/enum"
import { getRefreshToken, setIsAuthenticated } from "@/utils/permissions"
import axios from "axios"

export const getNewToken = async (userId: string) => {
	try {
		const config: any = {
			method: "POST",
			url: `${process.env.VUE_APP_BACK}${Routes.REFRESH_TOKEN}`,
			headers: { Authorization: `Bearer ${getRefreshToken()}` },
			data: { userId },
		}

		const res = await axios(config)

		if (res?.status == 200) {
			const token = res.data.token
			const refresh_token = res.data.refresh_token

			setBearerAuthorization(useClient(), token)

			setIsAuthenticated(token, refresh_token)

			return token
		}

		throw new Error("Não foi possível gerar um novo token")
	} catch (error) {
		return null
	}
}
