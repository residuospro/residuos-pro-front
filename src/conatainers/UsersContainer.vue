<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="(value: boolean) => showNotificationModal = value"
		v-if="showNotificationModal" />

	<DeleteModal
		v-if="showDeleteModal"
		:closeDeleteModal="() => (showDeleteModal = false)"
		:deleteFunction="deleteUser"
		title="Confirmar exclusão"
		sub-title="Tem certeza que deseja excluir esse usuário?" />

	<UserModal
		v-if="showUserModal"
		:type-action="typeAction"
		:show-button="showButton"
		:departments="nameDepartments"
		:close-user-modal="() => (showUserModal = false)"
		:create-or-update-user="createOrUpdateUser"
		:validateDataToCreateUser="validateDataToCreateUser"
		:validateDataToUpdateUser="validateDataToUpdateUser"
		:selectDepartment="selectTheDepartmentToCreateTheUser" />

	<Users
		:headers="headers"
		:actions="actions"
		:content="users"
		:users="username"
		:departments="nameDepartments"
		:show-delete-modal="openDeleteModal"
		:open-user-modal="openUserModal"
		:selectUserByDepartment="selectUserByDepartment"
		:selectUser="selectUser"
		:userFilterCleaning="userFilterCleaning" />

	<div
		class="flex justify-between items-center ml-10 w-full"
		v-if="totalPages.length >= 0">
		<ItemsPerPage @setItemsPerPage="setItemsPerPage" />

		<Pagination
			:pageCount="totalPages.length"
			:items="totalPages"
			@paginate="setPagination" />
	</div>
</template>

<script setup lang="ts">
/* eslint-disable no-useless-escape */
import Users from "@/components/organisms/Users.vue"
import Loading from "@/components/molecules/Loading.vue"
import Notification from "@/components/molecules/Notification.vue"
import Pagination from "@/components/molecules/Pagination.vue"
import ItemsPerPage from "@/components/molecules/ItemsPerPage.vue"
import DeleteModal from "@/components/molecules/DeleteModal.vue"
import UserModal from "@/components/molecules/UserCreateOrUpdateModal.vue"
import { IUsers } from "@/utils/interfaces"
import { reactive, ref } from "vue"
import { Actions, Messages } from "@/utils/enum"
import { takeAllDepartments, takeDepartmentsByName } from "@/api/department"
import { onMounted } from "vue"
import { takeAllUsers, createUser } from "@/api/users"

const headers = ["Nome", "Username", "Email", "Departamento", "Ramal"]

const actions = ["Atualizar", "Deletar"]

let showDeleteModal = ref(false)
let showLoading = ref(false)
let showNotificationModal = ref(false)
let showUserModal = ref(false)
let showButton = ref(false)
let typeAction = ref("Cadastrar")
let title = ref("")
let subTitle = ref("")
let page = ref(1)
let itemsPerPage = ref(10)
let totalPages = ref<number[]>([])
let users = ref<IUsers[]>([])
let username = ref<string[]>([])
let nameDepartments = ref<string[]>([])
let departmentInfo = reactive({
	name: "",
	id: "",
})
let userSelected = ref(false)
let userId = ref()

const setPagination = (currentPage: number) => {
	page.value = currentPage
}

const setItemsPerPage = (value: number) => {
	itemsPerPage.value = value
}

const deleteUser = async () => {
	console.log("deletado")
}
const openUserModal = (action: string, id?: string) => {
	showUserModal.value = true
	typeAction.value = action
	userId.value = id
}

const openDeleteModal = (id: string) => {
	userId.value = id
	showDeleteModal.value = true
}

const createOrUpdateUser = (user: IUsers, action: string) => {
	showLoading.value = true

	if (action == Actions.SAVE) {
		createUsers(user)
	} else {
		console.log("update")
	}
}

const createUsers = async (user: IUsers) => {
	const res: any = await createUser(user, departmentInfo)

	if (res?.status == 201) {
		title.value = Messages.TITLE_REGISTER
		subTitle.value = Messages.SUBTITLE_REGISTER
		getAllUsersByPage(page.value, itemsPerPage.value)
	} else {
		title.value = Messages.TITLE_ERROR_REGISTER
		subTitle.value = Messages.SUBTITLE_ERROR_REGISTER
		showLoading.value = false
	}

	showUserModal.value = false
	showNotificationModal.value = true
}

const validateDataToCreateUser = (user: IUsers) => {
	let validate = []

	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)

	for (const key in user) {
		if (user[key as keyof IUsers] != "" && user[key as keyof IUsers] && regex) {
			validate.push(key)
		}
	}

	console.log(validate)

	if (validate.length == 5) showButton.value = true
	else showButton.value = false
}

const validateDataToUpdateUser = (user: IUsers) => {
	let validate = []
	let regex = true

	for (const key in user) {
		if (user[key as keyof IUsers] != "" && key !== "email") {
			validate.push(key)
		}
	}

	if (user.email != "") {
		regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)
	}

	if (validate.length >= 1 && regex) showButton.value = true
	else showButton.value = false
}

const selectUserByDepartment = async () => {
	console.log("selected")
}

const selectTheDepartmentToCreateTheUser = async (department: string) => {
	showLoading.value = true

	const res: any = await takeDepartmentsByName(department)

	if (res?.status == 200) {
		departmentInfo.id = res.data._id
		departmentInfo.name = res.data.name
	} else {
		title.value = Messages.TITLE_ERROR
		subTitle.value = Messages.SUBTITLE_ERROR
	}

	showLoading.value = false
}

const getAllDepartment = async () => {
	const res: any = await takeAllDepartments()

	if (res?.status == 200)
		nameDepartments.value = res.data.map((n: any) => n.name)
}

const selectUser = async () => {
	console.log("selected")
}

const userFilterCleaning = async () => {
	console.log("selected")
}

const getAllUsersByPage = async (page: number, itemsPerPage: number) => {
	showLoading.value = true

	const res: any = await takeAllUsers(page, itemsPerPage)

	if (res?.status == 200) {
		parseUser(res?.data.users)
		setTotalPages(res?.data.totalPages)
	} else {
		title.value = Messages.TITLE_ERROR
		subTitle.value = Messages.SUBTITLE_ERROR
		showNotificationModal.value = true
	}

	showLoading.value = false
}

const parseUser = (data: any[]) => {
	users.value = data.map((d) => {
		return {
			name: d.name,
			username: d.username,
			ramal: d.ramal,
			email: d.email,
			id: d._id,
			department: d.department,
		}
	})
}

const setTotalPages = (pages: number) => {
	totalPages.value = []

	for (let i = 0; i <= pages - 1; i++) {
		totalPages.value.push(i)
	}
}

onMounted(() => {
	getAllUsersByPage(page.value, itemsPerPage.value)
	getAllDepartment()
})
</script>
