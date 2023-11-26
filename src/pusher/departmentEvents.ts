import { Channel } from "pusher-js"
import useProps from "@/context/useProps"
import { Event } from "../utils/enum"
import { IDepartmentEvent } from "@/utils/interfaces"

const { parseDepartment, setTotalPages, parseUpdateDepartment, setStore } =
	useProps()

export const departmentEvents = (channel: Channel) => {
	channel.bind(Event.DEPARTMENT_CREATED, (data: IDepartmentEvent) => {
		const { idCompany_store, departments, department_store } = setStore()

		if (
			data.idCompany == idCompany_store &&
			data.department &&
			departments.length
		) {
			department_store.setDepartments([
				...departments,
				...parseDepartment([data.department]),
			])

			department_store.setTotalPages(setTotalPages(data.totalPages))
		}
	})

	channel.bind(Event.UPDATED_DEPARTMENT, (data: IDepartmentEvent) => {
		const { idCompany_store, departments, department_store } = setStore()

		if (
			data.idCompany == idCompany_store &&
			data.department &&
			departments.length
		) {
			department_store.setDepartments(
				parseUpdateDepartment([data.department], departments)
			)
		}
	})

	channel.bind(Event.DELETED_DEPARTMENT, (data: IDepartmentEvent) => {
		const { idCompany_store, departments, department_store } = setStore()

		if (
			data.idCompany == idCompany_store &&
			data.department &&
			departments.length
		) {
			department_store.setDepartments(
				departments.filter((d) => d.id != data.department._id)
			)
		}
	})
}
