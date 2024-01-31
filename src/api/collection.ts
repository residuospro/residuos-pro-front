import { Routes } from "@/utils/enum"
import { useClient } from "@/clients/AxiosClient"
import {
	ICollectionData,
	ICollectionFilter,
	IFilterCollection,
	IFilterSelected,
} from "@/utils/interfaces"

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

export const getCollectionByFilterApi = async (
	collectionFilter: IFilterSelected,
	idCompany: string,
	page: string,
	itemsPerPage: string,
	idDepartment?: string
) => {
	try {
		const data: Partial<IFilterCollection> = {
			idCompany,
			page,
			itemsPerPage,
			idDepartment,
		}

		for (const key in collectionFilter) {
			if (
				collectionFilter[key as keyof IFilterSelected] &&
				collectionFilter[key as keyof IFilterSelected] != ""
			) {
				data[key as keyof IFilterCollection] =
					collectionFilter[key as keyof IFilterSelected]!
			}
		}

		const res = await useClient().post(Routes.GET_COLLECTION_BY_FILTER, data)

		return res
	} catch (error) {
		return error
	}
}

export const getAllCollectionsApi = async (
	idCompany: string,
	idDepartment?: string
) => {
	try {
		const data = { idCompany, idDepartment }

		const res = await useClient().post(Routes.GET_ALL_COLLECTIONS, data)

		return res
	} catch (error) {
		return error
	}
}

export const updateCollectionStatusApi = async (
	id: string,
	status: string,
	idCompany: string,
	reason?: string
) => {
	try {
		const data = {
			status,
			reason,
			idCompany,
		}

		const res = await useClient().post(
			`${Routes.UPDATE_COLLECTION_STATUS}${id}`,
			data
		)

		return res
	} catch (error) {
		return error
	}
}

export const updateCollectionApi = async (
	collection: Partial<ICollectionData>,
	idCompany: string
) => {
	try {
		const data = {
			collection,
			idCompany,
		}

		const res = await useClient().post(
			`${Routes.UPDATE_COLLECTION}${collection.id}`,
			data
		)

		return res
	} catch (error) {
		return error
	}
}

export const deleteCollectionApi = async (idCompany: string, id?: string) => {
	try {
		const data = {
			idCompany,
		}

		const res = await useClient().post(`${Routes.DELETE_COLLECTION}${id}`, data)

		return res
	} catch (error) {
		return error
	}
}
