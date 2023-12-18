import { Socket } from "socket.io-client"
import { Event } from "../utils/enum"
import useProps from "@/context/useProps"
import { IUserDepartmentEvent, IUserEvent } from "@/utils/interfaces"

const {
	parseUser,
	setTotalPages,
	setStore,
	parseUpdateUser,
	parseUpdateUserAfterDepartment,
} = useProps()

export const userEvent = (socket: Socket) => {
	socket.on(Event.USER_CREATED, (data: IUserEvent) => {
		const { idCompany_store, users, user_store } = setStore()

		const { idCompany, user, totalPages } = data.data

		if (idCompany == idCompany_store && user && users.length) {
			user_store.setUsers([...users, ...parseUser([user])])

			user_store.setTotalPages(setTotalPages(totalPages))
		}
	})

	socket.on(Event.UPDATED_USER, (data: IUserEvent) => {
		const { idCompany_store, users, user_store } = setStore()

		const { idCompany, user } = data.data

		if (idCompany == idCompany_store && user && users.length) {
			user_store.setUsers(parseUpdateUser([user], users))
		}
	})

	socket.on(
		Event.UPDATED_USER_AFTER_DEPARTMENT,
		(data: IUserDepartmentEvent) => {
			const { idCompany_store, users, user_store } = setStore()

			const { idCompany, user } = data.data

			if (idCompany == idCompany_store && user && users.length) {
				user_store.setUsers(parseUpdateUserAfterDepartment(user, users))
			}
		}
	)

	socket.on(Event.DELETED_USER, (data: IUserEvent) => {
		const { idCompany_store, users, user_store } = setStore()

		const { idCompany, user } = data.data

		if (idCompany == idCompany_store && user && users.length) {
			user_store.setUsers(users.filter((d) => d.id != user._id))
		}
	})

	socket.on(
		Event.DELETED_USER_AFTER_DEPARTMENT,
		(data: IUserDepartmentEvent) => {
			const { idCompany_store, users, user_store } = setStore()

			const { idCompany, user } = data.data

			if (idCompany == idCompany_store && user.length && users.length) {
				user_store.setUsers(
					users.filter((d) => d.idDepartment != user[0].idDepartment)
				)
			}
		}
	)
}
