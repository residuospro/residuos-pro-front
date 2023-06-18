<template>
	<Container type="backgroundContainer">
		<Container type="modalContainer">
			<Container type="actionsModalContainer" class="h-[22rem]">
				<Typograph type="H2" class="text-v_medium_gray">
					{{ typeAction }} usuário
				</Typograph>

				<div class="flex flex-wrap w-full justify-between h-60 mt-2">
					<Input
						input="input"
						placeholder="Nome:"
						:class="user.name !== '' ? '!w-full bg-white' : '!w-full'"
						@input="(value: string) => user.name = value" />

					<Input
						input="input"
						placeholder="Username:"
						:class="user.username !== '' ? ' bg-white' : ''"
						@input="(value: string) => user.username = value" />

					<Input
						input="input"
						placeholder="Email:"
						:class="user.email !== '' ? 'bg-white' : ''"
						@input="(value: string) => user.email = value" />

					<Input
						input="input"
						type="number"
						placeholder="Ramal:"
						:class="user.ramal !== '' ? '!w-full bg-white' : '!w-full'"
						@input="(value: number) => user.ramal = String(value)" />

					<v-autocomplete
						:onUpdate:modelValue="selectDepartment"
						:items="departments"
						v-model="user.department"
						chips
						label="Departamento"></v-autocomplete>
				</div>

				<div class="flex justify-end w-full space-x-5 mt-2">
					<Button buttonType="closeButton" @click="closeUserModal">
						Cancelar
					</Button>

					<Button
						buttonType="confirmButton"
						:class="showButton ? ' bg-v_green' : 'bg-v_dark_gray'"
						:disabled="!showButton"
						@click="createOrUpdateUser(user, typeAction)">
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
import { PropType, reactive, watch, ref, computed } from "vue"
import { IUsers } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"

let departmentSelected = ref()

const user = reactive({
	name: "",
	username: "",
	email: "",
	department: null,
	ramal: "",
})

const props = defineProps({
	typeAction: {
		type: String,
		required: true,
	},
	closeUserModal: {
		type: Function as any as () => (event: MouseEvent) => void,
		required: true,
	},
	createOrUpdateUser: {
		type: Function as PropType<(user: IUsers, action: string) => void>,
		required: true,
	},

	validateDataToCreateUser: {
		type: Function as PropType<(user: IUsers) => void>,
		required: true,
	},

	validateDataToUpdateUser: {
		type: Function as PropType<(user: IUsers) => void>,
		required: true,
	},

	showButton: {
		type: Boolean,
		required: true,
	},

	selectDepartment: {
		type: Function as PropType<(department: any) => void>,
		required: true,
	},

	departments: {
		type: Array as PropType<string[]>,
		required: true,
	},
})

const autocompleteHeight = computed(() => {
	let height = "3rem"

	if (user.department) height = "3.8rem"

	return height
})

const autocompleteBackground = computed(() => {
	let bg = "#f3f4f6"

	if (user.department) bg = "#fff"

	return bg
})

watch(user, () => {
	if (props.typeAction == Actions.SAVE) {
		props.validateDataToCreateUser(user)
	} else {
		props.validateDataToUpdateUser(user)
	}
})
</script>

<style scoped>
.v-autocomplete--single {
	background: v-bind(autocompleteBackground);
	box-shadow: 0 0.3rem 0.62rem rgba(0, 0, 0, 0.4);
	border-radius: 0.375rem;
	height: v-bind(autocompleteHeight);
	width: 100%;
	color: #606060;
	font-weight: bold;
}
</style>
