<template>
	<Loading v-if="showLoading" />

	<Container type="loginContainer">
		<Container type="acess">
			<Acess
				v-if="!showChangePassword"
				:eye-icon="eyeIcon"
				:validation-error="validationError"
				:error-message="errorMessage"
				:show-button="showButton"
				:showPassord="showPassord"
				:get-username="getUserInfo"
				:get-password="getPassword"
				:changePassword="changePassword"
				:login="login" />
		</Container>

		<Logo />
	</Container>
</template>

<script setup lang="ts">
import Container from "@/components/atoms/Container.vue"
import { signin } from "@/api/signin"
import Acess from "@/components/organisms/Login.vue"
import Loading from "@/components/molecules/Loading.vue"
import Logo from "@/components/molecules/Logo.vue"
import router from "@/router"
import { reactive, ref, watch } from "vue"
import { TypeErrors } from "@/utils/enum"
import { useHead } from "@vueuse/head"
import { IResponseHandler } from "@/utils/interfaces"

useHead({ title: "Resíduos Pro - Login" })

let eyeIcon = ref(false)
let showChangePassword = ref(false)
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

const changePassword = (event: Event) => {
	event.stopPropagation()
	showChangePassword.value = true
}

const showPassord = (event: Event) => {
	event.stopPropagation()

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

	responseHandler(response.status || response.res.status)

	showLoading.value = false
}

const responseHandler = (response: number) => {
	const handleResponse: IResponseHandler = {
		200: () => router.push("/Painel"),
		404: () => handleError(TypeErrors.INCORRECT_PASSWORD),
		403: () => handleError(TypeErrors.USER_NOT_FOUND),
		500: () => handleError(TypeErrors.UNEXPECTED_ERROR),
	}

	const handler = handleResponse[response as keyof IResponseHandler]

	handler()
}

const handleError = (errorType: string) => {
	validationError.value = true
	showButton.value = false
	errorMessage.value = errorType
}
</script>
