import { useClient } from "@/clients/AxiosClient"
import { AuthorizationUser, Routes } from "@/utils/enum"
import { IUsers } from "@/utils/interfaces"
import { getPermission } from "@/utils/permissions"

const permission = getPermission()

export const createUser = async (user: IUsers) => {
	try {
		const data = {
			name: user.name,
			username: user.username,
			email: user.email,
			department: user.department,
			idDepartment: user.idDepartment,
			ramal: user.ramal,
			role: permission,
			idCompany: user.idCompany,
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
		} else {
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

export const takeAllUsernames = async (idCompany: string) => {
	try {
		const data: any = {
			role: [],
			idCompany,
		}

		if (permission.includes(AuthorizationUser.ADMIN)) {
			data.role.push(AuthorizationUser.MANAGER)
		} else {
			data.role.push(AuthorizationUser.COLLABORATOR)
		}

		const res = await useClient().post(Routes.GET_ALL_USERNAMES, data)

		return res
	} catch (error) {
		return error
	}
}

export const takeUserByUsername = async (
	username: string,
	idCompany: string
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

export const updateUser = async (user: IUsers, id: string) => {
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

		const res = await useClient().put(`${Routes.UPDATE_USER}${id}`, data)

		return res
	} catch (error) {
		return error
	}
}

export const deleteUser = async (userId: string) => {
	try {
		const res = await useClient().delete(`${Routes.DELETE_USER}${userId}`)

		return res
	} catch (error) {
		return error
	}
}
