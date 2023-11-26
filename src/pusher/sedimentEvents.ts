import { Channel } from "pusher-js"
import useProps from "@/context/useProps"
import { Event } from "../utils/enum"
import { ISedimentEvent } from "@/utils/interfaces"

const { setTotalPages, setStore, parseSediments, parseUpdateSediment } =
	useProps()

export const sedimentEvent = (channel: Channel) => {
	channel.bind(Event.SEDIMENT_CREATED, (data: ISedimentEvent) => {
		const { idCompany_store, sediments, sediment_store, department_store } =
			setStore()

		const idDepartment = department_store.getIdDepartment

		if (
			data.idCompany == idCompany_store &&
			data.sediment &&
			sediments.length &&
			idDepartment &&
			data.idDepartment
		) {
			sediment_store.setSediments([
				...sediments,
				...parseSediments([data.sediment]),
			])

			sediment_store.setTotalPages(setTotalPages(data.totalPages))
		}
	})

	channel.bind(Event.UPDATED_SEDIMENT, (data: ISedimentEvent) => {
		const { idCompany_store, sediments, sediment_store, department_store } =
			setStore()

		const idDepartment = department_store.getIdDepartment

		if (
			data.idCompany == idCompany_store &&
			data.sediment &&
			sediments.length &&
			idDepartment &&
			data.idDepartment
		) {
			sediment_store.setSediments(
				parseUpdateSediment([data.sediment], sediments)
			)
		}
	})

	channel.bind(Event.DELETED_SEDIMENT, (data: ISedimentEvent) => {
		const { idCompany_store, sediments, sediment_store, department_store } =
			setStore()

		const idDepartment = department_store.getIdDepartment

		if (
			data.idCompany == idCompany_store &&
			data.sediment &&
			sediments.length &&
			idDepartment &&
			data.idDepartment
		) {
			sediment_store.setSediments(
				sediments.filter((s) => s.id != data.sediment._id)
			)
		}
	})
}
