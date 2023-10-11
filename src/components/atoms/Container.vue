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
				loginContainer: "flex justify-between h-screen",

				acessContainer: `
					bg-white_two
					flex flex-col
					justify-center
					items-center
					rounded-br-[10rem]`,

				logoContainer: `
					 bg-gradient-to-r
					 from-v_green
					 to-v_dark_green
					 flex flex-col
					 justify-center
					 items-center
					 w-[65%]
					 rounded-bl-[50rem]
					 pl-20 `,

				userInputContainer: `
					w-[40%]
					h-[35rem]
					left-32
					absolute
					rounded-lg
					ml-10 flex
					flex-col
					justify-evenly
					items-center
					glass-effect
					sm:z-10
					userInput`,

				inputContainer: `
					flex
					flex-col
					justify-evenly
					items-center
					h-[20rem]
					mt-[-2rem] 
					relative`,

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

				modalContainer: `
					w-full
					h-full
					absolute
					top-[50%]
					left-[50%]
					flex 
					flex-col
					items-center 
					justify-center
					modalContainer`,

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

				menuIconContainer: `
					h-auto
					flex
					flex-col
					items-center
					justify-between
					py-5`,

				painelContainer: `
					grid
					grid-cols-[5%,1fr]
					min-h-screen
					max-h-full
					bg-v_dark_green
					`,

				dataTableContainer: `
					w-full
					min-h-[30rem]
					pt-12
					mb-5
					v_medium_gray
					glass-effect
					rounded-lg
				`,

				headersContainer: `
					flex
					bg-v_light_green
					h-12
					px-8
					w-full
					items-center
					justify-between
					rounded-tl-lg
					rounded-tr-lg
					fixed
					z-10
					top-0
				`,

				departmentContent: `
					items-center
					justify-between
					flex
					h-12 
					px-6
					w-full
					
					font-[700]
					text-black
					text-left
					bg-[#ccc]
				`,

				userContent: `
					grid
					grid-cols-[17%_20%_17%_23%_19%_5%]
					h-12 
					px-8
					w-full
					items-center
					font-[700]
					text-black
				`,

				paginationContainer: `
					flex
					justify-around
					items-center
					text-[#c9c9c9]
					w-[33%]
					ml-10
				`,
				itemsPerPageContainer: `
					flex
					justify-evenly
					w-[20%]
					items-center
				`,
				deleteModalContainer: `
					bg-white
					flex 
					flex-col 
					justify-center 
					items-center 
					h-[10rem] 
					min-w-[30rem] 
					text-black 
					rounded-md
					px-8
				`,

				actionsModalContainer: `
					bg-white 
					flex 
					flex-col 
					py-5
					px-5
					min-h-[17rem] 
					w-[40rem] 
					text-black 
					rounded-md
				`,

				notificationContainer: `
					bg-v_white_two 
					flex 
					flex-col 
					justify-center
					items-center
					py-5
					px-8
					h-[17rem] 
				
					text-black 
					rounded-md
			
				`,
			},
		},
	})({
		intent: props.type as any,
	})
})
</script>

<style scoped>
.glass-effect {
	background: rgba(255, 255, 255, 0.1);
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(13.5px);
	border: 1px solid rgba(255, 255, 255, 0.18);
}
.modalContainer {
	transform: translate(-50%, -50%);
	background: rgba(0, 0, 0, 0.5);
	animation: fadeInAnimation ease 0.3s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
}

@keyframes fadeInAnimation {
	0% {
		opacity: 0.3;
	}
	100% {
		opacity: 1;
	}
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
