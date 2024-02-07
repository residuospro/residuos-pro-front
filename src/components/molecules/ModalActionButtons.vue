<template>
	<div class="flex justify-end w-full space-x-5 mt-5">
		<Button
			type="submit"
			buttonType="confirmButton"
			:class="showButton ? ' bg-v_green' : 'bg-v_dark_gray'"
			:disabled="!showButton">
			<p class="text-white">Criar</p>
		</Button>

		<Button buttonType="closeButton" @click="closeModal"> Cancelar </Button>
	</div>
</template>
<script setup lang="ts">
import { PropType } from "vue"
import Button from "../atoms/Button.vue"

defineProps({
	showButton: {
		type: Boolean,
		required: true,
	},

	closeModal: {
		type: Function as PropType<(event: Event) => void>,
		required: true,
	},
})
</script>
