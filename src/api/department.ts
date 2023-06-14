import { useClient } from "@/clients/AxiosClient"
import { Routes } from "@/utils/enum"
import { IDepartment } from "@/utils/interfaces"

export const createDepartment = async (department: IDepartment) => {
	try {
		const data = {
			name: department.name,
			responsible: department.responsible,
			email: department.email,
			ramal: department.ramal,
		}

		const res = await useClient().post(Routes.CREATE_DEPARTMENT, data)

		console.log(res)

		return res
	} catch (error) {
		return error
	}
}

export const takeAllDepartments = async (
	page: number,
	itemsPerPage: number
) => {
	try {
		const data = {
			page,
			itemsPerPage,
		}

		const res = await useClient().post(Routes.GET_ALL_DEPARTMENT, data)

		console.log("all", res)

		return res
	} catch (error) {
		return error
	}
}
