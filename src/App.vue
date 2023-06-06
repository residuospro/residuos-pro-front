<template>
	<main class="">
		<router-view
			:key="$router.currentRoute.value.path.split('/')[0]"></router-view>
	</main>
</template>
<script setup lang="ts">
import { useHead } from "@unhead/vue"

useHead({ title: "dfewfw" })
</script>
