import { reactive, watch } from "vue"
import { io } from "socket.io-client"
import { isAuthenticated } from "./utils/permissions"
import { setIdCompany } from "@/store/setIdCompany"

const accessToken = isAuthenticated()

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
	const idCompany = setIdCompany().getIdCompany

	console.log("Evento 'department' recebido:", data)

	if (data.idCompany == idCompany) {
		console.log("iguais")
	}
})

socket.on("disconnect", () => {
	state.connected = false
})
