<template>
	<form @submit.prevent="createOrUpdateDepartment(department, typeAction)">
		<Typograph type="H2" class="text-v_medium_gray">
			{{ typeAction }} departamento
		</Typograph>

		<div class="flex flex-wrap w-full justify-between h-20 mt-2">
			<Input
				input="input"
				placeholder="Departamento:"
				:class="department.name !== '' ? 'bg-white' : ''"
				@input="(value: string) => department.name = value" />

			<Input
				input="input"
				type="number"
				placeholder="Ramal:"
				:class="department.ramal !== '' ? 'bg-white' : ''"
				@input="(value: number) => department.ramal = String(value)" />
		</div>

		<slot></slot>
	</form>
</template>

<script setup lang="ts">
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import { reactive, watch } from "vue"
import { PropType } from "vue"
import { IDepartment } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"

let department: IDepartment = reactive({
	name: "",
	responsible: "",
	ramal: "",
	email: "",
})

const props = defineProps({
	typeAction: {
		type: String,
		required: true,
	},

	createOrUpdateDepartment: {
		type: Function as PropType<
			(department: IDepartment, action: string) => void
		>,
		required: true,
	},

	validateDataToCreateDepartment: {
		type: Function as PropType<(department: IDepartment) => void>,
		required: true,
	},

	validateDataToUpdateDepartment: {
		type: Function as PropType<(department: IDepartment) => void>,
		required: true,
	},
})

watch(department, () => {
	if (props.typeAction == Actions.SAVE) {
		props.validateDataToCreateDepartment(department)
	} else {
		props.validateDataToUpdateDepartment(department)
	}
})
</script>
