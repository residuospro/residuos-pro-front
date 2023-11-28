import { Socket } from "socket.io-client"
import useProps from "@/context/useProps"
import { Event } from "../utils/enum"
import { IDepartmentEvent } from "@/utils/interfaces"

const { parseDepartment, setTotalPages, parseUpdateDepartment, setStore } =
	useProps()

export const departmentEvents = (socket: Socket) => {
	socket.on(Event.DEPARTMENT_CREATED, (data: IDepartmentEvent) => {
		const { idCompany_store, departments, department_store } = setStore()

		if (data.idCompany == idCompany_store && data.item && departments.length) {
			department_store.setDepartments([
				...departments,
				...parseDepartment([data.item]),
			])

			department_store.setTotalPages(setTotalPages(data.totalPages))
		}
	})

	socket.on(Event.UPDATED_DEPARTMENT, (data: IDepartmentEvent) => {
		const { idCompany_store, departments, department_store } = setStore()

		if (data.idCompany == idCompany_store && data.item && departments.length) {
			department_store.setDepartments(
				parseUpdateDepartment([data.item], departments)
			)
		}
	})

	socket.on(Event.DELETED_DEPARTMENT, (data: IDepartmentEvent) => {
		const { idCompany_store, departments, department_store } = setStore()

		if (data.idCompany == idCompany_store && data.item && departments.length) {
			department_store.setDepartments(
				departments.filter((d) => d.id != data.item._id)
			)
		}
	})
}
