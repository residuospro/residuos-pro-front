import { Socket } from "socket.io-client"
import useProps from "@/context/useProps"
import { SocketEvent } from "../utils/enum"
import { ISedimentEvent } from "@/utils/interfaces"
import { notify } from "@kyvg/vue3-notification"
import { audioStore } from "@/store/audioStore"

const { setTotalPages, setStore, parseSediments, parseUpdateSediment } =
	useProps()

export const sedimentEvent = (socket: Socket) => {
	socket.on(SocketEvent.SEDIMENT_CREATED, (data: ISedimentEvent) => {
		const { idCompany_store, sediments, sediment_store, department_store } =
			setStore()

		const { idCompany, idDepartment, sediment, totalPages } = data.data

		const idDepartment_store = department_store.getIdDepartment

		if (
			idCompany == idCompany_store &&
			sediment &&
			sediments.length &&
			idDepartment == idDepartment_store
		) {
			sediment_store.setSediments([...sediments, ...parseSediments([sediment])])

			sediment_store.setTotalPages(setTotalPages(totalPages))
		}
	})

	socket.on(SocketEvent.UPDATED_SEDIMENT, (data: ISedimentEvent) => {
		const { idCompany_store, sediments, sediment_store, department_store } =
			setStore()

		const { idCompany, idDepartment, sediment } = data.data

		const idDepartment_store = department_store.getIdDepartment

		if (
			idCompany == idCompany_store &&
			sediment &&
			sediments.length &&
			idDepartment == idDepartment_store
		) {
			sediment_store.setSediments(parseUpdateSediment([sediment], sediments))
		}
	})

	socket.on(SocketEvent.DELETED_SEDIMENT, (data: ISedimentEvent) => {
		const { idCompany_store, sediments, sediment_store, department_store } =
			setStore()

		const { idCompany, idDepartment, sediment } = data.data

		const idDepartment_store = department_store.getIdDepartment

		if (
			idCompany == idCompany_store &&
			sediment &&
			sediments.length &&
			idDepartment == idDepartment_store
		) {
			sediment_store.setSediments(sediments.filter((s) => s.id != sediment._id))
		}
	})
}
