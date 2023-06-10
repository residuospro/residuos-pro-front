<template>
	<Loading v-if="showLoading" />
	<Acess
		:eye-icon="eyeIcon"
		:showPassord="showPassord"
		:validation-error="validationError"
		:show-button="showButton"
		:get-username="getUserInfo"
		:get-password="getPassword"
		:error-message="errorMessage"
		:login="login" />
</template>

<script setup lang="ts">
import { signin } from "@/api/signin"
import Acess from "@/components/organisms/Acess.vue"
import Loading from "@/components/molecules/Loading.vue"
import router from "@/router"
import { reactive, ref, watch } from "vue"
import { TypeErrors } from "@/utils/enum"
import { setCompany } from "@/store/setCompany"

const store = setCompany()

let eyeIcon = ref(false)
let validationError = ref(false)
let showButton = ref(false)
let showLoading = ref(false)
let errorMessage = ref("")
let user = reactive({
	username: "",
	password: "",
})

const getUserInfo = (username: string) => {
	user.username = username
}
const getPassword = (password: string) => {
	user.password = password
}
watch(user, () => {
	if (user.username != "" && user.password != "") {
		showButton.value = true
		validationError.value = false
	} else {
		showButton.value = false
	}
})

const showPassord = () => {
	eyeIcon.value = !eyeIcon.value

	let input = document.querySelector("#pass")
	if (input?.getAttribute("type") == "password") {
		input.setAttribute("type", "text")
	} else {
		input?.setAttribute("type", "password")
	}
}

const login = async () => {
	showLoading.value = true
	const response: any = await signin(user)

	console.log("res", response)

	if (response.res?.status == 200) {
		router.push("/Painel")

		store.setCompany(response.company)
	} else if (response.response.data.error == TypeErrors.INCORRECT_PASSWORD) {
		validationError.value = true

		showButton.value = false

		errorMessage.value = TypeErrors.INCORRECT_PASSWORD
	} else if (response.response.data.error == TypeErrors.USER_NOT_FOUND) {
		validationError.value = true

		showButton.value = false

		errorMessage.value = TypeErrors.USER_NOT_FOUND
	} else if (response.response.status == 500) {
		validationError.value = true

		showButton.value = false

		errorMessage.value = TypeErrors.UNEXPECTED_ERROR
	}
	showLoading.value = false
}
</script>
