<template>
	<div :class="wrapperClass">
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
/* eslint-disable no-undef */

import { cva } from "class-variance-authority"
import { computed } from "vue"

let props = defineProps({
	type: { type: String, required: true },
})

const wrapperClass = computed(() => {
	return cva("", {
		variants: {
			intent: {
				modal: `
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

				deleteModal: `
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

				menuIcon: `
					h-auto
					flex
					flex-col
					items-center
					justify-between
					py-5`,

				notification: `
					bg-white
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

				acess: `
					bg-white_two
					flex flex-col
					justify-center
					items-center
					rounded-br-[10rem]`,

				userInput: `
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

				input: `
					flex
					flex-col
					justify-evenly
					items-center
					h-[20rem]
					mt-[-2rem] 
					relative`,

				logo: `
					 bg-gradient-to-r
					 from-v_green
					 to-v_dark_green
					 flex flex-col
					 justify-center
					 items-center
					 w-[65%]
					 rounded-bl-[50rem]
					 pl-20 `,

				actionsModal: `
					bg-white 
					flex 
					flex-col 
					py-5
					px-5
					min-h-[20rem] 
					w-[40rem] 
					text-black 
					rounded-md
				`,

				dataTable: `
					min-h-[30rem]
					glass-effect
					rounded-lg
				`,
			},
		},
	})({
		intent: props.type as any,
	})
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
