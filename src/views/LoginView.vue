<template>
	<div class="flex justify-between h-screen">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import Container from "@/components/atoms/Container.vue"
import { useHead } from "@vueuse/head"

useHead({ title: "Resíduos Pro - Login" })
</script>
