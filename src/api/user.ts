import { useClient } from "@/clients/AxiosClient"
import { AuthorizationUser, Routes } from "@/utils/enum"
import { IUsers } from "@/utils/interfaces"

export const createUser = async (
	user: Partial<IUsers>,
	permission: string[]
) => {
	try {
		const data = {
			name: user.name,
			email: user.email,
			department: user.department,
			idDepartment: user.idDepartment,
			ramal: user.ramal,
			role: permission,
			idCompany: user.idCompany,
			service: user.service,
		}

		const res = await useClient().post(Routes.SAVE_USER, data)

		return res
	} catch (error) {
		return error
	}
}

export const takeAllUsers = async (
	page: number,
	itemsPerPage: number,
	idCompany: string,
	permission: string[],
	idDepartment?: string
) => {
	try {
		let data: any = {
			page,
			itemsPerPage,
			idCompany,
		}

		if (permission.includes(AuthorizationUser.ADMIN)) {
			data = { ...data, role: [AuthorizationUser.MANAGER] }
		} else if (permission.includes(AuthorizationUser.MANAGER)) {
			data = { ...data, role: [AuthorizationUser.COLLABORATOR] }
		}

		if (idDepartment) {
			data = { ...data, idDepartment }
		}

		const res = await useClient().post(Routes.GET_ALL_USERS, data)

		return res
	} catch (error) {
		return error
	}
}

export const takeAllUsernames = async (
	idCompany: string,
	permission: string[],
	idDepartment?: string
) => {
	try {
		let data: any = {
			role: [],
			idCompany,
		}

		if (permission.includes(AuthorizationUser.ADMIN)) {
			data.role.push(AuthorizationUser.MANAGER)
		} else if (permission.includes(AuthorizationUser.MANAGER)) {
			data.role.push(AuthorizationUser.COLLABORATOR)
		}

		if (idDepartment) {
			data = { ...data, idDepartment }
		}

		const res = await useClient().post(Routes.GET_ALL_USERNAMES, data)

		return res
	} catch (error) {
		return error
	}
}

export const takeUserByUsername = async (
	username: string,
	idCompany: string,
	permission: string[]
) => {
	try {
		let data: any = {
			username,
			idCompany,
		}

		if (permission.includes(AuthorizationUser.ADMIN)) {
			data = { ...data, role: [AuthorizationUser.MANAGER] }
		} else {
			data = { ...data, role: [AuthorizationUser.COLLABORATOR] }
		}

		const res = await useClient().post(Routes.GET_USER_BY_USERNAME, data)

		return res
	} catch (error) {
		return error
	}
}

export const updateUser = async (user: Partial<IUsers>, id?: string) => {
	try {
		const data: Partial<IUsers> = {}

		for (const key in user) {
			if (
				user[key as keyof IUsers] !== undefined &&
				user[key as keyof IUsers] !== ""
			) {
				data[key as keyof IUsers] = user[key as keyof IUsers]
			}
		}

		console.log("d", user)

		const res = await useClient().put(`${Routes.UPDATE_USER}${id}`, data)

		return res
	} catch (error) {
		return error
	}
}

export const deleteUser = async (idCompany: string, userId?: string) => {
	try {
		const data = { idCompany }

		const res = await useClient().put(`${Routes.DELETE_USER}${userId}`, data)

		return res
	} catch (error) {
		return error
	}
}
