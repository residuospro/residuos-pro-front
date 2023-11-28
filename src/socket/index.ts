import { io } from "socket.io-client"
import { isAuthenticated } from "../utils/permissions"
import { departmentEvents } from "./departmentEvents"
import { sedimentEvent } from "./sedimentEvents"

const accessToken = isAuthenticated()

export const socket = io(process.env.VUE_APP_BACK)

departmentEvents(socket)

sedimentEvent(socket)

socket.on("connect", () => {
	console.log("socket conectado")
})
