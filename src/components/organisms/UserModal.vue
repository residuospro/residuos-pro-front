<template>
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
				placeholder="Nome:"
				:class="user.name !== '' ? '!w-full bg-white' : '!w-full'"
				@input="(value: string) => user.name = value" />

			<Input
				input="input"
				placeholder="Email:"
				:class="user.name !== '' ? '!w-full bg-white' : '!w-full'"
				@input="(value: string) => user.email = value" />
		</div>

		<slot></slot>
	</form>
</template>

<script setup lang="ts">
import Typograph from "../atoms/Typograph.vue"
import Input from "../atoms/Input.vue"
import { PropType, reactive, watch, ref, Ref } from "vue"
import { IInputWrappingStyle, IUserForm } from "@/utils/interfaces"
import { Actions, AuthorizationUser } from "@/utils/enum"
import { hasPermission } from "@/utils/permissions"
import { onMounted } from "vue"
import userProps from "@/context/useProps"

const { handleAutoCompleteStyle } = userProps()

const user: IUserForm = reactive({
	name: "",
	email: "",
	department: undefined,
})
let styles = ref()
const modalContainer: Ref<HTMLElement | null> = ref(null)

const props = defineProps({
	inputWrappingStyle: {
		type: Function as PropType<() => IInputWrappingStyle>,
		required: true,
	},

	typeAction: {
		type: String,
		required: true,
	},

	createOrUpdateUser: {
		type: Function as PropType<(user: IUserForm, action: string) => void>,
		required: true,
	},

	validateDataToCreateUser: {
		type: Function as PropType<(user: IUserForm) => void>,
		required: true,
	},

	validateDataToUpdateUser: {
		type: Function as PropType<(user: IUserForm) => void>,
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
