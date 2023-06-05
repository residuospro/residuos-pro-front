import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import mdiVue from "mdi-vue/v3"
import * as mdijs from "@mdi/js"
import "./index.css"
import { setupClient } from "./clients/AxiosClient"

setupClient(process.env.VUE_APP_BACK)

const pinia = createPinia()

createApp(App)
	.use(router)
	.use(pinia)
	.use(mdiVue, { icons: mdijs })
	.mount("#app")
