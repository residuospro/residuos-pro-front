<template>
	<Container type="backgroundContainer">
		<Container type="modalContainer">
			<Container type="actionsModalContainer">
				<Typograph type="H2" class="text-v_medium_gray">
					{{ typeAction }} departamento
				</Typograph>

				<div class="flex flex-wrap w-full justify-between h-36 mt-2">
					<Input
						input="input"
						placeholder="Departamento:"
						v-model="department.name"
						@input="(value: string) => department.name = value" />
					<Input
						input="input"
						placeholder="Responsável:"
						@input="(value: string) => department.responsible = value" />
					<Input
						input="input"
						type="number"
						placeholder="Ramal:"
						@input="(value: number) => department.ramal = String(value)" />
					<Input
						input="input"
						placeholder="Email:"
						@input="(value: string) => department.email = value" />
				</div>

				<div class="flex justify-end w-full space-x-5 mt-2">
					<Button buttonType="closeButton" @click="closeDepartmentModal">
						Cancelar
					</Button>

					<Button
						buttonType="confirmButton"
						:class="showButton ? ' bg-v_green' : 'bg-v_dark_gray'"
						:disabled="!showButton"
						@click="createOrUpdateDepartment(department, typeAction)">
						<p class="text-white">{{ typeAction }}</p>
					</Button>
				</div>
			</Container>
		</Container>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import Button from "../atoms/Button.vue"
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
	closeDepartmentModal: {
		type: Function as any as () => (event: MouseEvent) => void,
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

	showButton: {
		type: Boolean,
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
