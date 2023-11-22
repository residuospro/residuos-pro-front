import { Channel } from "pusher-js"
import useProps from "@/context/useProps"
import { Event } from "../utils/enum"

const { parseDepartment, setTotalPages, parseUpdateDepartment, setStore } =
	useProps()

export const departmentEvents = (channel: Channel) => {
	channel.bind(Event.DEPARTMENT_CREATED, (data: any) => {
		console.log("departmentecreated", data)

		const { idCompany, departments, department_store } = setStore()

		if (data.idCompany == idCompany && data.department && departments.length) {
			department_store.setDepartments([
				...departments,
				...parseDepartment([data.department]),
			])

			department_store.setTotalPages(setTotalPages(data.totalPages))
		}
	})

	channel.bind(Event.UPDATED_DEPARTMENT, (data: any) => {
		const { idCompany, departments, department_store } = setStore()

		if (data.idCompany == idCompany && data.department && departments.length) {
			department_store.setDepartments(
				parseUpdateDepartment([data.department], departments)
			)
		}
	})

	channel.bind(Event.DELETED_DEPARTMENT, (data: any) => {
		const { idCompany, departments, department_store } = setStore()

		if (data.idCompany == idCompany && data.department && departments.length) {
			department_store.setDepartments(
				departments.filter((d) => d.id != data.department._id)
			)
		}
	})
}
