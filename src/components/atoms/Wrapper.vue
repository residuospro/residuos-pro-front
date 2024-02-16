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

				userInput: `
					w-[35%]
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
					min-h-[13rem] 
					w-[40rem] 
					text-black 
					rounded-md
				`,

				dataTable: `
					min-h-[30rem]
					w-full
					backgroundTable
					rounded-lg
					relative
				`,

				chart: `
					w-[94%] 
					grid
					grid-cols-[1fr_30%]
					grid-rows-[100%]
					gap-2
					h-[18rem]
					mb-5
				`,

				header: `
					flex 
					items-center 
					w-full 
					justify-between 
					mb-8
				`,
			},
		},
	})({
		intent: props.type as any,
	})
})
</script>

<style scoped>
@keyframes fadeInAnimation {
	0% {
		opacity: 0.3;
	}
	100% {
		opacity: 1;
	}
}

.modalContainer {
	transform: translate(-50%, -50%);
	background: rgba(0, 0, 0, 0.5);
	animation: fadeInAnimation ease 0.3s;
	animation-iteration-count: 1;
	animation-fill-mode: forwards;
}

.backgroundTable {
	background: #fff;
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
	border: 1px solid rgba(255, 255, 255, 0.18);
}

.glass-effect {
	background: #fff;
	box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(13.5px);
	border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>
