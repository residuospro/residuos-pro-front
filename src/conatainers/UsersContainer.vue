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
		:deleteFunction="deleteUsers"
		title="Confirmar exclusão"
		sub-title="Tem certeza que deseja excluir esse usuário?" />

	<UserModal
		v-if="showUserModal"
		:type-action="typeAction"
		:show-button="showButton"
		:departments="allDepartments"
		:close-user-modal="() => (showUserModal = false)"
		:create-or-update-user="createOrUpdateUser"
		:validateDataToCreateUser="validateDataToCreateUser"
		:validateDataToUpdateUser="validateDataToUpdateUser"
		:selectDepartment="selectTheDepartmentToCreateTheManager" />

	<Users
		:headers="headers"
		:actions="actions"
		:content="users"
		:users="usernames"
		:departments="nameDepartments"
		:show-delete-modal="openDeleteModal"
		:open-user-modal="openUserModal"
		:selectUserByDepartment="selectUserByDepartment"
		:selectUser="selectUser"
		:userFilterCleaning="userFilterCleaning" />

	<div
		class="flex justify-between items-center ml-10 w-full"
		v-if="totalPages.length > 1 || itemsPerPage > 10">
		<ItemsPerPage @setItemsPerPage="setItemsPerPage" :key="itemsPerPageKey" />

		<Pagination
			:key="paginationKey"
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
import { onMounted, reactive, ref } from "vue"
import { Actions, AuthorizationUser, Messages } from "@/utils/enum"
import { takeAllDepartments, takeDepartmentsByName } from "@/api/department"
import { setIdCompany } from "@/store/setIdCompany"
import { setDepartment } from "@/store/setDepartment"
import {
	createUser,
	takeAllUsers,
	takeAllUsernames,
	takeUserByUsername,
	updateUser,
	deleteUser,
} from "@/api/user"
import { getPermission, hasPermission } from "@/utils/permissions"

const idCompanyStore = setIdCompany()
const departmentStore = setDepartment()

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
let idDepartment = ref<any[]>([])
let userSelected = ref(false)
let idCompany = ref("")
let userId = ref()
let paginationKey = ref(0)
let itemsPerPageKey = ref(0)
let userDepartment = ref("")
let permission = ref<string[]>([])
let departmentInfo = reactive({
	name: "",
	id: "",
	ramal: "",
})

const setPagination = (currentPage: number) => {
	if (page.value != currentPage) {
		page.value = currentPage
		getAllUsersByPage(currentPage, itemsPerPage.value)
	}
}

const setItemsPerPage = (value: number) => {
	if (itemsPerPage.value != value) {
		itemsPerPage.value = value
		getAllUsersByPage(page.value, value)
	}
}

const resetPaginationAndItemsPerPage = () => {
	page.value = 1
	itemsPerPage.value = 10

	paginationKey.value = new Date().getMilliseconds()
	itemsPerPageKey.value = new Date().getMilliseconds()
}

const openUserModal = (action: string, id?: string) => {
	showUserModal.value = true
	typeAction.value = action
	userId.value = id
}

const openDeleteModal = (id: string | undefined) => {
	userId.value = id
	showDeleteModal.value = true
}

const userFilterCleaning = async () => {
	if (userSelected.value) {
		getAllUsersByPage(page.value, itemsPerPage.value)
		userSelected.value = false
	}
}

const selectUser = async (username: string) => {
	showLoading.value = true

	const res: any = await takeUserByUsername(
		username,
		idCompany.value,
		permission.value
	)

	if (res?.status == 200) {
		parseUser([res?.data])

		userSelected.value = true
	} else {
		handleApiResponse(Messages.TITLE_ERROR, Messages.SUBTITLE_ERROR)
		showNotificationModal.value = true
	}

	showLoading.value = false
}

const selectUserByDepartment = async (department: string) => {
	showLoading.value = true
	const id = idDepartment.value.find((d) => d.name == department)

	const res: any = await takeAllUsers(
		page.value,
		itemsPerPage.value,
		idCompany.value,
		id.id
	)

	if (res?.status == 200 && res?.data.users.length > 0) {
		parseUser(res?.data.users)

		setTotalPages(res?.data.totalPages)

		userSelected.value = true
	} else {
		handleApiResponse(Messages.TITLE_ERROR, Messages.SUBTITLE_ERROR)
		showNotificationModal.value = true
	}

	showLoading.value = false
}

const handleApiResponse = (
	titleResponse: string,
	subtitleResponse: string,
	status?: number
) => {
	title.value = titleResponse
	subTitle.value = subtitleResponse

	if (status == 201 || status == 200) {
		resetPaginationAndItemsPerPage()

		getAllUsersByPage(page.value, itemsPerPage.value)

		getAllDepartment()

		getAllUsernames()
	} else {
		showLoading.value = false
	}
}

const validateDataToCreateUser = (user: IUsers) => {
	let validate = []

	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)

	for (const key in user) {
		if (user[key as keyof IUsers] != "" && user[key as keyof IUsers] && regex) {
			validate.push(key)
		}
	}

	if (validate.length == 4 && hasPermission([AuthorizationUser.ADMIN])) {
		showButton.value = true
	} else if (
		validate.length == 3 &&
		hasPermission([AuthorizationUser.MANAGER])
	) {
		showButton.value = true
	} else {
		showButton.value = false
	}
}

const validateDataToUpdateUser = (user: IUsers) => {
	let validate = []
	let regex = true

	for (const key in user) {
		if (
			user[key as keyof IUsers] != "" &&
			user[key as keyof IUsers] &&
			key !== "email"
		) {
			validate.push(key)
		}
	}

	if (user.email != "") {
		regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)
	}

	console.log(validate, regex)

	if (validate.length > 0 && regex) showButton.value = true
	else if (!regex) showButton.value = false
	else showButton.value = false
}

