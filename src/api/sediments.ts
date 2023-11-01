import { useClient } from "@/clients/AxiosClient"
import { Routes } from "@/utils/enum"
import { ISediments } from "@/utils/interfaces"

export const createSedmentsApi = async (sediment: ISediments) => {
	try {
		const res = await useClient().post(Routes.SAVE_SEDIMENTS, sediment)

		return res
	} catch (error) {
		return error
	}
}

export const getSedimentsByPageApi = async (
	page: number,
	itemsPerPage: number,
	idCompany: string,
	idDepartment: string
) => {
	try {
		const data = {
			page,
			itemsPerPage,
			idCompany,
			idDepartment,
		}

		const res = await useClient().post(Routes.GET_SEDIMENTS_BY_PAGE, data)

		return res
	} catch (error) {
		return error
	}
}

export const getNameOfSedimentsApi = async (
	idCompany: string,
	idDepartment: string
) => {
	try {
		const data = {
			idCompany,
			idDepartment,
		}

		const res = await useClient().post(Routes.GET_NAME_OF_SEDIMENTS, data)

		return res
	} catch (error) {
		return error
	}
}
