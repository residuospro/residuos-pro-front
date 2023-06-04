<template>
	<div :class="containerClass">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */

import { cva } from "class-variance-authority"
import { computed } from "vue"

let props = defineProps({
	container: { type: String, required: true },
})

const containerClass = computed(() => {
	return cva("", {
		variants: {
			intent: {
				loginContainer: "flex justify-between h-screen",

				acessContainer: `bg-white_two flex flex-col
					justify-center items-center
					rounded-br-[10rem]`,

				logoContainer: `bg-gradient-to-r from-v_green
					 to-v_dark_green flex flex-col
					 justify-center items-center
					 w-[65%] rounded-bl-[50rem] pl-20`,

				userInputContainer: `w-[40%] h-[35rem]
					left-32
					absolute
					bg-v_gray
					rounded-lg ml-10 flex 
					flex-col justify-evenly 
					border border-white border-opacity-50
					items-center glass-effect`,

				inputContainer:
					"flex flex-col justify-evenly items-center h-[25rem] mt-[-2rem]",
			},
		},
	})({
		intent: props.container as any,
	})
})
</script>

<style scoped>
.glass-effect {
	box-shadow: 0 0.5rem 2rem 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(1px);
	-webkit-backdrop-filter: blur(0.9rem);
}
</style>
