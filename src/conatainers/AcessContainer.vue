<template>
	<Loading v-if="showLoading" />
	<Acess
		:eye-icon="eyeIcon"
		:showPassord="showPassord"
		:validation-error="validationError"
		:show-button="showButton"
		:get-username="getUserInfo"
		:get-password="getPassword"
		:login="login" />
</template>

<script setup lang="ts">
import { signIn } from "@/api/signIn"
import Acess from "@/components/organisms/Acess.vue"
import Loading from "@/components/molecules/Loading.vue"
import router from "@/router"
import { reactive, ref, watch } from "vue"

let eyeIcon = ref(false)
let validationError = ref(false)
let showButton = ref(false)
let showLoading = ref(false)
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
	const res: any = await signIn(user)

	if (res?.status == 200) {
		//router.push("/Home")
		alert("Logado")
	} else {
		validationError.value = true
		showButton.value = false
	}
	//showLoading.value = false
}
</script>
