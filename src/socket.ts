import { reactive } from "vue"
import { io } from "socket.io-client"
import { isAuthenticated } from "./utils/permissions"
import { setIdCompany } from "@/store/setIdCompany"
import { departmentStore } from "./store/departmentStore"
import useProps from "@/context/useProps"
import { Event } from "./utils/enum"

const accessToken = isAuthenticated()

const { parseDepartment, setTotalPages, parseUpdateDepartment } = useProps()

export const socket = io("http://localhost:3333", {
	withCredentials: true,
	extraHeaders: {
		Authorization: `Bearer ${accessToken}`,
	},
})

export const state = reactive({
	connected: false,
	fooEvents: [],
	barEvents: [],
})

socket.on("connect", () => {
	console.log("socket conectado")

	state.connected = true
})

socket.on(Event.DEPARTMENT_CREATED, (data) => {
	const idCompany = setIdCompany().getIdCompany

	if (data.idCompany == idCompany && data.department) {
		const department_store = departmentStore()

		const isModified = department_store.getModifiedDepartment
		const departments = department_store.getDepartment

		if (!isModified && departments.length > 0) {
			department_store.setDepartments([
				...departments,
				...parseDepartment([data.department]),
			])

			department_store.setTotalPages(setTotalPages(data.totalPages))
		} else {
			department_store.setModifiedDepartment(false)
		}
	}
})

socket.on(Event.UPDATED_DEPARTMENT, (data) => {
	const idCompany = setIdCompany().getIdCompany

	if (data.idCompany == idCompany && data.department) {
		const department_store = departmentStore()

		const isModified = department_store.getModifiedDepartment
		const departments = department_store.getDepartment

		if (!isModified && departments.length > 0) {
			department_store.setDepartments(
				parseUpdateDepartment([data.department], departments)
			)
		} else {
			department_store.setModifiedDepartment(false)
		}
	}
})

socket.on(Event.DELETED_DEPARTMENT, (data) => {
	const idCompany = setIdCompany().getIdCompany

	if (data.idCompany == idCompany && data.department) {
		const department_store = departmentStore()

		const isModified = department_store.getModifiedDepartment
		const departments = department_store.getDepartment

		if (!isModified && departments.length > 0) {
			department_store.setDepartments(
				departments.filter((d) => d.id != data.department._id)
			)
		} else {
			department_store.setModifiedDepartment(false)
		}
	}
})

socket.on("disconnect", () => {
	state.connected = false
})
