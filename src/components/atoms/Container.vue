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
	type: { type: String, required: true },
})

const containerClass = computed(() => {
	return cva("", {
		variants: {
			intent: {
				page: "w-full ml-8 mt-2",

				loginContainer: "flex justify-between h-screen",

				loadingContainer: `
					w-full
					h-full 
					flex
					justify-center
					items-center 
					z-30
					fixed 
					top-0 
					left-0`,

				backgroundContainer: `
					w-full
					h-full 
					flex
					justify-center
					items-center 
					z-10
					fixed 
					top-0 
					left-0`,

				menuContainer: `
					w-[5.6rem]
					bg-white
					z-10
					flex
					flex-col
					items-center
					justify-between
					text-v_medium_gray
					shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.8)]`,

				painelContainer: `
					grid
					grid-cols-[5%,1fr]
					min-h-screen
					max-h-full
					bg-v_dark_green
					`,

				paginationContainer: `
					flex
					justify-around
					items-center
					text-[#c9c9c9]
					w-[33%]
					
				`,
				itemsPerPageContainer: `
					flex
					justify-evenly
					w-[20%]
					items-center
				`,

				acess: `
					bg-white_two
					flex flex-col
					justify-center
					items-center
					rounded-br-[10rem]`,
			},
		},
	})({
		intent: props.type as any,
	})
})
</script>

<style scoped>
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
