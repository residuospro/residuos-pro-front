import { io } from "socket.io-client"
import { isAuthenticated } from "../utils/permissions"
import { departmentEvents } from "./departmentEvents"
import { sedimentEvent } from "./sedimentEvents"
import { userEvent } from "./userEvent"

const accessToken = isAuthenticated()

export const socket = io(process.env.VUE_APP_BACK, {
	withCredentials: true,
	extraHeaders: {
		Authorization: `Bearer ${accessToken}`,
	},
})

departmentEvents(socket)

sedimentEvent(socket)

userEvent(socket)

socket.on("connect", () => {
	console.log("socket conectado")
})
