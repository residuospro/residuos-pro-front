<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="closeNotificationModal"
		v-if="showNotificationModal" />

	<ActionModal
		v-if="showDeleteModal"
		:closeDeleteModal="() => (showDeleteModal = false)"
		:confirm-action="deleteUsers"
		title="Confirmar exclusão"
		sub-title="Tem certeza que deseja excluir esse usuário?" />

	<WrapperModal
		v-if="showUserModal"
		:closeModalOutside="() => (showUserModal = false)">
		<UserModal
			:type-action="typeAction"
			:departments="allDepartments"
			:create-or-update-user="createOrUpdateUser"
			:validateDataToCreateUser="validateDataToCreateUser"
			:validateDataToUpdateUser="validateDataToUpdateUser"
			:selectDepartment="selectTheDepartmentToCreateTheManager"
			:inputWrappingStyle="inputWrappingStyle">
			<ModalActionButtons
				:show-button="showButton"
				:closeModal="closeUserModal" />
		</UserModal>
	</WrapperModal>

	<Container type="page">
		<Wrapper type="header">
			<UserFilter
				:users="usernames"
				:departments="nameDepartments"
				:selectUserByDepartment="selectUserByDepartment"
				:selectUser="selectUser"
				:userFilterCleaning="userFilterCleaning" />

			<Button
				buttonType="submit"
				class="bg-white"
				@click="openUserModal(Actions.SAVE)">
				<p class="text-v_dark_gray">Cadastrar</p>
			</Button>
		</Wrapper>

		<UserTable
			:actions="actions"
			:content="users"
			:itemsPerPage="Number(itemsPerPage)"
			:show-delete-modal="openDeleteModal"
			:openUserModal="openUserModal">
			<template v-slot:emptyTable>
				<EmptyTable :content="users.length" />
			</template>

			<template v-slot:header>
				<TableHead :headers="headers" action="Ajustar" />
			</template>
		</UserTable>

		<WrapperPagination :totalPages="totalPages" :itemsPerPage="itemsPerPage">
			<ItemsPerPage @setItemsPerPage="setItemsPerPage" class="float-left" />

			<Pagination
				:current-page="page"
				:pageCount="totalPages.length"
				:items="totalPages"
				@paginate="setPagination"
				class="float-right" />
		</WrapperPagination>
	</Container>
</template>

<script setup lang="ts">
/* eslint-disable no-useless-escape */
import Container from "@/components/atoms/Container.vue"
import WrapperPagination from "@/components/molecules/WrapperPagination.vue"
import ModalActionButtons from "@/components/molecules/ModalActionButtons.vue"
import UserFilter from "@/components/molecules/UserFilter.vue"
import Wrapper from "@/components/atoms/Wrapper.vue"
import WrapperModal from "@/components/molecules/WrapperModal.vue"
import UserTable from "@/components/organisms/UserTable.vue"
import TableHead from "@/components/molecules/TableHead.vue"
import EmptyTable from "@/components/molecules/EmptyTable.vue"
import Loading from "@/components/molecules/Loading.vue"
import Button from "@/components/atoms/Button.vue"
import Notification from "@/components/molecules/NotificationModal.vue"
import Pagination from "@/components/organisms/Pagination.vue"
import ItemsPerPage from "@/components/molecules/ItemsPerPage.vue"
import ActionModal from "@/components/molecules/ActionModal.vue"
import UserModal from "@/components/organisms/UserModal.vue"
import {
	IDepartment,
	IInputWrappingStyle,
	IMessage,
	IUserForm,
	IUsers,
} from "@/utils/interfaces"
import { computed, onMounted, reactive, ref, watch } from "vue"
import { Actions, AuthorizationUser, Service } from "@/utils/enum"
import { takeAllDepartments } from "@/api/department"
import { createUser, takeAllUsers, updateUser, deleteUser } from "@/api/user"
import { getPermission, hasPermission } from "@/utils/permissions"
import useProps from "../context/useProps"
import { stores } from "@/store"
import { useHead } from "@vueuse/head"

useHead({
	title: "Resíduos Pro - Usuários",
})

const { parseDepartment, setTotalPages, parseUser } = useProps()

