import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import mdiVue from "mdi-vue/v3"
import * as mdijs from "@mdi/js"
import "./index.css"
import { setupClient } from "./clients/AxiosClient"
import { createHead } from "@vueuse/head"
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

setupClient(process.env.VUE_APP_BACK)

const vuetify = createVuetify({
	components,
	directives,
})

const head = createHead()

const pinia = createPinia()

createApp(App)
	.use(router)
	.use(pinia)
	.use(head)
	.use(vuetify)
	.use(mdiVue, { icons: mdijs })
	.mount("#app")
