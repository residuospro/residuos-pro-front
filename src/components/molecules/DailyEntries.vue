<template>
	<div class="glass-effect rounded-lg mb-5">
		<div
			class="w-full rounded-t-lg bg-v_light_green px-2 py-1 flex justify-between items-center">
			<h1 class="text-white">Entradas diárias</h1>
		</div>

		<div class="w-full py-4 space-y-2">
			<div
				v-for="(items, index) in dailySediment"
				:key="index"
				class="w-full shadow-[0_0.3rem_0.62rem_rgba(0,0,0,0.4)] card px-4 py-2 rounded-lg">
				<div class="font-extrabold flex justify-between">
					<h1 :style="setTextColor(items.name)">{{ items.name }}</h1>
					<div class="flex">
						<p class="text-v_medium_gray">+{{ items.lastEntry }}</p>
						<v-icon icon="mdi-arrow-up-bold-box" class="text-v_light_green" />
					</div>
				</div>

				<div class="flex justify-between">
					<h1 class="text-v_medium_gray">Total de entrada diária:</h1>
					<p class="font-extrabold" :style="setTextColor(items.name)">
						{{ items.total }}{{ items.measure }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { DayStateTotal } from "@/utils/interfaces"
import { PropType } from "vue"

defineProps({
	dailySediment: {
		type: Array as PropType<DayStateTotal[]>,
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
