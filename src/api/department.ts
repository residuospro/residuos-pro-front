import { useClient } from "@/clients/AxiosClient"
import { Routes } from "@/utils/enum"
import { IDepartment } from "@/utils/interfaces"

export const createDepartment = async (
	department: IDepartment,
	idCompany: string
) => {
	try {
		const data = {
			name: department.name.toUpperCase(),
			responsible: department.responsible,
			email: department.email,
			ramal: department.ramal,
			idCompany,
		}

		const res = await useClient().post(Routes.CREATE_DEPARTMENT, data)

		return res
	} catch (error) {
		return error
	}
}

export const takeDepartmentsByPage = async (
	page: number,
	itemsPerPage: number,
	idCompany: string
) => {
	try {
		const data = {
			page,
			itemsPerPage,
			idCompany,
		}

		const res = await useClient().post(Routes.GET_DEPARTMENT_BY_PAGE, data)

		console.log("rezando", res)

		return res
	} catch (error) {
		console.log("error")

		return error
	}
}

export const takeAllDepartments = async (idCompany: string) => {
	try {
		const data = {
			idCompany,
		}

		const res = await useClient().post(Routes.GET_ALL_DEPARTMENT, data)

		return res
	} catch (error) {
		return error
	}
}

export const takeDepartmentsByName = async (
	name: string,
	idCompany: string
) => {
	try {
		const data = {
			name,
			idCompany,
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

export const updateDepartment = async (
	department: IDepartment,
	idDepartment: string,
	idCompany: string
) => {
	try {
		const data: Partial<IDepartment> = {
			idCompany,
		}

		for (const key in department) {
			if (
				department[key as keyof IDepartment] !== undefined &&
				department[key as keyof IDepartment] !== ""
			) {
				data[key as keyof IDepartment] = department[key as keyof IDepartment]
			}
		}

		const res = await useClient().put(
			`${Routes.UPDATE_DEPARTMENT}${idDepartment}`,
			data
		)

		return res
	} catch (error) {
		return error
	}
}
