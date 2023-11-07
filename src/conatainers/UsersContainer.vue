<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="closeModal"
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
		:selectDepartment="selectTheDepartmentToCreateTheManager"
		:inputWrappingStyle="inputWrappingStyle"
		:inputContainerStyle="inputContainerStyle" />

	<Users
		:headers="headers"
		:actions="actions"
		:content="users"
		:users="usernames"
		:departments="nameDepartments"
		:itemsPerPage="Number(itemsPerPage)"
		:show-delete-modal="openDeleteModal"
		:open-user-modal="openUserModal"
		:selectUserByDepartment="selectUserByDepartment"
		:selectUser="selectUser"
		:userFilterCleaning="userFilterCleaning" />

	<div
		class="w-full mt-4 ml-10 min-h-[15rem]"
		v-if="totalPages.length > 1 || itemsPerPage > 10">
		<ItemsPerPage
			@setItemsPerPage="setItemsPerPage"
			v-show="page == 1"
			class="float-left" />

		<Pagination
			:current-page="page"
			:pageCount="totalPages.length"
			:items="totalPages"
			@paginate="setPagination"
			class="float-right" />
	</div>
</template>

<script setup lang="ts">
/* eslint-disable no-useless-escape */
import Users from "@/components/organisms/Users.vue"
import Loading from "@/components/molecules/Loading.vue"
import Notification from "@/components/molecules/Notification.vue"
import Pagination from "@/components/organisms/Pagination.vue"
import ItemsPerPage from "@/components/molecules/ItemsPerPage.vue"
import DeleteModal from "@/components/molecules/DeleteModal.vue"
import UserModal from "@/components/organisms/UserCreateOrUpdateModal.vue"
import {
	IDepartment,
	IInputContainerStyle,
	IInputWrappingStyle,
	IMessage,
	IUsers,
} from "@/utils/interfaces"
import { onMounted, reactive, ref } from "vue"
import { Actions, AuthorizationUser } from "@/utils/enum"
import { takeAllDepartments } from "@/api/department"
import { setIdCompany } from "@/store/setIdCompany"
import { setDepartment } from "@/store/setDepartment"
import {
	createUser,
	takeAllUsers,
	takeAllUsernames,
	updateUser,
	deleteUser,
	takeUserByUsername,
} from "@/api/user"
import { getPermission, hasPermission } from "@/utils/permissions"
import useProps from "../context/useProps"

