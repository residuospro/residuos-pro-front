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
	buttonType: { type: String, required: true },
})

const buttonClass = computed(() => {
	return cva(
		`shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.4)]
		rounded-md 
		h-[3.75rem]
		flex 
		justify-center
		items-center 
		font-[700]`,
		{
			variants: {
				intent: {
					signIn: `w-[24rem] text-white signinBtn`,
					submit: `w-[12rem] h-[3rem]`,
					paginationButton: `w-[2rem] !h-7 rounded-md`,
					closeButton: `!h-10 bg-white border-2 border-v_medium_gray px-3`,
					confirmButton: `!h-10 px-3`,
				},
			},
		}
	)({
		intent: props.buttonType as any,
	})
})
</script>

<style scoped>
@media (max-width: 767px) {
	.signinBtn {
		width: calc(100% - 5rem);
	}
}
</style>
#f0f7da #c9df8a #77ab59 #36802d #234d20
