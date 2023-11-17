import { reactive } from "vue"
import { io } from "socket.io-client"
import { isAuthenticated } from "./utils/permissions"
import { setIdCompany } from "@/store/setIdCompany"
import { departmentStore } from "./store/departmentStore"
import useProps from "@/context/useProps"

const accessToken = isAuthenticated()

const { parseDepartment, setTotalPages } = useProps()

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

socket.on("department", (data) => {
	const department_store = departmentStore()

	const idCompany = setIdCompany().getIdCompany
	const isModified = department_store.getModifiedDepartment

	if (data.idCompany == idCompany && !isModified) {
		console.log("iguais")

		department_store.setDepartments(parseDepartment(data.department))
		department_store.setTotalPages(setTotalPages(data.totalPages))
	} else {
		department_store.setModifiedDepartment(false)
		console.log("aqui")
	}
})

socket.on("disconnect", () => {
	state.connected = false
})
