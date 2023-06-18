import { useClient } from "@/clients/AxiosClient"
import { AuthorizationUser, Routes } from "@/utils/enum"
import { IUsers } from "@/utils/interfaces"
import { getPermission } from "@/utils/permissions"

const permission = getPermission()

export const takeAllUsers = async (page: number, itemsPerPage: number) => {
	try {
		let data: any = {
			page,
			itemsPerPage,
		}

		if (permission.includes(AuthorizationUser.ADMIN)) {
			data = { ...data, role: [AuthorizationUser.MANAGER] }
		} else if (permission.includes(AuthorizationUser.MANAGER)) {
			data = { ...data, role: [AuthorizationUser.COLLABORATOR] }
		}

		const res: any = await useClient().post(Routes.GET_ALL_USERS, data)

		console.log("u", res)

		return res
	} catch (error) {
		return error
	}
}

export const createUser = async (user: IUsers, department: any) => {
	try {
		const data: any = {
			name: user.name,
			idDepartment: department.id,
			department: department.name,
			ramal: user.ramal,
			username: user.username,
			email: user.email,
			role: permission,
		}

		const res = await useClient().post(Routes.SAVE_USER, data)

		return res
	} catch (error) {
		return error
	}
}
