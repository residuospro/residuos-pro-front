<template>
	<div class="w-[94%] flex flex-wrap glass-effect rounded-lg">
		<div
			class="w-full rounded-t-lg bg-v_light_green px-2 py-1 flex justify-between items-center">
			<h1 class="text-white">Estoque atual</h1>

			<div>
				<v-icon icon="mdi-help" class="text-white" size="18" />

				<v-tooltip activator="parent" location="start">
					O estoque é calculado a partir dos valores obtidos do primeiro ao
					último dia do mês atual
				</v-tooltip>
			</div>
		</div>
		<slot></slot>

		<p
			class="text-v_medium_gray absolute top-[12rem] w-full text-center"
			v-if="sedimentsInfo.length == 0">
			Ops! Não há registros por aqui.
		</p>
	</div>
</template>

<script setup lang="ts">
import { ISedimentsInfo } from "@/utils/interfaces"
import { PropType } from "vue"

defineProps({
	sedimentsInfo: {
		type: Array as PropType<ISedimentsInfo[]>,
		required: true,
	},
})
</script>
