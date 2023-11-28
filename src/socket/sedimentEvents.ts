import { Socket } from "socket.io-client"
import useProps from "@/context/useProps"
import { Event } from "../utils/enum"
import { ISedimentEvent } from "@/utils/interfaces"

const { setTotalPages, setStore, parseSediments, parseUpdateSediment } =
	useProps()

export const sedimentEvent = (socket: Socket) => {
	socket.on(Event.SEDIMENT_CREATED, (data: ISedimentEvent) => {
		const { idCompany_store, sediments, sediment_store, department_store } =
			setStore()

		const idDepartment = department_store.getIdDepartment

		if (
			data.idCompany == idCompany_store &&
			data.item &&
			sediments.length &&
			idDepartment &&
			data.idDepartment
		) {
			sediment_store.setSediments([
				...sediments,
				...parseSediments([data.item]),
			])

			sediment_store.setTotalPages(setTotalPages(data.totalPages))

			console.log("criado carai")
		}
	})

	socket.on(Event.UPDATED_SEDIMENT, (data: ISedimentEvent) => {
		const { idCompany_store, sediments, sediment_store, department_store } =
			setStore()

		const idDepartment = department_store.getIdDepartment

		if (
			data.idCompany == idCompany_store &&
			data.item &&
			sediments.length &&
			idDepartment &&
			data.idDepartment
		) {
			sediment_store.setSediments(parseUpdateSediment([data.item], sediments))
		}
	})

	socket.on(Event.DELETED_SEDIMENT, (data: ISedimentEvent) => {
		const { idCompany_store, sediments, sediment_store, department_store } =
			setStore()

		const idDepartment = department_store.getIdDepartment

		if (
			data.idCompany == idCompany_store &&
			data.item &&
			sediments.length &&
			idDepartment &&
			data.idDepartment
		) {
			sediment_store.setSediments(
				sediments.filter((s) => s.id != data.item._id)
			)
		}
	})
}
