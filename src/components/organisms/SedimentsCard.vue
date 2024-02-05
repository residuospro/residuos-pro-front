<template>
	<div
		v-for="(items, index) in sedimentsInfo"
		:key="index"
		class="min-w-[17rem] h-[10rem] shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.4)] rounded-lg card px-2 py-2 mx-2 my-2">
		<div class="flex items-center justify-between px-5">
			<div
				:style="setBackgroundColor(items.state)"
				class="rounded-lg flex flex-col items-center justify-center">
				<Vue3Lottie
					:animationData="validadeState(items.state)"
					:height="100"
					:width="100" />

				<p class="mb-2 font-extrabold" :style="setTextColor(items.state)">
					{{ items.state }}
				</p>
			</div>

			<div class="px-2">
				<h1 class="font-extrabold">{{ items.sedimentName }}</h1>
				<h1
					class="font-extrabold text-[2rem] text-v_medium_gray text-center underline underline-offset-[14px] decoration-2">
					{{ items.total }}{{ items.measure }}
				</h1>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie"
import { PropType } from "vue"
import { ISedimentsInfo } from "@/utils/interfaces"

defineProps({
	sedimentsInfo: {
		type: Array as PropType<ISedimentsInfo[]>,
		required: true,
	},

	validadeState: {
		type: Function as PropType<(state?: string) => string>,
		required: true,
	},

	setBackgroundColor: {
		type: Function as PropType<(state?: string) => any>,
		required: true,
	},

	setTextColor: {
		type: Function as PropType<(state?: string) => any>,
		required: true,
	},
})
</script>

<style scoped>
.card {
	transform: scale(0.9);
}
</style>
