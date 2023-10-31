<template>
	<Container type="backgroundContainer">
		<Container type="modalContainer">
			<Container type="actionsModalContainer" class="!min-h-[17rem]">
				<form
					@submit.prevent="createOrUpdateDepartment(department, typeAction)">
					<Typograph type="H2" class="text-v_medium_gray">
						{{ typeAction }} departamento
					</Typograph>

					<div class="flex flex-wrap w-full justify-between h-36 mt-2">
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

						<Input
							input="input"
							placeholder="Responsável:"
							:class="department.responsible !== '' ? 'bg-white' : ''"
							@input="(value: string) => department.responsible = value" />

						<Input
							input="input"
							placeholder="Email:"
							:class="department.email !== '' ? 'bg-white' : ''"
							@input="(value: string) => department.email = value" />
					</div>

					<div class="flex justify-end w-full space-x-5 mt-2">
						<Button
							buttonType="confirmButton"
							:class="showButton ? ' bg-v_green' : 'bg-v_dark_gray'"
							:disabled="!showButton"
							type="submit">
							<p class="text-white">{{ typeAction }}</p>
						</Button>

						<Button
							buttonType="closeButton"
							@click.prevent="closeDepartmentModal">
							Cancelar
						</Button>
					</div>
				</form>
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
		type: Function as PropType<(event: Event) => void>,
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
