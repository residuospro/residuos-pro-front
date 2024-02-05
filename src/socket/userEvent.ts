import { Socket } from "socket.io-client"
import { SocketEvent } from "../utils/enum"
import useProps from "@/context/useProps"
import { IUserDepartmentEvent, IUserEvent } from "@/utils/interfaces"
import { stores } from "@/store"

const {
	parseUser,
	setTotalPages,
	parseUpdateUser,
	parseUpdateUserAfterDepartment,
} = useProps()

export const userEvent = (socket: Socket) => {
	socket.on(SocketEvent.USER_CREATED, (data: IUserEvent) => {
		const { company_store, user_store } = stores()

		const users = user_store.getUsers
		const idCompany_store = company_store.getIdCompany

		const { idCompany, user, totalPages } = data.data

		if (idCompany == idCompany_store && user && users.length) {
			user_store.setUsers([...users, ...parseUser([user])])

			user_store.setTotalPages(setTotalPages(totalPages))
		}
	})

	socket.on(SocketEvent.UPDATED_USER, (data: IUserEvent) => {
		const { company_store, user_store } = stores()

		const users = user_store.getUsers
		const idCompany_store = company_store.getIdCompany

		const { idCompany, user } = data.data

		if (idCompany == idCompany_store && user && users.length) {
			user_store.setUsers(parseUpdateUser([user], users))
		}
	})

	socket.on(
		SocketEvent.UPDATED_USER_AFTER_DEPARTMENT,
		(data: IUserDepartmentEvent) => {
			const { company_store, user_store } = stores()

			const users = user_store.getUsers
			const idCompany_store = company_store.getIdCompany

			const { idCompany, user } = data.data

			if (idCompany == idCompany_store && user && users.length) {
				user_store.setUsers(parseUpdateUserAfterDepartment(user, users))
			}
		}
	)

	socket.on(SocketEvent.DELETED_USER, (data: IUserEvent) => {
		const { company_store, user_store } = stores()

		const users = user_store.getUsers
		const idCompany_store = company_store.getIdCompany

		const { idCompany, user } = data.data

		if (idCompany == idCompany_store && user && users.length) {
			user_store.setUsers(users.filter((d) => d.id != user._id))
		}
	})

	socket.on(
		SocketEvent.DELETED_USER_AFTER_DEPARTMENT,
		(data: IUserDepartmentEvent) => {
			const { company_store, user_store } = stores()

			const users = user_store.getUsers
			const idCompany_store = company_store.getIdCompany

			const { idCompany, user } = data.data

			if (idCompany == idCompany_store && user.length && users.length) {
				user_store.setUsers(
					users.filter((d) => d.idDepartment != user[0].idDepartment)
				)
			}
		}
	)
}
