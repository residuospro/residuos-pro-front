import { io } from "socket.io-client"
import { isAuthenticated } from "../utils/permissions"
import { departmentEvents } from "./departmentEvents"
import { sedimentEvent } from "./sedimentEvents"

const accessToken = isAuthenticated()

export const socket = io("https://residuos-pro-backend.onrender.com/", {
	withCredentials: true,
	extraHeaders: {
		Authorization: `Bearer ${accessToken}`,
	},
})

departmentEvents(socket)

sedimentEvent(socket)

socket.on("connect", () => {
	console.log("socket conectado")
})
