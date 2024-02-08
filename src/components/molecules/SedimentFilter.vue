<template>
	<div class="min-w-[23rem]">
		<v-autocomplete
			clearable
			:style="handleAutoCompleteStyle(sedimentSelected)"
			:on-click:clear="clearFilter"
			:onUpdate:modelValue="selectSediments"
			:active="true"
			v-model="sedimentSelected"
			:items="sedimentsName"
			chips
			label="Buscar Resíduos"></v-autocomplete>
	</div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue"
import userProps from "@/context/useProps"

const { handleAutoCompleteStyle } = userProps()

const props = defineProps({
	sedimentsFilterCleaning: {
		type: Function as unknown as () => () => void,
		required: true,
	},

	sedimentsName: {
		type: Array as PropType<Array<string | undefined>>,
		required: true,
	},

	selectSediments: {
		type: Function as PropType<(sediment: string) => void>,
		required: true,
	},
})

let sedimentSelected = ref(null)

const clearFilter = () => {
	props.sedimentsFilterCleaning()
	sedimentSelected.value = null
}
</script>
