import { Socket } from "socket.io-client"
import useProps from "@/context/useProps"
import { AuthorizationUser, SocketEvent } from "../utils/enum"
import { hasPermission } from "@/utils/permissions"
import { ICollectionEvent } from "@/utils/interfaces"
import { notify } from "@kyvg/vue3-notification"
import { audioStore } from "@/store/audioStore"

const { setStore } = useProps()

export const collectionEvent = (socket: Socket) => {
	socket.on(SocketEvent.COLLECTION_CREATED, (data: ICollectionEvent) => {
		const { idCompany } = data.data
		const { idCompany_store } = setStore()

		console.log("d", idCompany, idCompany_store)
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
			console.log("oi")

			const audio = audioStore()

			audio.playAudio()
		}
	})
}
