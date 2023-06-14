<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="(value: boolean) => showNotificationModal = value"
		v-if="showNotificationModal" />

	<DepartmentModal
		v-if="showDepartmentModal"
		:typeAction="typeAction"
		:closeDepartmentModal="() => (showDepartmentModal = false)"
		:create-or-update-department="createOrUpdateDepartment" />

	<DeleteModal
		v-if="showDeleteModal"
		:closeDeleteModal="() => (showDeleteModal = false)"
		:deleteFunction="deleteDepartment" />

	<Departments
		:actions="actions"
		:content="departments"
		:departments="departmentsName"
		:headers="headers"
		:showDeleteModal="openDeleteModal"
		:selectDepartment="selectDepartment"
		:openDepartmentModal="(action: string) => (showDepartmentModal = true, typeAction = action)" />

	<div class="flex justify-between items-center ml-8 w-full">
		<ItemsPerPage @setItemsPerPage="setItemsPerPage" />

		<Pagination
			:pageCount="totalPages.length"
			:items="totalPages"
			@paginate="setPagination" />
	</div>
</template>
<script setup lang="ts">
import Departments from "@/components/organisms/Departments.vue"
import Pagination from "../components/molecules/Pagination.vue"
import ItemsPerPage from "../components/molecules/ItemsPerPage.vue"
import DeleteModal from "@/components/molecules/DeleteModal.vue"
import Loading from "@/components/molecules/Loading.vue"
import DepartmentModal from "@/components/molecules/DepartmentCreateOrUpdateModal.vue"
import { ref } from "vue"
import { IDepartment } from "@/utils/interfaces"
import { createDepartment, takeAllDepartments } from "@/api/department"
import Notification from "@/components/molecules/Notification.vue"
import { Actions, Messages } from "@/utils/enum"
import { onMounted } from "vue"

let showDeleteModal = ref(false)
let showLoading = ref(false)
let showDepartmentModal = ref(false)
let typeAction = ref("Cadastrar")
let idDepartment = ref("")
let showNotificationModal = ref(false)
let title = ref("")
let subTitle = ref("")
let page = ref(1)
let itemsPerPage = ref(10)
let departments = ref<IDepartment[]>([])
let departmentsName = ref<string[]>([])
let totalPages = ref<number[]>([])

const headers = ["Departamento", "Responsável", "Ramal", "Email"]

const actions = ["Atualizar", "Deletar"]

const content = [
	{
		id: "djK13",
		name: "Aumoxarifado",
		responsible: "Douglas",
		ramal: 2329,
		email: "douglas_fernando2023_legal@gmail.com",
	},
]

const selectDepartment = (department: string) => {
	console.log(department)
}

const setPagination = (currentPage: number) => {
	console.log(currentPage)
}

const setItemsPerPage = (value: number) => {
	console.log(value)
}

const openDeleteModal = (id: string) => {
	idDepartment.value = id
	showDeleteModal.value = true
}

const deleteDepartment = () => {
	console.log("deletado")
}

const createOrUpdateDepartment = async (
	department: IDepartment,
	action: string
) => {
	showLoading.value = true

	if (action == Actions.SAVE) {
		await createDepartments(department)
	}
}

const createDepartments = async (department: IDepartment) => {
	const res: any = await createDepartment(department)

	if (res?.status == 201) {
		title.value = Messages.TITLE_REGISTER
		subTitle.value = Messages.SUBTITLE_REGISTER
	} else {
		title.value = Messages.TITLE_ERROR_REGISTER
		subTitle.value = Messages.SUBTITLE_ERROR_REGISTER
	}

	showDepartmentModal.value = false
	showLoading.value = false
	showNotificationModal.value = true
}

const getAllDepartments = async () => {
	showLoading.value = true

	const res: any = await takeAllDepartments(page.value, itemsPerPage.value)

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

const setTotalPages = (pages: number) => {
	totalPages.value = []

	for (let i = 0; i <= pages - 1; i++) {
		totalPages.value.push(i)
	}
}

const parseDepartment = (data: any[]) => {
	console.log("ola", data)

	departmentsName.value = data.map((n) => n.name)

	departments.value = data.map((d) => {
		return {
			name: d.name,
			responsible: d.responsible,
			ramal: d.ramal,
			email: d.email,
			id: d.id,
		}
	})

	console.log("de", departments.value)
}

onMounted(async () => {
	await getAllDepartments()
})
</script>
