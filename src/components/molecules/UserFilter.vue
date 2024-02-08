<template>
	<div
		class="flex justify-between items-center space-x-5"
		:style="
			hasPermission([AuthorizationUser.ADMIN]) ? 'width: 43rem' : 'width: 25rem'
		">
		<v-autocomplete
			v-model="usersSelected"
			:active="true"
			:style="handleAutoCompleteStyle(usersSelected)"
			clearable
			:on-click:clear="userFilterCleaning"
			:onUpdate:modelValue="selectUser"
			:items="users"
			chips
			label="Buscar Usuário"></v-autocomplete>

		<h1 class="mt-7" v-if="hasPermission([AuthorizationUser.ADMIN])">ou</h1>

		<v-autocomplete
			v-if="hasPermission([AuthorizationUser.ADMIN])"
			clearable
			:active="true"
			:style="handleAutoCompleteStyle(departamentSelected)"
			:on-click:clear="userFilterCleaning"
			v-model="departamentSelected"
			:onUpdate:modelValue="selectUserByDepartment"
			:items="departments"
			chips
			label="Buscar por departamento">
		</v-autocomplete>
	</div>
</template>

<script setup lang="ts">
import { hasPermission } from "@/utils/permissions"
import { AuthorizationUser } from "@/utils/enum"
import useProps from "@/context/useProps"
import { PropType, ref } from "vue"

const { handleAutoCompleteStyle } = useProps()

let usersSelected = ref(null)
let departamentSelected = ref(null)

let props = defineProps({
	selectUserByDepartment: {
		type: Function as PropType<(department: string) => void>,
		required: true,
	},

	selectUser: {
		type: Function as PropType<(user: string) => void>,
		required: true,
	},

	userFilterCleaning: {
		type: Function as PropType<() => void>,
		required: true,
	},

	users: { type: Array as PropType<string[]>, required: true },

	departments: { type: Array as PropType<any[]>, required: true },
})

const selectUserByDepartment = (department: string) => {
	props.selectUserByDepartment(department)
	usersSelected.value = null
}

const selectUser = (username: string) => {
	props.selectUser(username)
	departamentSelected.value = null
}

const userFilterCleaning = () => {
	props.userFilterCleaning()
	usersSelected.value = null
	departamentSelected.value = null
}
</script>