const { department_store, user_store, company_store } = stores()

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
let usernames = ref<string[]>([])
let nameDepartments = ref<string[]>([])
let allDepartments = ref<string[]>([])
let idDepartment = ref<string | undefined>("")
let userSelected = ref(false)
let idCompany = ref("")
let userId = ref<string | undefined>("")
let permission = ref<string[]>([])
let resetComputed = ref(0)
let departmentInfo = reactive<IDepartment>({
	name: "",
	ramal: "",
	id: "",
	idCompany: "",
})

const inputWrappingStyle = () => {
	let style: IInputWrappingStyle[] = [
		{
			display: "flex",
			width: "100%",
			justifyContent: "space-between",
			marginTop: "0.5rem",
			position: "relative",
			flexWrap: "wrap",
			minHeight: "",
		},
	]

	if (hasPermission([AuthorizationUser.ADMIN])) {
		style[0].minHeight = "15rem"
	} else {
		style[0].minHeight = "8rem"
	}

	return style[0]
}

const changeVariableState = () => {
	showNotificationModal.value = true
	showUserModal.value = false
	showButton.value = false
	showLoading.value = false
}

const userFilterCleaning = async () => {
	if (userSelected.value) {
		users.value = []

		callGetUsersByPage(page.value, itemsPerPage.value)

		userSelected.value = false
	}
}

const handleApiResponse = (message: IMessage) => {
	title.value = message.title
	subTitle.value = message.subTitle
}

watch(showUserModal, () => {
	allDepartments.value = department_store.getDepartments.map((d) => d.name)
})

// Paging session

const setPagination = (currentPage: number) => {
	if (page.value != currentPage) {
		page.value = currentPage
	}
}

const setItemsPerPage = (value: number) => {
	if (itemsPerPage.value != value) {
		itemsPerPage.value = value
	}
}

const paginatedItems = computed(() => {
	const users = user_store.getUsers

	resetComputed.value

	const totalPages = setTotalPages(Math.ceil(users.length / itemsPerPage.value))

	const currentPage = page.value

	let items = itemsPerPage.value

	if (typeof items === "string") {
		items = parseInt(items)
	}

	const startIndex = (currentPage - 1) * items
	const endIndex = startIndex + items

	return { users: users.slice(startIndex, endIndex), totalPages }
})

watch(paginatedItems, () => {
	totalPages.value = paginatedItems.value.totalPages

	users.value = paginatedItems.value.users

	getAllUsernames()
	getNameOfDepartments()

	department_store.setTotalPages(paginatedItems.value.totalPages)

	if (paginatedItems.value.users.length == 0) {
		page.value -= 1
	}

	if (paginatedItems.value.totalPages.length == 1) {
		page.value = 1
	}
})

// Session handle modal

const openUserModal = (action: string, id?: string) => {
	showUserModal.value = true
	typeAction.value = action
	userId.value = id
}

const openDeleteModal = (id: string | undefined) => {
	userId.value = id
	showDeleteModal.value = true
}

const closeNotificationModal = () => {
	showNotificationModal.value = false
}

const closeUserModal = (event: Event) => {
	event.stopPropagation()
	showUserModal.value = false
}

// Crud Session

const validateDataToCreateUser = (userForm: IUserForm) => {
	let validate = []

	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userForm.email!)

	for (const key in userForm) {
		if (
			userForm[key as keyof IUserForm] != "" &&
			userForm[key as keyof IUserForm] != undefined &&
			userForm[key as keyof IUserForm] &&
			regex
		) {
			validate.push(key)
		}
	}

	if (validate.length == 3 && hasPermission([AuthorizationUser.ADMIN])) {
		showButton.value = true
	} else if (
		validate.length == 2 &&
		hasPermission([AuthorizationUser.MANAGER])
	) {
		showButton.value = true
	} else {
		showButton.value = false
	}
}

const validateDataToUpdateUser = (user: IUserForm) => {
	let validate = []
	let regex = true

	for (const key in user) {
		if (user[key as keyof IUserForm] != "" && user[key as keyof IUserForm]) {
			validate.push(key)
		}
	}

	if (user.email != "") {
		regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email!)
	}

	if (validate.length > 0 && regex) showButton.value = true
	else if (!regex) showButton.value = false
	else showButton.value = false
}

const createOrUpdateUser = (user: IUserForm, action: string) => {
	showLoading.value = true

	if (action == Actions.SAVE) {
		createUsers(user)
	} else {
		updateUsers(user)
	}
}

