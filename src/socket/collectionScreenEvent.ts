import useProps from "@/context/useProps"
import { SocketEvent } from "@/utils/enum"
import { ICollectionEvent } from "@/utils/interfaces"
import { Socket } from "socket.io-client"

const { setStore } = useProps()

export const collectionScreenEvent = (
	socket: Socket,
	fn: () => Promise<void>
) => {
	socket.on(SocketEvent.COLLECTION_CREATED, async (data: ICollectionEvent) => {
		const { idCompany } = data.data
		const { idCompany_store } = setStore()

		if (idCompany == idCompany_store) {
			await fn()
		}
	})

	socket.on(
		SocketEvent.UPDATE_COLLECTION_STATUS,
		async (data: ICollectionEvent) => {
			const { idCompany } = data.data
			const { idCompany_store } = setStore()

			if (idCompany == idCompany_store) {
				await fn()
			}
		}
	)

	socket.on(SocketEvent.DELETE_COLLECTION, async (data: ICollectionEvent) => {
		const { idCompany } = data.data
		const { idCompany_store } = setStore()

		if (idCompany == idCompany_store) {
			await fn()
		}
	})
}
