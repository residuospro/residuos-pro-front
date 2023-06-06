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

				acessContainer: `bg-white_two 
					flex flex-col
					justify-center 
					items-center
					rounded-br-[10rem]`,

				logoContainer: `bg-gradient-to-r 
					 from-v_green
					 to-v_dark_green 
					 flex flex-col
					 justify-center 
					 items-center
					 w-[65%] 
					 rounded-bl-[50rem] 
					 pl-20 `,

				userInputContainer: `w-[40%] 
					h-[35rem]
					left-32
					absolute
					bg-v_gray
					rounded-lg 
					ml-10 flex 
					flex-col 
					justify-evenly 
					border border-white 
					border-opacity-50
					items-center 
					glass-effect sm:z-10 userInput`,

				inputContainer: `flex 
					flex-col 
					justify-evenly 
					items-center 
					h-[25rem] 
					mt-[-2rem] relative`,

				loadingContainer: `w-full 
					h-full flex 
					justify-center 
					items-center z-10 
					fixed top-0 left-0`,

				modalLoading: `w-full 
					h-full 
					absolute 
					top-[50%] 
					left-[50%] 
					flex flex-col 
					justify-center 
					loading`,

				menuContainer: `w-[5.6rem]
				h-screen bg-v_white_two
				z-10
				flex flex-col
				items-center justify-between
				text-v_medium_gray
				shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.8)]`,

				menuIconContainer: `h-auto
				flex flex-col
				items-center justify-between py-5`,

				painelContainer: `
				grid grid-cols-[5%,1fr]
				bg-v_dark_green
				
				`,
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

.loading {
	transform: translate(-50%, -50%);
	background: rgba(0, 0, 0, 0.5);
}

@media (max-width: 1023px) {
	.userInput {
		width: calc(100% - 8rem);
		left: 1rem;
	}
	.glass-effect {
		backdrop-filter: blur(3px);
	}
}
</style>
