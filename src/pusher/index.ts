import Pusher from "pusher-js"
import { Event } from "../utils/enum"
import { departmentEvents } from "./departmentEvents"

export const pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
	cluster: process.env.VUE_APP_PUSHER_CLUSTER,
})

const channel = pusher.subscribe(Event.CHANNEL)

departmentEvents(channel)

channel.bind("connected", (data: any) => {
	console.log("conectado", data)
})
