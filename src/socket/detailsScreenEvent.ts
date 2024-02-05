import { Socket } from "socket.io-client"
import useProps from "@/context/useProps"
import { Fn, ICollectionEvent } from "@/utils/interfaces"
import { SocketEvent } from "@/utils/enum"
import { stores } from "@/store"

const { handleUrl } = useProps()

export const detailsScreenEvent = (url: string, socket: Socket, fn: Fn) => {
	socket.on(
		SocketEvent.UPDATE_STATUS_IN_THE_DETAILS_SCREEN,
		async (data: ICollectionEvent) => {
			const { idCompany, collection } = data.data

			const { company_store } = stores()
			const idCompany_store = company_store.getIdCompany

			const collectionId = handleUrl(url)

			if (idCompany == idCompany_store && collection._id == collectionId) {
				await fn.getCollectionById()
			}
		}
	)

	socket.on(
		SocketEvent.NOTIFY_CANCELLATION_ON_DETAILS_SCREEN,
		async (data: ICollectionEvent) => {
			const { idCompany, collection } = data.data

			const { company_store } = stores()
			const idCompany_store = company_store.getIdCompany

			const collectionId = handleUrl(url)

			if (idCompany == idCompany_store && collection._id == collectionId) {
				await fn.notifyCollectionCancellation()
			}
		}
	)

	socket.on(SocketEvent.UPDATE_COLLECTION, async (data: ICollectionEvent) => {
		const { idCompany, collection } = data.data

		const { company_store } = stores()
		const idCompany_store = company_store.getIdCompany

		const collectionId = handleUrl(url)

		if (idCompany == idCompany_store && collection._id == collectionId) {
			await fn.notifyCollectionUpdate()
			await fn.getCollectionById()
		}
	})
}