const createOrUpdateUser = (user: IUsers, action: string) => {
	showLoading.value = true

	if (action == Actions.SAVE) {
		createUsers(user)
	} else {
		updateUsers(user)
	}
}

const createUsers = async (user: IUsers) => {
	if (departmentInfo.name != "") {
		user.department = departmentInfo.name
		user.idDepartment = departmentInfo.id
		user.ramal = departmentInfo.ramal
	}

	user.idCompany = idCompany.value

	const res: any = await createUser(user, permission.value)

	if (res?.status == 201) {
		handleApiResponse(Messages.TITLE_REGISTER, Messages.SUBTITLE_REGISTER, 201)
	} else if (res?.status == 409) {
		handleApiResponse(
			Messages.TITLE_EXISTING_USER,
			Messages.SUBTITLE_EXISTING_USER
		)
	} else {
		handleApiResponse(
			Messages.TITLE_ERROR_REGISTER,
			Messages.SUBTITLE_ERROR_REGISTER
		)
	}

	showUserModal.value = false
	showNotificationModal.value = true
}

const updateUsers = async (user: IUsers) => {
	if (departmentInfo.name != "") {
		user.department = departmentInfo.name
		user.idDepartment = departmentInfo.id
		user.ramal = departmentInfo.ramal
	}

	const res: any = await updateUser(user, userId.value)

	if (res?.status == 200) {
		handleApiResponse(
			Messages.TITLE_UPDATE_REGISTER,
			Messages.SUBTITLE_UPDATE_REGISTER,
			201
		)
	} else if (res?.status == 409) {
		handleApiResponse(
			Messages.TITLE_EXISTING_USER,
			Messages.SUBTITLE_EXISTING_USER
		)
	} else {
		handleApiResponse(
			Messages.TITLE_ERROR_UPDATE_REGISTER,
			Messages.SUBTITLE_ERROR_UPDATE_REGISTER
		)
	}

	showUserModal.value = false
	showNotificationModal.value = true
}

const deleteUsers = async () => {
	showLoading.value = true

	const res: any = await deleteUser(userId.value)

	if (res?.status == 200) {
		handleApiResponse(
			Messages.TITLE_DELETE_REGISTER,
			Messages.SUBTITLE_DELETE_REGISTER,
			200
		)
	} else {
		handleApiResponse(
			Messages.TITLE_ERROR_DELETE_REGISTER,
			Messages.SUBTITLE_ERROR_DELETE_REGISTER
		)
	}

	showDeleteModal.value = false
	showNotificationModal.value = true
}

const selectTheDepartmentToCreateTheManager = async (department: string) => {
	showLoading.value = true

	const res: any = await takeDepartmentsByName(department, idCompany.value)

	if (res?.status == 200) {
		departmentInfo.id = res.data._id

		departmentInfo.name = res.data.name

		departmentInfo.ramal = res.data.ramal

		showLoading.value = false
	} else {
		handleApiResponse(Messages.TITLE_ERROR, Messages.SUBTITLE_ERROR)
	}
}

const selectTheDepartmentToCreateTheCollaborator = () => {
	const department = departmentStore.getDepartment

	departmentInfo.id = department.id

	departmentInfo.name = department.name

	departmentInfo.ramal = String(department.ramal)
}

const getAllDepartment = async () => {
	const res: any = await takeAllDepartments(idCompany.value)

	if (res?.status == 200) {
		allDepartments.value = res.data.map((d: any) => d.name)
		idDepartment.value = res?.data.map((d: any) => {
			return {
				name: d.name,
				id: d._id,
			}
		})
	}
}

const getAllUsernames = async () => {
	const res: any = await takeAllUsernames(
		idCompany.value,
		permission.value,
		userDepartment.value
	)

	if (res?.status == 200) {
		usernames.value = res?.data.map((n: any) => n.username)
		res?.data.forEach((user: any) => {
			if (!nameDepartments.value.includes(user.department)) {
				nameDepartments.value.push(user.department)
			}
		})
	}
}

const getAllUsersByPage = async (page: number, itemsPerPage: number) => {
	showLoading.value = true

	const res: any = await takeAllUsers(
		page,
		itemsPerPage,
		idCompany.value,
		permission.value,
		userDepartment.value
	)

	if (res?.status == 200) {
		parseUser(res?.data.users)

		setTotalPages(res?.data.totalPages)

		showLoading.value = false
	} else if (res?.status == 404) {
		handleApiResponse(
			Messages.TITLE_THERE_ARE_NO_RECORDS,
			Messages.SUBTITLE_THERE_ARE_NO_RECORDS
		)
		showNotificationModal.value = true
	} else {
		handleApiResponse(Messages.TITLE_ERROR, Messages.SUBTITLE_ERROR)
		showNotificationModal.value = true
	}
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
			idDepartment: d.idDepartment,
			idCompany: d.idCompany,
		}
	})
}

const setTotalPages = (pages: number) => {
	totalPages.value = []

	for (let i = 0; i <= pages - 1; i++) {
		totalPages.value.push(i)
	}
}

const getUserDepartment = () => {
	userDepartment.value = departmentStore.getIdDepartment
	selectTheDepartmentToCreateTheCollaborator()
}

const loadsAllUsersAndTheirInfo = () => {
	idCompany.value = idCompanyStore.getIdCompany

	getAllUsersByPage(page.value, itemsPerPage.value)

	if (hasPermission([AuthorizationUser.ADMIN])) {
		getAllDepartment()
	}

	getAllUsernames()
}

onMounted(() => {
	permission.value = getPermission()

	if (hasPermission([AuthorizationUser.MANAGER])) {
		getUserDepartment()
	}

	loadsAllUsersAndTheirInfo()
})
</script>
