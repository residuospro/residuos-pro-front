import { Socket } from "socket.io-client"
import { AuthorizationUser, SocketEvent } from "../utils/enum"
import { hasPermission } from "@/utils/permissions"
import { ICollectionEvent } from "@/utils/interfaces"
import { notify } from "@kyvg/vue3-notification"
import { audioStore } from "@/store/audioStore"
import { stores } from "@/store"

export const collectionEvent = (socket: Socket) => {
	socket.on(SocketEvent.COLLECTION_CREATED, (data: ICollectionEvent) => {
		const { idCompany } = data.data
		const { company_store } = stores()

		const idCompany_store = company_store.getIdCompany

		if (
			idCompany == idCompany_store &&
			hasPermission([AuthorizationUser.ADMIN])
		) {
			notify({
				title: "Pedido de coleta",
				text: "Você recebeu um novo pedido",
				closeOnClick: true,
				ignoreDuplicates: true,
			})

			const audio = audioStore()

			audio.playAudio()
		}
	})
}
