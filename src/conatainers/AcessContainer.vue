<template>
	<Acess
		:eye-icon="eyeIcon"
		:showPassord="showPassord"
		:validation-error="validationError"
		:show-button="showButton" />
</template>

<script setup lang="ts">
import Acess from "@/components/organisms/Acess.vue"
import { ref } from "vue"

let eyeIcon = ref(false)
let validationError = ref(false)
let showButton = ref(true)
// let username = ref("")
// let password = ref("")

const showPassord = () => {
	eyeIcon.value = !eyeIcon.value

	let input = document.querySelector("#pass")
	if (input?.getAttribute("type") == "password") {
		input.setAttribute("type", "text")
	} else {
		input?.setAttribute("type", "password")
	}
}
</script>
