<template>
	<div
		class="text-v_medium_gray absolute top-[8rem] w-full text-center"
		v-if="content == 0">
		<div class="h-24">
			<Vue3Lottie :animationData="emptyBox" />
		</div>

		<p>Ops, no momento não há nada por aqui!</p>
	</div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie"
import emptyBox from "@/assets/emptyBox.json"

defineProps({ content: { type: Number, required: true } })
</script>
