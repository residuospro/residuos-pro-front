<template>
	<div
		class="w-full mt-4 ml-10"
		v-if="totalPages.length > 1 || itemsPerPage > 10">
		<slot></slot>
	</div>
</template>
<script setup lang="ts">
import { PropType } from "vue"

defineProps({
	totalPages: {
		type: Array as PropType<number[]>,
		required: true,
	},

	itemsPerPage: {
		type: Number,
		required: true,
	},
})
</script>
