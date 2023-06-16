<template>
	<Container type="backgroundContainer">
		<Container type="modalContainer">
			<Container type="departmentModalContainer">
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
						@input="(value: number) => department.ramal = value" />
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
/* eslint-disable no-useless-escape */
import Container from "../atoms/Container.vue"
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import Button from "../atoms/Button.vue"
import { reactive, ref, watch } from "vue"
import { PropType } from "vue"
import { IDepartment } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"

let showButton = ref(false)

let department: IDepartment = reactive({
	name: "",
	responsible: "",
	ramal: 0,
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
})

watch(department, () => {
	let validade = []

	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(department.email)

	if (props.typeAction == Actions.SAVE) {
		for (const key in department) {
			if (department[key as keyof IDepartment] != "" && regex) {
				validade.push(key)
			}
		}
	} else {
		for (const key in department) {
			if (department[key as keyof IDepartment] != "" || regex) {
				validade.push(key)
			}
		}
	}

	if (props.typeAction == Actions.SAVE && validade.length == 4) {
		showButton.value = true
	} else if (props.typeAction == Actions.UPDATE && validade.length >= 1) {
		showButton.value = true
	} else {
		showButton.value = false
	}
})
</script>
