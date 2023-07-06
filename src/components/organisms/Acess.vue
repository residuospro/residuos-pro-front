<template>
	<Container type="loginContainer">
		<Container type="acessContainer">
			<Container type="userInputContainer">
				<div class="text-center">
					<Typograph type="H1" class="!text-v_dark_green"> Entrar </Typograph>

					<Typograph type="H3" class="!text-v_dark_gray2">
						Após o login você terá acesso as funcionalidades
					</Typograph>
				</div>

				<Container type="inputContainer">
					<Input
						placeholder="Username:"
						input="loginInput"
						@keyup="getUsername($event.target.value)" />

					<v-icon
						icon="mdi-account"
						class="absolute top-[-3.2rem] left-[-10rem] text-v_gray3 transform sm:left-[3.5rem]" />

					<Input
						placeholder="Senha:"
						input="loginInput"
						type="password"
						id="pass"
						@keyup="getPassword($event.target.value)" />

					<v-icon
						icon="mdi-lock"
						class="absolute top-[-3.2rem] left-[-10rem] text-v_gray3 sm:left-[3.5rem]" />

					<button
						class="absolute top-[8.3rem] left-[21rem] text-v_gray3 sm:left-[16rem]"
						@click="showPassord">
						<v-icon
							:icon="eyeIcon ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
					</button>

					<p
						class="text-v_red text-center text-[0.75rem] absolute top-[12rem]"
						v-if="validationError">
						{{ errorMessage }}. Tente novamente
					</p>

					<Button
						@click="login"
						buttonType="signIn"
						:disabled="!showButton"
						:class="showButton ? ' bg-v_green' : 'bg-v_medium_gray'">
						Entrar
					</Button>

					<button class="text-v_dark_green font-[700]">
						Esqueceu a senha ?
					</button>
				</Container>
			</Container>
		</Container>

		<Container type="logoContainer">
			<img
				src="@/assets/logo.png"
				:width="400"
				class="-mt-24 ml-[10rem] sm:-ml-20" />

			<div
				class="absolute top-[32.5rem] text-center ml-[10rem] sm:-ml-20 text-white">
				<Typograph type="title" class="">RESÍDUOS PRO</Typograph>

				<Typograph type="Paragraph" class="-mt-3">
					A maneira inteligente de gerenciar coletas
				</Typograph>
			</div>
		</Container>
	</Container>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import Container from "@/components/atoms/Container.vue"
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import Button from "../atoms/Button.vue"
import { PropType } from "vue"

defineProps({
	eyeIcon: { type: Boolean, required: true },

	validationError: { type: Boolean, required: true },

	showButton: { type: Boolean, required: true },

	errorMessage: {
		type: String,
		required: true,
	},

	showPassord: {
		type: Function as unknown as () => (event: MouseEvent) => void,
		required: true,
	},

	getUsername: {
		type: Function as PropType<(username: string) => void>,
		required: true,
	},

	getPassword: {
		type: Function as PropType<(password: string) => void>,
		required: true,
	},

	login: {
		type: Function as unknown as () => (event: MouseEvent) => void,
		required: true,
	},
})
</script>
