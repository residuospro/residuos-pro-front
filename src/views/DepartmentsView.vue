<template>
	<div class="w-full ml-8 mt-2">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { useHead } from "@vueuse/head"

useHead({
	title: "Resíduos Pro - Departamentos",
})
</script>
