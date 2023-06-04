<template>
	<button :class="buttonClass">
		<slot></slot>
	</button>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { cva } from "class-variance-authority"
import { computed } from "vue"

const props = defineProps({
	button: { type: String, required: true },
})

const buttonClass = computed(() => {
	return cva(
		`shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.4)]
		rounded-md h-[3.75rem]
		flex justify-center
		items-center`,
		{
			variants: {
				intent: {
					signIn: `w-[24rem] text-white`,
				},
			},
		}
	)({
		intent: props.button as any,
	})
})
</script>

#f0f7da #c9df8a #77ab59 #36802d #234d20
