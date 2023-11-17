<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="closeModal"
		v-if="showNotificationModal" />

	<DepartmentModal
		v-if="showDepartmentModal"
		:showButton="showButton"
		:validateDataToUpdateDepartment="validateDataToUpdateDepartment"
		:validateDataToCreateDepartment="validateDataToCreateDepartment"
		:typeAction="typeAction"
		:closeDepartmentModal="closeDepartmentModal"
		:create-or-update-department="createOrUpdateDepartment" />

	<DeleteModal
		v-if="showDeleteModal"
		:closeDeleteModal="() => (showDeleteModal = false)"
		:deleteFunction="deleteDepartment"
		title="Confirmar Exclusão"
		sub-title="Ao excluir um departamento, você excluirá todos os usuários do mesmo, tem certeza disso ?" />

	<Departments
		:actions="actions"
		:content="paginatedItems"
		:departments="departmentsName"
		:headers="headers"
		:itemsPerPage="Number(itemsPerPage)"
		:showDeleteModal="openDeleteModal"
		:filterDepartment="filterDepartment"
		:departmentFilterCleaning="departmentFilterCleaning"
		:openDepartmentModal="openDepartmentModal" />

	<div
		class="w-full mt-4 ml-10"
		v-if="totalPages.length > 1 || itemsPerPage > 10">
		<ItemsPerPage @setItemsPerPage="setItemsPerPage" class="float-left" />

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
import Departments from "@/components/organisms/Departments.vue"
import Pagination from "../components/organisms/Pagination.vue"
import ItemsPerPage from "../components/molecules/ItemsPerPage.vue"
import DeleteModal from "@/components/molecules/DeleteModal.vue"
import Loading from "@/components/molecules/Loading.vue"
import DepartmentModal from "@/components/organisms/DepartmentCreateOrUpdateModal.vue"
import { computed, ref } from "vue"
import { IDepartment, IMessage } from "@/utils/interfaces"
import {
	createDepartment,
	takeDepartmentsByPage,
	takeAllDepartments,
	deleteDepartments,
	updateDepartment,
	takeDepartmentsByName,
} from "@/api/department"
import Notification from "@/components/molecules/Notification.vue"
import { Actions } from "@/utils/enum"
import { onMounted } from "vue"
import { setIdCompany } from "@/store/setIdCompany"
import { departmentStore } from "@/store/departmentStore"
import { getPermission } from "@/utils/permissions"
import useProps from "../context/useProps"
import { socket } from "@/socket"

const { parseDepartment, setTotalPages } = useProps()

const idCompanyStore = setIdCompany()

const department_store = departmentStore()

let showDeleteModal = ref(false)
let showLoading = ref(false)
let showDepartmentModal = ref(false)
let showNotificationModal = ref(false)
let showButton = ref(false)
let typeAction = ref("Cadastrar")
let idDepartment = ref()
let title = ref("")
let subTitle = ref("")
let page = ref(1)
let itemsPerPage = ref(10)
let departments = ref<IDepartment[]>([])
let permission = ref<string[]>([])
let departmentsName = ref<string[]>([])
let totalPages = ref<number[]>([])
let departmentSelected = ref(false)
let idCompany = ref("")
let isModified = ref(false)

const headers = ["Departamento", "Responsável", "Ramal", "Email"]

const actions = ["Atualizar", "Deletar"]

const callGetDepartmentsByPage = async (page: number, itemsPerPage: number) => {
	showLoading.value = true

	if (department_store.getDepartment.length == 0) {
		await getDepartmentsByPage(page, itemsPerPage)
	} else {
		departments.value = department_store.getDepartment
		totalPages.value = department_store.getTotalPages
	}

	showLoading.value = false
}

const setPagination = (currentPage: number) => {
	if (page.value != currentPage) {
		page.value = currentPage
	}
}

const setItemsPerPage = (value: number) => {
	if (itemsPerPage.value != value) {
		itemsPerPage.value = value

		totalPages.value = setTotalPages(
			Math.ceil(departments.value.length / value)
		)
	}
}

const paginatedItems = computed(() => {
	const department = departments.value

	const currentPage = page.value

	let items = itemsPerPage.value

	if (typeof items === "string") {
		items = parseInt(items)
	}

	const startIndex = (currentPage - 1) * items
	const endIndex = startIndex + items

	return department.slice(startIndex, endIndex)
})

const openDeleteModal = (id: string) => {
	idDepartment.value = id
	showDeleteModal.value = true
}

const openDepartmentModal = (action: string, id?: string) => {
	showDepartmentModal.value = true
	typeAction.value = action
	idDepartment.value = id
}

