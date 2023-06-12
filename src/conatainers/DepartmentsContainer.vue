<template>
	<Loading v-if="showLoading" />

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
		:content="content"
		:departments="departments"
		:headers="headers"
		:showDeleteModal="openDeleteModal"
		:selectDepartment="selectDepartment"
		:openDepartmentModal="(action: string) => (showDepartmentModal = true, typeAction = action)" />

	<div class="flex justify-between items-center ml-8 w-full">
		<ItemsPerPage @setItemsPerPage="setItemsPerPage" />

		<Pagination
			:pageCount="10"
			:items="[0, 1, 2, 4, 5]"
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

let showDeleteModal = ref(false)
let showLoading = ref(false)
let showDepartmentModal = ref(false)
let typeAction = ref("Cadastrar")
let idDepartment = ref("")

const headers = ["Departamento", "Responsável", "Ramal", "Email"]
const departments = ["foo", "bar", "fizz", "buzz"]

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

const createOrUpdateDepartment = (department: IDepartment, action: string) => {
	console.log("d", department, action)
}
</script>
