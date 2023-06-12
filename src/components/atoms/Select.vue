<!-- Select.vue -->
<template>
	<select :class="selectClass" :value="internalValue" @change="handleChange">
		<slot></slot>
	</select>
</template>

<script setup lang="ts">
import { cva } from "class-variance-authority"
import { computed } from "vue"

const props = defineProps({
	type: { type: String, required: true },
	modelValue: { required: true },
})

const selectClass = computed(() => {
	return cva("", {
		variants: {
			intent: {
				itemsPerPage: `
					w-[4rem]
					h-[2rem]
					bg-white
					rounded-md 
					font-[700]
					text-center
					shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.4)]
		  `,
			},
		},
	})({
		intent: props.type as any,
	})
})

const emit = defineEmits(["update:modelValue"])

const internalValue = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
})

const handleChange = (event: any) => {
	internalValue.value = event.target.value
}
</script>
