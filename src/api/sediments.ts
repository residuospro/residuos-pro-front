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
	idDepartment?: string
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
	idDepartment?: string
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

export const getSedimentByNameApi = async (
	name: string,
	idCompany: string,
	idDepartment?: string
) => {
	try {
		const data = {
			name,
			idCompany,
			idDepartment,
		}

		const res = await useClient().post(Routes.GET_SEDIMENTS_BY_NAME, data)

		return res
	} catch (error) {
		return error
	}
}

export const updateSedimentsApi = async (sediment: ISediments, id: string) => {
	try {
		const data: Partial<ISediments> = {}

		for (const key in sediment) {
			if (
				sediment[key as keyof ISediments] != undefined &&
				sediment[key as keyof ISediments] != ""
			) {
				data[key as keyof ISediments] = sediment[key as keyof ISediments]
			}
		}

		const res = await useClient().put(`${Routes.UPDATE_SEDIMENTS}${id}`, data)

		return res
	} catch (error) {
		return error
	}
}

export const deleteSedimentApi = async (id: string) => {
	try {
		const res = await useClient().delete(`${Routes.DELETE_SEDIMENT}${id}`)

		return res
	} catch (error) {
		return error
	}
}