const closeDepartmentModal = (event: Event) => {
	event.stopPropagation()
	showDepartmentModal.value = false
}

const closeModal = () => {
	getAllDepartment()

	showNotificationModal.value = false
}

const handleApiResponse = (message: IMessage) => {
	title.value = message.title
	subTitle.value = message.subTitle
}

const validateDataToCreateDepartment = (department: IDepartment) => {
	let validate = []

	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(department.email)

	for (const key in department) {
		if (department[key as keyof IDepartment] != "" && regex) {
			validate.push(key)
		}
	}

	if (validate.length == 4) showButton.value = true
	else showButton.value = false
}

const validateDataToUpdateDepartment = (department: IDepartment) => {
	let validate = []
	let regex = true

	for (const key in department) {
		if (department[key as keyof IDepartment] != "") {
			validate.push(key)
		}
	}

	if (department.email != "") {
		regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(department.email)
	}

	if (validate.length > 0 && regex) showButton.value = true
	else if (!regex) showButton.value = false
	else showButton.value = false
}

const createOrUpdateDepartment = (department: IDepartment, action: string) => {
	showLoading.value = true

	if (action == Actions.SAVE) {
		createDepartments(department)
	} else {
		updateDepartments(department)
	}
}

const updateDepartments = async (departament: IDepartment) => {
	const res: any = await updateDepartment(
		departament,
		idDepartment.value,
		idCompany.value
	)

	if (res?.status == 201) {
		parseUpdateDepartment([res?.data.department])
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const createDepartments = async (department: IDepartment) => {
	const res: any = await createDepartment(department, idCompany.value)

	if (res?.status == 201) {
		departments.value = [
			...departments.value,
			...parseDepartment([res?.data.department]),
		]

		totalPages.value = setTotalPages(res?.data.totalPages)

		department_store.setDepartments(departments.value)
		department_store.setTotalPages(totalPages.value)
		department_store.setModifiedDepartment(true)

		isModified.value = true
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const deleteDepartment = async () => {
	showLoading.value = true

	const res: any = await deleteDepartments(idDepartment.value)

	if (res?.status == 201) {
		await getDepartmentsByPage(page.value, itemsPerPage.value)

		await getAllDepartment()
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const changeVariableState = () => {
	showDeleteModal.value = false
	showNotificationModal.value = true

	showDepartmentModal.value = false
	showLoading.value = false
	showButton.value = false
}

const getDepartmentsByPage = async (
	currentPage: number,
	itemsPerPage: number
) => {
	const res: any = await takeDepartmentsByPage(
		currentPage,
		itemsPerPage,
		idCompany.value
	)

	if (res?.status == 200) {
		departments.value = []

		departments.value = parseDepartment(res?.data.departments)

		totalPages.value = setTotalPages(res?.data.totalPages)
	} else if (res?.status == 404) {
		departments.value = []

		totalPages.value = []
	} else {
		handleApiResponse(res?.response?.data?.message)

		showNotificationModal.value = true
	}

	department_store.setDepartments(departments.value)
	department_store.setTotalPages(totalPages.value)
}

const getAllDepartment = async () => {
	const res: any = await takeAllDepartments(idCompany.value)

	if (res?.status == 200)
		departmentsName.value = res?.data.map((n: any) => n.name)
}

const departmentFilterCleaning = () => {
	if (departmentSelected.value) {
		departments.value = []

		callGetDepartmentsByPage(page.value, itemsPerPage.value)

		departmentSelected.value = false
	}
}

const selectDepartment = async (department: string) => {
	if (department) {
		showLoading.value = true

		const res: any = await takeDepartmentsByName(department, idCompany.value)

		if (res?.status == 200) {
			departments.value = []

			departments.value = parseDepartment([res?.data])

			totalPages.value = []
		} else {
			handleApiResponse(res?.data.message)
		}

		showLoading.value = false
	}
}

const filterDepartment = async (department: string) => {
	departmentSelected.value = true

	departments.value = departments.value.filter((d) => d.name == department)

	if (departments.value.length == 0) selectDepartment(department)
}

const parseUpdateDepartment = (data: any[]) => {
	const updateDepartment = departments.value.find((d) => d.id == data[0]._id)

	if (updateDepartment) {
		const index = departments.value.indexOf(updateDepartment)

		departments.value[index] = parseDepartment(data)[0]
	}
}

const getIdCompany = async () => {
	idCompany.value = idCompanyStore.getIdCompany

	callGetDepartmentsByPage(page.value, itemsPerPage.value)

	await getAllDepartment()
}

onMounted(() => {
	permission.value = getPermission()

	getIdCompany()
})
</script>
