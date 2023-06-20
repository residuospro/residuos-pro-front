import { useClient } from "@/clients/AxiosClient"
import { AuthorizationUser, Routes } from "@/utils/enum"
import { IUsers } from "@/utils/interfaces"
import { getPermission } from "@/utils/permissions"

const permission = getPermission()

export const createUser = async (user: IUsers, departmentInfo: any) => {
	try {
		const data = {
			name: user.name,
			username: user.username,
			email: user.email,
			department: departmentInfo.name,
			idDepartment: departmentInfo.id,
			ramal: user.ramal,
			role: permission,
		}

		const res = await useClient().post(Routes.SAVE_USER, data)

		return res
	} catch (error) {
		return error
	}
}

export const takeAllUsers = async (page: number, itemsPerPage: number) => {
	try {
		let data: any = {
			page,
			itemsPerPage,
		}

		if (permission.includes(AuthorizationUser.ADMIN)) {
			data = { ...data, role: [AuthorizationUser.MANAGER] }
		} else {
			data = { ...data, role: [AuthorizationUser.COLLABORATOR] }
		}

		const res = await useClient().post(Routes.GET_ALL_USERS, data)

		return res
	} catch (error) {
		return error
	}
}

export const takeAllUsernames = async () => {
	try {
		const data: any = {
			role: [],
		}

		if (permission.includes(AuthorizationUser.ADMIN)) {
			data.role.push(AuthorizationUser.MANAGER)
		} else {
			data.role.push(AuthorizationUser.COLLABORATOR)
		}

		const res = await useClient().post(Routes.GET_ALL_USERNAMES, data)

		console.log("usernames", res)
		return res
	} catch (error) {
		return error
	}
}
