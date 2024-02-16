<template>
	<Wrapper type="userInput">
		<div class="h-[19rem] flex flex-col items-center justify-between">
			<div class="text-center">
				<Typograph type="H1" class="!text-v_dark_green"> Nova senha </Typograph>

				<Typograph type="H3" class="!text-v_dark_gray2">
					Você receberá um email para criar uma nova senha
				</Typograph>
			</div>

			<form @submit.prevent="sendEmailToChangePassword(userInfo)">
				<Wrapper type="input" class="h-[13rem]">
					<Input
						type="text"
						placeholder="Email/Username:"
						input="loginInput"
						@keyup="(event: KeyboardEvent) => userInfo = (event.target as HTMLInputElement).value" />

					<v-icon
						icon="mdi-account"
						class="absolute top-[-3.1rem] left-[-10rem] text-v_gray3 transform sm:left-[3.5rem]" />

					<p
						class="text-v_green text-center text-[0.75rem] absolute top-[5rem]"
						v-if="showSucessMessage">
						{{ message }}!
					</p>

					<p
						class="text-v_red text-center text-[0.75rem] absolute top-[5rem]"
						v-if="showErrorMessage">
						{{ message }}. Tente novamente
					</p>

					<Button
						type="submit"
						buttonType="signIn"
						:disabled="userInfo == ''"
						:class="userInfo != '' ? ' bg-v_green' : 'bg-v_medium_gray'">
						Enviar
					</Button>

					<button
						class="text-v_dark_green font-[700] mt-2"
						@click.prevent="returnToLogin">
						Voltar
					</button>
				</Wrapper>
			</form>
		</div>
	</Wrapper>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import Wrapper from "../atoms/Wrapper.vue"
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import Button from "../atoms/Button.vue"
import { PropType, ref } from "vue"

let userInfo = ref("")

defineProps({
	returnToLogin: {
		type: Function as PropType<(event: Event) => void>,
		required: true,
	},

	showSucessMessage: { type: Boolean, required: true },

	showErrorMessage: { type: Boolean, required: true },

	message: {
		type: String,
		required: true,
	},

	sendEmailToChangePassword: {
		type: Function as PropType<(userInfo: string) => void>,
		required: true,
	},

	validateEmail: {
		type: Function as PropType<(email: string) => boolean>,
		required: true,
	},
})
</script>

<style scoped>
.modalContainer {
	transform: translate(-50%, -50%);
	background: rgba(0, 0, 0, 0.5);
	animation: fadeInAnimation ease 0.3s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
}
</style>
