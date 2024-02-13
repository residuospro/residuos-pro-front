<template>
	<div
		class="w-[94%] flex flex-wrap glass-effect bg-white rounded-lg min-h-[22rem]">
		<div
			class="w-full rounded-t-lg bg-v_light_green px-2 py-1 flex justify-between items-center h-[2rem]">
			<h1 class="text-white">{{ cardTitle }} atual</h1>

			<div>
				<v-icon icon="mdi-help" class="text-white" size="18" />

				<v-tooltip activator="parent" location="start">
					{{ cardTitle }} é calculado a partir dos valores obtidos do primeiro
					ao último dia do mês atual
				</v-tooltip>
			</div>
		</div>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
defineProps({
	cardTitle: {
		type: String,
		required: true,
	},
})
</script>
