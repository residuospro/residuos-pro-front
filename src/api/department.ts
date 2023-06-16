import { useClient } from "@/clients/AxiosClient"
import { Routes } from "@/utils/enum"
import { IDepartment } from "@/utils/interfaces"

export const createDepartment = async (department: IDepartment) => {
	try {
		const data = {
			name: department.name.toUpperCase(),
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

export const takeDepartmentsByPage = async (
	page: number,
	itemsPerPage: number
) => {
	try {
		const data = {
			page,
			itemsPerPage,
		}

		const res = await useClient().post(Routes.GET_DEPARTMENT_BY_PAGE, data)

		console.log("all", res)

		return res
	} catch (error) {
		return error
	}
}

export const takeAllDepartments = async () => {
	try {
		const res = await useClient().post(Routes.GET_ALL_DEPARTMENT)
		console.log("all", res)

		return res
	} catch (error) {
		return error
	}
}

export const takeDepartmentsByName = async (name: string) => {
	try {
		const data = {
			name,
		}
		const res = await useClient().post(Routes.GET_DEPARTMENT_BY_NAME, data)

		return res
	} catch (error) {
		return error
	}
}

export const deleteDepartments = async (id: string) => {
	try {
		const res = await useClient().delete(`${Routes.DELETE_DEPARTMENT}${id}`)

		return res
	} catch (error) {
		return error
	}
}
