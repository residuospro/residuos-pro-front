import { Routes } from "@/utils/enum"
import { useClient } from "@/clients/AxiosClient"
import { ICollectionData } from "@/utils/interfaces"

export const createCollectionApi = async (collectionData: ICollectionData) => {
	try {
		const data = {
			...collectionData,
		}

		const res = await useClient().post(Routes.SAVE_COLLECTION, data)

		return res
	} catch (error) {
		return error
	}
}

export const getCollectionByPageApi = async (
	idCompany: string,
	page: number,
	itemsPerPage: number,
	idDepartment?: string
) => {
	try {
		const data = { idCompany, idDepartment, page, itemsPerPage }

		const res = await useClient().post(Routes.GET_COLLECTION_BY_PAGE, data)

		return res
	} catch (error) {
		return error
	}
}

export const getCollectionByIdApi = async (
	idCompany: string,
	id: string,
	idDepartment?: string
) => {
	try {
		const data = { idCompany, idDepartment }

		const res = await useClient().post(
			`${Routes.GET_COLLECTION_BY_ID}${id}`,
			data
		)

		return res
	} catch (error) {
		return error
	}
}
