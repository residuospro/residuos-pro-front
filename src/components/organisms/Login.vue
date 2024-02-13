<template>
	<Wrapper type="userInput">
		<div class="text-center">
			<Typograph type="H1" class="!text-v_dark_green"> Entrar </Typograph>

			<Typograph type="H3" class="!text-v_dark_gray2">
				Após o login você terá acesso as funcionalidades
			</Typograph>
		</div>

		<form @submit.prevent="login">
			<Wrapper type="input">
				<Input
					type="text"
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

				<p
					class="text-v_red text-center text-[0.75rem] absolute top-[12rem]"
					v-if="validationError">
					{{ errorMessage }}. Tente novamente
				</p>

				<Button
					type="submit"
					buttonType="signIn"
					:disabled="!showButton"
					:class="showButton ? ' bg-v_green' : 'bg-v_medium_gray'">
					Entrar
				</Button>

				<button
					class="text-v_dark_green font-[700]"
					@click.prevent="changePassword">
					Esqueceu a senha ?
				</button>
			</Wrapper>
		</form>

		<button
			style="position: absolute; top: 19.2rem; left: 24rem"
			class="text-v_gray3 sm:left-[16rem]"
			@click="showPassord">
			<v-icon :icon="eyeIcon ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" />
		</button>
	</Wrapper>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import Wrapper from "../atoms/Wrapper.vue"
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

	changePassword: {
		type: Function as PropType<(event: MouseEvent) => void>,
		required: true,
	},

	showPassord: {
		type: Function as PropType<(event: MouseEvent) => void>,
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
		type: Function as PropType<() => void>,
		required: true,
	},
})
</script>