const createUsers = async (userForm: IUserForm) => {
	const user = setUser(userForm)

	const res: any = await createUser(user, permission.value)

	if (res?.status == 201 || res?.status == 409) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	changeVariableState()

	if (user_store.getUsers.length == 0) {
		callGetUsersByPage(page.value, itemsPerPage.value)
	}
}

const updateUsers = async (userForm: IUserForm) => {
	const user = setUser(userForm)

	const res: any = await updateUser(user, userId.value)

	if (res?.status == 200 || res?.status == 409) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	changeVariableState()
}

const deleteUsers = async () => {
	showLoading.value = true

	showDeleteModal.value = false

	const res: any = await deleteUser(idCompany.value, userId.value)

	if (res?.status == 200) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	changeVariableState()
}

const setUser = (userForm: IUserForm): Partial<IUsers> => {
	const user: Partial<IUsers> = {
		name: userForm.name == "" ? undefined : userForm.name,
		email: userForm.email == "" ? undefined : userForm.email,
		department: userForm.department ? userForm.department : departmentInfo.name,
		idDepartment: departmentInfo.id == "" ? undefined : departmentInfo.id,
		ramal: departmentInfo.ramal == "" ? undefined : departmentInfo.ramal,
		idCompany: idCompany.value,
		service: Service.RESIDUOSPRO,
	}

	return user
}

// Selection session

const selectUser = async (user: string) => {
	if (user) {
		const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user)

		if (regex) {
			users.value = user_store.getUsers.filter((u) => u.email == user)
		} else {
			users.value = user_store.getUsers.filter((u) => u.username == user)
		}

		userSelected.value = true
	}
}

const selectUserByDepartment = async (department: string) => {
	if (department) {
		users.value = user_store.getUsers.filter((u) => u.department == department)

		userSelected.value = true
	}
}

const selectTheDepartmentToCreateTheManager = async (department: string) => {
	const departmentMatch = department_store.getDepartments.find(
		(d) => d.name === department
	)

	Object.assign(departmentInfo, departmentMatch)
}

const selectTheDepartmentToCreateTheCollaborator = () => {
	const department = department_store.getDepartment

	Object.assign(departmentInfo, department)
}

// Get session

const callGetUsersByPage = async (
	currentPage: number,
	itemsPerPage: number
) => {
	showLoading.value = true

	if (user_store.getUsers.length == 0) {
		await getAllUsersByPage(currentPage, itemsPerPage)
	} else {
		resetComputed.value = new Date().getMilliseconds()
	}

	showLoading.value = false
}

const getAllDepartment = async () => {
	if (department_store.getDepartments.length == 0) {
		const res: any = await takeAllDepartments(idCompany.value)

		if (res?.status == 200) {
			department_store.setDepartments(parseDepartment(res?.data))
		}
	}
}

const getAllUsernames = () => {
	usernames.value = user_store.getUsers.map((n: any) =>
		n.username == undefined ? n.email : n.username
	)
}

const getNameOfDepartments = () => {
	user_store.getUsers.forEach((user: any) => {
		if (!nameDepartments.value.includes(user.department)) {
			nameDepartments.value.push(user.department)
		}
	})
}

const getAllUsersByPage = async (page: number, itemsPerPage: number) => {
	const res: any = await takeAllUsers(
		page,
		itemsPerPage,
		idCompany.value,
		permission.value,
		idDepartment.value
	)

	if (res?.status == 200) {
		user_store.setUsers(parseUser(res?.data.users))

		user_store.setTotalPages(setTotalPages(res?.data.totalPages))
	} else if (res?.status == 404) {
		user_store.setUsers([])

		user_store.setTotalPages([])
	} else {
		handleApiResponse(res?.response?.data?.message)

		showNotificationModal.value = true
	}
}

const loadsAllUsersAndTheirInfo = async () => {
	await callGetUsersByPage(page.value, itemsPerPage.value)

	if (hasPermission([AuthorizationUser.ADMIN])) {
		await getAllDepartment()
	}
}

onMounted(() => {
	permission.value = getPermission()

	idCompany.value = company_store.getIdCompany

	if (hasPermission([AuthorizationUser.MANAGER])) {
		idDepartment.value = department_store.getIdDepartment

		selectTheDepartmentToCreateTheCollaborator()
	}

	loadsAllUsersAndTheirInfo()
})
</script>
