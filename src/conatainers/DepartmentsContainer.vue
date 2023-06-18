<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="(value: boolean) => showNotificationModal = value"
		v-if="showNotificationModal" />

	<DepartmentModal
		v-if="showDepartmentModal"
		:showButton="showButton"
		:validateDataToUpdateDepartment="validateDataToUpdateDepartment"
		:validateDataToCreateDepartment="validateDataToCreateDepartment"
		:typeAction="typeAction"
		:closeDepartmentModal="() => (showDepartmentModal = false)"
		:create-or-update-department="createOrUpdateDepartment" />

	<DeleteModal
		v-if="showDeleteModal"
		:closeDeleteModal="() => (showDeleteModal = false)"
		:deleteFunction="deleteDepartment"
		title="Confirmar Exclusão"
		sub-title="Ao excluir um departamento, você excluirá todos os usuários do mesmo, tem certeza disso ?" />

	<Departments
		:actions="actions"
		:content="departments"
		:departments="departmentsName"
		:headers="headers"
		:showDeleteModal="openDeleteModal"
		:selectDepartment="selectDepartment"
		:departmentFilterCleaning="departmentFilterCleaning"
		:openDepartmentModal="openDepartmentModal" />

	<div
		class="flex justify-between items-center ml-10 w-full"
		v-if="totalPages.length > 1">
		<ItemsPerPage @setItemsPerPage="setItemsPerPage" />

		<Pagination
			:pageCount="totalPages.length"
			:items="totalPages"
			@paginate="setPagination" />
	</div>
</template>
<script setup lang="ts">
/* eslint-disable no-useless-escape */
import Departments from "@/components/organisms/Departments.vue"
import Pagination from "../components/molecules/Pagination.vue"
import ItemsPerPage from "../components/molecules/ItemsPerPage.vue"
import DeleteModal from "@/components/molecules/DeleteModal.vue"
import Loading from "@/components/molecules/Loading.vue"
import DepartmentModal from "@/components/molecules/DepartmentCreateOrUpdateModal.vue"
import { ref } from "vue"
import { IDepartment } from "@/utils/interfaces"
import {
	createDepartment,
	takeDepartmentsByPage,
	takeAllDepartments,
	takeDepartmentsByName,
	deleteDepartments,
	updateDepartment,
} from "@/api/department"
import Notification from "@/components/molecules/Notification.vue"
import { Actions, Messages } from "@/utils/enum"
import { onMounted } from "vue"

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
let departmentsName = ref<string[]>([])
let totalPages = ref<number[]>([])
let departmentSelected = ref(false)

const headers = ["Departamento", "Responsável", "Ramal", "Email"]

const actions = ["Atualizar", "Deletar"]

const setPagination = (currentPage: number) => {
	page.value = currentPage
	getDepartmentsByPage(currentPage, itemsPerPage.value)
}

const setItemsPerPage = (value: number) => {
	itemsPerPage.value = value
	getDepartmentsByPage(page.value, value)
}

const openDeleteModal = (id: string) => {
	idDepartment.value = id
	showDeleteModal.value = true
}

const openDepartmentModal = (action: string, id?: string) => {
	showDepartmentModal.value = true
	typeAction.value = action
	idDepartment.value = id
}

const deleteDepartment = async () => {
	showLoading.value = true

	const res: any = await deleteDepartments(idDepartment.value)

	if (res?.status == 200) {
		title.value = Messages.TITLE_DELETE_REGISTER
		subTitle.value = Messages.SUBTITLE_DELETE_REGISTER
		getDepartmentsByPage(page.value, itemsPerPage.value)
	} else {
		title.value = Messages.TITLE_ERROR_DELETE_REGISTER
		subTitle.value = Messages.SUBTITLE_ERROR_DELETE_REGISTER
	}

	showDeleteModal.value = false
	showNotificationModal.value = true
	showLoading.value = false
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
		if (department[key as keyof IDepartment] != "" && key !== "email") {
			validate.push(key)
		}
	}

	if (department.email != "") {
		regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(department.email)
	}

	if (validate.length >= 1 && regex) showButton.value = true
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
	const res: any = await updateDepartment(departament, idDepartment.value)

	if (res?.status == 201) {
		title.value = Messages.TITLE_UPDATE_REGISTER
		subTitle.value = Messages.SUBTITLE_UPDATE_REGISTER
		getDepartmentsByPage(page.value, itemsPerPage.value)
	} else {
		title.value = Messages.TITLE_ERROR_UPDATE_REGISTER
		subTitle.value = Messages.SUBTITLE_ERROR_UPDATE_REGISTER
		showLoading.value = false
	}

	showDepartmentModal.value = false
	showNotificationModal.value = true
}

const createDepartments = async (department: IDepartment) => {
	const res: any = await createDepartment(department)

	if (res?.status == 201) {
		title.value = Messages.TITLE_REGISTER
		subTitle.value = Messages.SUBTITLE_REGISTER
		getDepartmentsByPage(page.value, itemsPerPage.value)
	} else {
		title.value = Messages.TITLE_ERROR_REGISTER
		subTitle.value = Messages.SUBTITLE_ERROR_REGISTER
		showLoading.value = false
	}

	showDepartmentModal.value = false
	showNotificationModal.value = true
}

const getDepartmentsByPage = async (page: number, itemsPerPage: number) => {
	showLoading.value = true

	const res: any = await takeDepartmentsByPage(page, itemsPerPage)

	if (res?.status == 200) {
		parseDepartment(res?.data.departments)
		setTotalPages(res?.data.totalPages)
	} else {
		title.value = Messages.TITLE_ERROR
		subTitle.value = Messages.SUBTITLE_ERROR
		showNotificationModal.value = true
	}

	showLoading.value = false
}

const getAllDepartment = async () => {
	const res: any = await takeAllDepartments()

	if (res?.status == 200)
		departmentsName.value = res.data.map((n: any) => n.name)
}

const setTotalPages = (pages: number) => {
	totalPages.value = []

	for (let i = 0; i <= pages - 1; i++) {
		totalPages.value.push(i)
	}
}

const departmentFilterCleaning = () => {
	if (departmentSelected.value) {
		getDepartmentsByPage(page.value, itemsPerPage.value)
		departmentSelected.value = false
	}
}

const selectDepartment = async (department: string) => {
	showLoading.value = true

	departmentSelected.value = true

	const res: any = await takeDepartmentsByName(department)

	if (res?.status == 200) {
		parseDepartment([res.data])
		totalPages.value = []
	} else {
		title.value = Messages.TITLE_ERROR
		subTitle.value = Messages.SUBTITLE_ERROR
	}

	showLoading.value = false
}

const parseDepartment = (data: any[]) => {
	departments.value = data.map((d) => {
		return {
			name: d.name,
			responsible: d.responsible,
			ramal: d.ramal,
			email: d.email,
			id: d._id,
		}
	})
}

onMounted(() => {
	getDepartmentsByPage(page.value, itemsPerPage.value)
	getAllDepartment()
})
</script>
