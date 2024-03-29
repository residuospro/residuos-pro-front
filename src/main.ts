import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import "./index.css"
import { setupClient } from "./clients/AxiosClient"
import { createHead } from "@vueuse/head"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import { socket } from "./socket"
import Notifications from "@kyvg/vue3-notification"
import Vue3Lottie from "vue3-lottie"

socket.connect()

setupClient(process.env.VUE_APP_BACK, process.env.VUE_APP_AUTH)

const vuetify = createVuetify({
	components,
	directives,
})

const head = createHead()

const pinia = createPinia()

const app = createApp(App)

app
	.use(router)
	.use(pinia)
	.use(head)
	.use(vuetify)
	.use(Notifications)
	.use(Vue3Lottie)
	.mount("#app")
