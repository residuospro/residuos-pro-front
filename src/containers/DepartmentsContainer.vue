<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="closeModal"
		v-if="showNotificationModal" />

	<WrapperModal
		v-if="showDepartmentModal"
		:closeModalOutside="() => (showDepartmentModal = false)">
		<DepartmentModal
			:validateDataToUpdateDepartment="validateDataToUpdateDepartment"
			:validateDataToCreateDepartment="validateDataToCreateDepartment"
			:typeAction="typeAction"
			:create-or-update-department="createOrUpdateDepartment">
			<ModalActionButtons
				:showButton="showButton"
				:closeModal="closeDepartmentModal" />
		</DepartmentModal>
	</WrapperModal>

	<ActionModal
		v-if="showDeleteModal"
		:closeDeleteModal="() => (showDeleteModal = false)"
		:confirm-action="deleteDepartment"
		title="Confirmar Exclusão"
		sub-title="Ao excluir um departamento, você excluirá todos os usuários do mesmo, tem certeza disso ?" />

	<Container type="page">
		<Wrapper type="header">
			<DepartmentFilter
				:departments="departmentsName"
				:filterDepartment="filterDepartment"
				:departmentFilterCleaning="departmentFilterCleaning" />

			<Button
				buttonType="submit"
				@click="openDepartmentModal(Actions.SAVE)"
				class="bg-white">
				<p class="text-v_dark_gray">Cadastrar</p>
			</Button>
		</Wrapper>

		<DepartmentTable
			:actions="actions"
			:content="departments"
			:itemsPerPage="Number(itemsPerPage)"
			:showDeleteModal="openDeleteModal"
			:openDepartmentModal="openDepartmentModal">
			<TableHead :headers="headers" action="Ajustar" />

			<EmptyTable :content="departments.length"
		/></DepartmentTable>

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
import DepartmentsView from "@/views/DepartmentsView.vue"
import DepartmentFilter from "@/components/molecules/DepartmentFilter.vue"
import Wrapper from "@/components/atoms/Wrapper.vue"
import WrapperPagination from "@/components/molecules/WrapperPagination.vue"
import ModalActionButtons from "@/components/molecules/ModalActionButtons.vue"
import WrapperModal from "@/components/molecules/WrapperModal.vue"
import DepartmentTable from "@/components/organisms/DepartmentTable.vue"
import TableHead from "@/components/molecules/TableHead.vue"
import EmptyTable from "@/components/molecules/EmptyTable.vue"
import Pagination from "../components/organisms/Pagination.vue"
import ItemsPerPage from "../components/molecules/ItemsPerPage.vue"
import ActionModal from "@/components/molecules/ActionModal.vue"
import Loading from "@/components/molecules/Loading.vue"
import Button from "@/components/atoms/Button.vue"
import DepartmentModal from "@/components/organisms/DepartmentsModal.vue"
import { computed, ref, watch, onMounted } from "vue"
import { IDepartment, IMessage } from "@/utils/interfaces"
import {
	createDepartment,
	takeDepartmentsByPage,
	deleteDepartments,
	updateDepartment,
} from "@/api/department"
import Notification from "@/components/molecules/NotificationModal.vue"
import { Actions } from "@/utils/enum"
import { getPermission } from "@/utils/permissions"
import useProps from "../context/useProps"
import { stores } from "@/store"
import { useHead } from "@vueuse/head"

useHead({
	title: "Resíduos Pro - Departamentos",
})

const { parseDepartment, setTotalPages } = useProps()

const { company_store, department_store } = stores()

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
let totalPages = ref<number[]>([])
let departmentsName = ref<string[]>([])
let resetComputed = ref(0)
let departmentSelected = ref(false)
let idCompany = ref("")

const headers = ["Departamento", "Ramal"]

const actions = ["Atualizar", "Deletar"]

const callGetDepartmentsByPage = async (
	currentPage: number,
	itemsPerPage: number
) => {
	showLoading.value = true

	if (department_store.getDepartments.length == 0) {
		await getDepartmentsByPage(currentPage, itemsPerPage)
	} else {
		resetComputed.value = new Date().getMilliseconds()
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
	}
}

const paginatedItems = computed(() => {
	const department = department_store.getDepartments

	resetComputed.value

	const totalPages = setTotalPages(
		Math.ceil(department.length / itemsPerPage.value)
	)

	const currentPage = page.value

	let items = itemsPerPage.value

	if (typeof items === "string") {
		items = parseInt(items)
	}

	const startIndex = (currentPage - 1) * items
	const endIndex = startIndex + items

	return { department: department.slice(startIndex, endIndex), totalPages }
})

watch(paginatedItems, () => {
	totalPages.value = paginatedItems.value.totalPages

	departments.value = paginatedItems.value.department

	getNameOfDepartments()

	department_store.setTotalPages(paginatedItems.value.totalPages)

	if (paginatedItems.value.department.length == 0) {
		page.value -= 1
	}

	if (paginatedItems.value.totalPages.length == 1) {
		page.value = 1
	}
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
	getNameOfDepartments()

	showNotificationModal.value = false
}

const handleApiResponse = (message: IMessage) => {
	title.value = message.title
	subTitle.value = message.subTitle
}

const validateDataToCreateDepartment = (department: IDepartment) => {
	let validate = []

	for (const key in department) {
		if (department[key as keyof IDepartment] != "") {
			validate.push(key)
		}
	}

	if (validate.length == 2) showButton.value = true
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

	if (res?.status == 201 || res?.status == 409) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	changeVariableState()
}

const createDepartments = async (department: IDepartment) => {
	const res: any = await createDepartment(
		department,
		idCompany.value,
		departments.value.length,
		permission.value
	)

	if (res?.status == 201 || res?.status == 409) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	changeVariableState()

	if (department_store.getDepartments.length == 0) {
		callGetDepartmentsByPage(page.value, itemsPerPage.value)
	}
}

const deleteDepartment = async () => {
	showLoading.value = true

	const res: any = await deleteDepartments(idDepartment.value, idCompany.value)

	if (res?.status == 201) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

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
		department_store.setDepartments(parseDepartment(res?.data.departments))

		department_store.setTotalPages(setTotalPages(res?.data.totalPages))
	} else if (res?.status == 404) {
		department_store.setDepartments([])

		department_store.setTotalPages([])
	} else {
		handleApiResponse(res?.response?.data?.message)

		showNotificationModal.value = true
	}
}

const getNameOfDepartments = async () => {
	departmentsName.value = department_store.getDepartments.map(
		(n: any) => n.name
	)
}

const departmentFilterCleaning = () => {
	if (departmentSelected.value) {
		departments.value = []

		callGetDepartmentsByPage(page.value, itemsPerPage.value)

		departmentSelected.value = false
	}
}

const filterDepartment = async (department: string) => {
	departmentSelected.value = true

	departments.value = department_store.getDepartments.filter(
		(d) => d.name == department
	)

	totalPages.value = setTotalPages(
		Math.ceil(departments.value.length / itemsPerPage.value)
	)
}

const getInfos = async () => {
	idCompany.value = company_store.getIdCompany

	callGetDepartmentsByPage(page.value, itemsPerPage.value)
}

onMounted(() => {
	permission.value = getPermission()

	getInfos()
})
</script>
