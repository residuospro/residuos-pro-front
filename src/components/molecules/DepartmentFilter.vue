<template>
	<div class="min-w-[23rem]">
		<v-autocomplete
			clearable
			:active="true"
			:on-click:clear="clearFilter"
			:style="handleAutoCompleteStyle(departmentSelected)"
			:onUpdate:modelValue="filterDepartment"
			v-model="departmentSelected"
			:items="departments"
			chips
			label="Buscar Departamento"></v-autocomplete>
	</div>
</template>

<script setup lang="ts">
import { PropType, ref } from "vue"
import useProps from "../../context/useProps"

const { handleAutoCompleteStyle } = useProps()

let departmentSelected = ref(null)

const props = defineProps({
	departmentFilterCleaning: {
		type: Function as PropType<() => void>,
		required: true,
	},

	departments: { type: Array as PropType<string[]>, required: true },

	filterDepartment: {
		type: Function as PropType<(department: string) => void>,
		required: true,
	},
})

const clearFilter = () => {
	props.departmentFilterCleaning()
	departmentSelected.value = null
}
</script>
