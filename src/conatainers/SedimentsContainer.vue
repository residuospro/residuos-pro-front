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
		:deleteFunction="deleteSediments"
		title="Confirmar exclusão"
		sub-title="Tem certeza que deseja excluir esse resíduo?" />

	<SedimentsCreateOrUpdateModal
		v-if="showSedimentsModal"
		:type-action="typeAction"
		:closeSedimentsModal="() => (showSedimentsModal = false)"
		:createOrUpdateSediments="createOrUpdateSediments"
		:validateDataToCreateSediments="validateDataToCreateSediments"
		:validateDataToUpdateSediments="validateDataToUpdateSediments"
		:showButton="showButton"
		:classifications="classifications"
		:states="states"
		:risk="risk" />

	<Sediments
		:headers="headers"
		:actions="actions"
		:sediments="sediments"
		:content="content"
		:select-sediments="selectSediments"
		:show-delete-modal="openDeleteModal"
		:openSedimentsModal="openSedimentsModal"
		:sedimentsFilterCleaning="sedimentsFilterCleaning" />

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
import Sediments from "@/components/organisms/Sediments.vue"
import Loading from "@/components/molecules/Loading.vue"
import Notification from "@/components/molecules/Notification.vue"
import Pagination from "@/components/molecules/Pagination.vue"
import ItemsPerPage from "@/components/molecules/ItemsPerPage.vue"
import DeleteModal from "@/components/molecules/DeleteModal.vue"
import SedimentsCreateOrUpdateModal from "@/components/molecules/SedimentsCreateOrUpdateModal.vue"
import { ref } from "vue"
import { ISediments } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"

const headers = [
	"Nome",
	"Classificação",
	"Risco Associado",
	"Estado",
	"Acondicionamento",
]

const states = ["Líquido", "Sólido", "Gasoso"]

const classifications = ["Classe I", "Classe II A", "Classe II B"]

const risk = [
	"Inflamável",
	"Explosivo",
	"Oxidante",
	"Corrosivo",
	"Tóxico",
	"Carcinogênico/Mutagênico",
]

const actions = ["Atualizar", "Deletar"]

let showDeleteModal = ref(false)
let showSedimentsModal = ref(false)
let showLoading = ref(false)
let showNotificationModal = ref(false)
let showButton = ref(false)
let typeAction = ref("Cadastrar")
let sediments = ref<string[]>([])
let content = ref<any[]>([])
let title = ref("")
let subTitle = ref("")
let page = ref(1)
let itemsPerPage = ref(10)
let totalPages = ref<number[]>([])
let paginationKey = ref(0)
let itemsPerPageKey = ref(0)
let sedimentId = ref()

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

const selectSediments = () => {
	console.log("selected")
}

const openDeleteModal = (id: string | undefined) => {
	showDeleteModal.value = true
}

const openSedimentsModal = (action: string, id?: string) => {
	showSedimentsModal.value = true
	typeAction.value = action
	sedimentId.value = id
}

const sedimentsFilterCleaning = () => {
	console.log("clear ")
}

const deleteSediments = () => {
	console.log("deleted")
}

const validateDataToCreateSediments = () => {
	console.log("validate")
}

const validateDataToUpdateSediments = () => {
	console.log("validate")
}

const createOrUpdateSediments = (user: ISediments, action: string) => {
	showLoading.value = true

	if (action == Actions.SAVE) {
		console.log("create")
	} else {
		console.log("update")
	}
}
</script>
