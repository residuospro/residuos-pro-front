<template>
	<h1 :class="typographClass">
		<slot></slot>
	</h1>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */

import { cva } from "class-variance-authority"
import { computed } from "vue"

const props = defineProps({
	type: { type: String, required: true },
})

const typographClass = computed(() => {
	return cva("font-[700]", {
		variants: {
			intent: {
				title: "text-[3rem]",
				H1: "text-[2.5rem]",
				H2: "text-[1.9rem]",
				H3: "text-[1rem]",
				Paragraph: "text-[0.8rem]",
			},
		},
	})({
		intent: props.type as any,
	})
})
</script>