const { parseDepartment } = useProps()

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
let departments = ref<IDepartment[]>([])
let userDepartment = ref("")
let permission = ref<string[]>([])
let departmentInfo = reactive<IDepartment>({
	name: "",
	responsible: "",
	ramal: "",
	id: "",
	email: "",
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

	console.log("s", style[0])

	return style[0]
}

const inputContainerStyle = (): IInputContainerStyle => {
	if (hasPermission([AuthorizationUser.ADMIN])) {
		return { minHeight: "18rem" }
	} else {
		return { minHeight: "15rem" }
	}
}

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

const openUserModal = (action: string, id?: string) => {
	showUserModal.value = true
	typeAction.value = action
	userId.value = id
}

const openDeleteModal = (id: string | undefined) => {
	userId.value = id
	showDeleteModal.value = true
}

const changeVariableState = () => {
	showDeleteModal.value = false
	showNotificationModal.value = true

	showUserModal.value = false
	showLoading.value = false
	showButton.value = false
}

const closeModal = () => {
	getAllDepartment()
	getAllUsernames()

	showNotificationModal.value = false
}

const userFilterCleaning = async () => {
	if (userSelected.value) {
		getAllUsersByPage(page.value, itemsPerPage.value)
		userSelected.value = false
	}
}

const selectUser = async (username: string) => {
	if (username) {
		showLoading.value = true

		const res: any = await takeUserByUsername(
			username,
			idCompany.value,
			permission.value
		)

		if (res?.status == 200) {
			users.value = parseUser(res?.data)
		}

		showLoading.value = false

		userSelected.value = true
	}
}

const selectUserByDepartment = async (department: string) => {
	if (department) {
		showLoading.value = true

		const id = idDepartment.value.find((d) => d.name == department)

		const res: any = await takeAllUsers(
			page.value,
			itemsPerPage.value,
			idCompany.value,
			permission.value,
			id.id
		)

		if (res?.status == 200) {
			users.value = parseUser(res?.data.users)

			setTotalPages(res?.data.totalPages)
		}

		showLoading.value = false

		userSelected.value = true
	}
}

const handleApiResponse = (message: IMessage) => {
	title.value = message.title
	subTitle.value = message.subTitle
}

const validateDataToCreateUser = (user: IUsers) => {
	let validate = []

	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)

	for (const key in user) {
		if (user[key as keyof IUsers] != "" && user[key as keyof IUsers] && regex) {
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

const validateDataToUpdateUser = (user: IUsers) => {
	let validate = []
	let regex = true

	for (const key in user) {
		if (user[key as keyof IUsers] != "" && user[key as keyof IUsers]) {
			validate.push(key)
		}
	}

	if (user.email != "") {
		regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)
	}

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

	console.log("u", res)

	if (res?.status == 201) {
		users.value = [...users.value, ...parseUser([res?.data.savedUser])]

		setTotalPages(res?.data.totalPages)
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const updateUsers = async (user: IUsers) => {
	if (departmentInfo.name != "") {
		user.department = departmentInfo.name
		user.idDepartment = departmentInfo.id
		user.ramal = departmentInfo.ramal
	}

	const res: any = await updateUser(user, userId.value)

	if (res?.status == 200) {
		parseUpdateUser([res?.data.user])
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const deleteUsers = async () => {
	showLoading.value = true

	const res: any = await deleteUser(userId.value)

	if (res?.status == 200) {
		await getAllUsersByPage(page.value, itemsPerPage.value)

		await getAllUsernames()
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const selectTheDepartmentToCreateTheManager = async (department: string) => {
	const departmentMatch = departments.value.find((d) => d.name === department)

	Object.assign(departmentInfo, departmentMatch)
}

const selectTheDepartmentToCreateTheCollaborator = () => {
	const department = departmentStore.getDepartment

	Object.assign(departmentInfo, department)
}

const getAllDepartment = async () => {
	const res: any = await takeAllDepartments(idCompany.value)

	if (res?.status == 200) {
		allDepartments.value = res?.data.map((d: any) => d.name)

		departments.value = parseDepartment(res?.data)

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
		usernames.value = res?.data.map((n: any) =>
			n.username == undefined ? n.email : n.username
		)

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
		users.value = parseUser(res?.data.users)

		setTotalPages(res?.data.totalPages)
	} else if (res?.status == 404) {
		users.value = []
	} else {
		handleApiResponse(res?.response.data.message)
		showNotificationModal.value = true
	}

	showLoading.value = false
}

const parseUser = (data: any[]) => {
	const parsedData = data.map((d) => {
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

	return parsedData
}

const parseUpdateUser = (data: any[]) => {
	const user = users.value.find((d) => d.id == data[0]._id)

	if (user) {
		const index = users.value.indexOf(user)

		users.value[index] = parseUser(data)[0]
	}
}

const setTotalPages = (pages: number) => {
	totalPages.value = []

	for (let i = 0; i <= pages - 1; i++) {
		totalPages.value.push(i)
	}

	console.log("tp", totalPages.value)
}

const getUserDepartment = () => {
	userDepartment.value = departmentStore.getIdDepartment
	selectTheDepartmentToCreateTheCollaborator()
}

const loadsAllUsersAndTheirInfo = async () => {
	idCompany.value = idCompanyStore.getIdCompany

	await getAllUsersByPage(page.value, itemsPerPage.value)

	if (hasPermission([AuthorizationUser.ADMIN])) {
		await getAllDepartment()
	}

	await getAllUsernames()
}

onMounted(() => {
	permission.value = getPermission()

	if (hasPermission([AuthorizationUser.MANAGER])) {
		getUserDepartment()
	}

	loadsAllUsersAndTheirInfo()
})
</script>
