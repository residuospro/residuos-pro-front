<template>
	<input
		:class="inputClass"
		:disabled="isDisabled"
		@input="handleInput($event)"
		style="color: #9d9797 !important" />
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { cva } from "class-variance-authority"
import { computed } from "vue"

const emit = defineEmits(["input"])

const props = defineProps({
	input: { type: String, required: true },
	isDisabled: { type: Boolean, required: false },
})

const inputClass = computed(() => {
	return cva(
		`text-[1rem]
		!text-v_medium_gray
		 font-[700]
		 rounded-md
		 shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.4)]
		 outline-[#e1e4ed]
		 bg-gray-100
		 input`,

		{
			variants: {
				intent: {
					loginInput: `w-[24rem] h-[3.75rem] px-14 inputLogin`,
					input: `w-[18rem] h-[3rem] px-4 inputLogin`,
					inputFilter: "w-full h-[3rem] shadow-none px-4 !font-extralight",
				},
			},
		}
	)({
		intent: props.input as any,
	})
})

const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const value = target.value
	emit("input", value)
}
</script>

<style>
.input::placeholder,
.input::-webkit-input-placeholder {
	color: #9d9797;
}

.input:-ms-input-placeholder {
	color: #9d9797;
}

.input {
	color: #9d9797 !important;
}

.input::-webkit-outer-spin-button,
.input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.input:focus {
	background: #fff;
	outline: 2px solid #36802d;
}

input {
	-moz-appearance: textfield;
}

@media (max-width: 767px) {
	.inputLogin {
		width: calc(100% - 5rem) !important;
	}
}
</style>
