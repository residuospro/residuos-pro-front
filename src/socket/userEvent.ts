import { Socket } from "socket.io-client"
import { Event } from "../utils/enum"
import useProps from "@/context/useProps"
import { IUserEvent } from "@/utils/interfaces"

const { parseUser, setTotalPages, setStore, parseUpdateUser } = useProps()

export const userEvent = (socket: Socket) => {
	socket.on(Event.USER_CREATED, (data: IUserEvent) => {
		const { idCompany_store, users, user_store } = setStore()

		if (data.idCompany == idCompany_store && data.item && users.length) {
			user_store.setUsers([...users, ...parseUser([data.item])])

			user_store.setTotalPages(setTotalPages(data.totalPages))
		}
	})

	socket.on(Event.UPDATED_USER, (data: IUserEvent) => {
		const { idCompany_store, users, user_store } = setStore()

		if (data.idCompany == idCompany_store && data.item && users.length) {
			user_store.setUsers(parseUpdateUser([data.item], users))
		}
	})

	socket.on(Event.DELETED_USER, (data: IUserEvent) => {
		const { idCompany_store, users, user_store } = setStore()

		if (data.idCompany == idCompany_store && data.item && users.length) {
			user_store.setUsers(users.filter((d) => d.id != data.item._id))
		}
	})
}
