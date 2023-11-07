<template>
	<Container type="backgroundContainer">
		<Wrapper type="modal">
			<Wrapper type="actionsModal" :style="inputContainerStyle()">
				<form @submit.prevent="createOrUpdateUser(user, typeAction)">
					<Typograph type="H2" class="text-v_medium_gray">
						{{ typeAction }} usuário
					</Typograph>

					<div :style="styles">
						<v-autocomplete
							v-if="hasPermission([AuthorizationUser.ADMIN])"
							:style="handleAutoCompleteStyle(user.department)"
							clearable
							:on-click:clear="() => (user.department = undefined)"
							:onUpdate:modelValue="selectDepartment"
							:items="departments"
							v-model="user.department"
							chips
							label="Departamento:"></v-autocomplete>

						<Input
							input="input"
							placeholder="Email:"
							:class="user.name !== '' ? '!w-full bg-white' : '!w-full'"
							@input="(value: string) => user.email = value" />

						<Input
							input="input"
							placeholder="Nome:"
							:class="user.name !== '' ? '!w-full bg-white' : '!w-full'"
							@input="(value: string) => user.name = value" />
					</div>

					<div class="flex justify-end w-full space-x-5 mt-4">
						<Button
							type="submit"
							buttonType="confirmButton"
							:class="showButton ? ' bg-v_green' : 'bg-v_dark_gray'"
							:disabled="!showButton">
							<p class="text-white">{{ typeAction }}</p>
						</Button>

						<Button buttonType="closeButton" @click.prevent="closeUserModal">
							Cancelar
						</Button>
					</div>
				</form>
			</Wrapper>
		</Wrapper>
	</Container>
</template>

<script setup lang="ts">
import Container from "../atoms/Container.vue"
import Wrapper from "../atoms/Wrapper.vue"
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import Button from "../atoms/Button.vue"
import { PropType, reactive, watch, ref } from "vue"
import {
	IInputContainerStyle,
	IInputWrappingStyle,
	IUsers,
} from "@/utils/interfaces"
import { Actions, AuthorizationUser } from "@/utils/enum"
import { hasPermission } from "@/utils/permissions"
import userProps from "@/context/useProps"
import { onMounted } from "vue"

const { handleAutoCompleteStyle } = userProps()

const user: IUsers = reactive({
	name: "",
	username: "",
	email: "",
	department: undefined,
	ramal: "",
	id: "",
	idDepartment: "",
	idCompany: "",
})

const props = defineProps({
	inputWrappingStyle: {
		type: Function as PropType<() => IInputWrappingStyle>,
		required: true,
	},

	inputContainerStyle: {
		type: Function as PropType<() => IInputContainerStyle>,
		required: true,
	},

	typeAction: {
		type: String,
		required: true,
	},

	closeUserModal: {
		type: Function as PropType<() => void>,
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

let styles = ref()

onMounted(() => {
	styles.value = props.inputWrappingStyle()
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
	box-shadow: 0 0.3rem 0.62rem rgba(0, 0, 0, 0.4);
	border-radius: 0.375rem;
	width: 100%;
	color: #606060;
	font-weight: bold;
}
</style>
