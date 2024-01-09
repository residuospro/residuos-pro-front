<template>
	<textarea
		:class="textClass"
		@input="handleText($event)"
		style="color: #9d9797 !important" />
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { cva } from "class-variance-authority"
import { computed } from "vue"

const emit = defineEmits(["text"])

const props = defineProps({
	text: { type: String, required: true },
})

const textClass = computed(() => {
	return cva(
		`text-[1rem]
		 font-[700]
		 rounded-md
		 shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.4)]
		 outline-[#e1e4ed]
		 bg-gray-100
		 input`,
		{
			variants: {
				intent: {
					textArea: `w-full h-[5rem] px-4 py-4`,
				},
			},
		}
	)({ intent: props.text as any })
})

const handleText = (event: Event) => {
	const target = event.target as HTMLInputElement
	const value = target.value

	emit("text", value)
}
</script>
