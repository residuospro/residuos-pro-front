<template>
	<Container type="loginContainer">
		<Container type="acessContainer">
			<Container type="userInputContainer">
				<div class="text-center">
					<Typograph type="H1" class="!text-v_dark_green"> Entrar </Typograph>

					<Typograph type="H2" class="!text-v_dark_gray2">
						Após o login você terá acesso as funcionalidades
					</Typograph>
				</div>

				<Container type="inputContainer">
					<Input
						placeholder="Username:"
						input="loginInput"
						@keyup="getUsername($event.target.value)" />

					<mdicon
						name="account"
						class="absolute top-[3.4rem] left-[1rem] text-v_gray3 transform sm:left-[3.5rem]" />

					<Input
						placeholder="Senha:"
						input="loginInput"
						type="password"
						id="pass"
						@keyup="getPassword($event.target.value)" />

					<mdicon
						name="lock"
						class="absolute top-[9.7rem] left-[1rem] text-v_gray3 sm:left-[3.5rem]" />

					<button
						class="absolute top-[9.7rem] left-[21rem] text-v_gray3 sm:left-[16rem]"
						@click="showPassord">
						<mdicon :name="eyeIcon ? 'eye-outline' : 'eye-off-outline'" />
					</button>

					<p
						class="text-v_red text-center text-[0.75rem] absolute top-[13rem]"
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

			<div class="absolute top-[32.5rem] text-center ml-[10rem] sm:-ml-20">
				<Typograph type="title">RESÍDUOS PRO</Typograph>

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
	showPassord: {
		type: Function as unknown as () => (event: MouseEvent) => void,
		required: true,
	},
	validationError: { type: Boolean, required: true },
	showButton: { type: Boolean, required: true },
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
	errorMessage: {
		type: String,
		required: true,
	},
})
</script>
