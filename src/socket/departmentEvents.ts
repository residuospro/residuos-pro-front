import { Socket } from "socket.io-client"
import useProps from "@/context/useProps"
import { SocketEvent } from "../utils/enum"
import { IDepartmentEvent } from "@/utils/interfaces"
import { stores } from "@/store"

const { parseDepartment, setTotalPages, parseUpdateDepartment } = useProps()

export const departmentEvents = (socket: Socket) => {
	socket.on(SocketEvent.DEPARTMENT_CREATED, (data: IDepartmentEvent) => {
		const { idCompany, department, totalPages } = data.data

		const { company_store, department_store } = stores()

		const departments = department_store.getDepartments
		const idCompany_store = company_store.getIdCompany

		if (idCompany == idCompany_store && department && departments.length) {
			department_store.setDepartments([
				...departments,
				...parseDepartment([department]),
			])

			department_store.setTotalPages(setTotalPages(totalPages))
		}
	})

	socket.on(SocketEvent.UPDATED_DEPARTMENT, (data: IDepartmentEvent) => {
		const { company_store, department_store } = stores()

		const departments = department_store.getDepartments
		const idCompany_store = company_store.getIdCompany

		const { idCompany, department } = data.data

		if (idCompany == idCompany_store && department && departments.length) {
			department_store.setDepartments(
				parseUpdateDepartment([department], departments)
			)
		}
	})

	socket.on(SocketEvent.DELETED_DEPARTMENT, (data: IDepartmentEvent) => {
		const { company_store, department_store } = stores()

		const departments = department_store.getDepartments
		const idCompany_store = company_store.getIdCompany

		const { idCompany, department } = data.data

		if (idCompany == idCompany_store && department && departments.length) {
			department_store.setDepartments(
				departments.filter((d) => d.id != department._id)
			)
		}
	})
}
