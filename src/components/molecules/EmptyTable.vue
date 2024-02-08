<template>
	<p
		class="text-v_medium_gray absolute top-[12rem] w-full text-center"
		v-if="content == 0">
		Ops, no momento não há nada por aqui!
	</p>
</template>

<script setup lang="ts">
defineProps({ content: { type: Number, required: true } })
</script>
