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
		:deleteFunction="deleteSediments"
		title="Confirmar exclusão"
		sub-title="Tem certeza que deseja excluir esse resíduo?" />

	<SedimentsCreateOrUpdateModal
		v-if="showSedimentsModal"
		:type-action="typeAction"
		:closeSedimentsModal="() => (showSedimentsModal = false)"
		:showButton="showButton"
		:classifications="classifications"
		:states="states"
		:risk="risk"
		:createOrUpdateSediments="createOrUpdateSediments"
		:validateDataToCreateSediments="validateDataToCreateSediments"
		:validateDataToUpdateSediments="validateDataToUpdateSediments" />

	<Sediments
		:headers="headers"
		:actions="actions"
		:sediments="sediments"
		:content="content"
		:itemsPerPage="itemsPerPage"
		:select-sediments="selectSediments"
		:show-delete-modal="openDeleteModal"
		:openSedimentsModal="openSedimentsModal"
		:sedimentsFilterCleaning="sedimentsFilterCleaning" />

	<div
		class="flex justify-between items-center ml-10 w-full"
		v-if="totalPages.length > 1 || itemsPerPage > 10">
		<ItemsPerPage @setItemsPerPage="setItemsPerPage" />

		<Pagination
			:current-page="page"
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
import SedimentsCreateOrUpdateModal from "@/components/organisms/SedimentsCreateOrUpdateModal.vue"
import { ref } from "vue"
import { IMessage, ISediments, ISedimentsApi } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"
import { onMounted } from "vue"
import { setIdCompany } from "@/store/setIdCompany"
import { setDepartment } from "@/store/setDepartment"
import {
	createSedmentsApi,
	getNameOfSedimentsApi,
	getSedimentsByPageApi,
} from "@/api/sediments"

const idCompanyStore = setIdCompany()

const departmentStore = setDepartment()

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
	"Sem risco",
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
let sedimentId = ref()
let idCompany = ref("")
let idDepartment = ref("")

const handleApiResponse = (message: IMessage) => {
	title.value = message.title
	subTitle.value = message.subTitle
}

const changeVariableState = () => {
	showDeleteModal.value = false
	showNotificationModal.value = true

	showSedimentsModal.value = false
	showLoading.value = false
	showButton.value = false
}

const closeModal = () => {
	showNotificationModal.value = false
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
	console.log("clear")
}

const deleteSediments = () => {
	console.log("deleted")
}

const validateDataToCreateSediments = (sediment: ISediments) => {
	let validate = []

	for (const key in sediment) {
		if (
			sediment[key as keyof ISediments] != undefined &&
			sediment[key as keyof ISediments] != ""
		) {
			validate.push(key)
		}
	}

	showButton.value = validate.length == 5 ? true : false
}

const validateDataToUpdateSediments = () => {
	console.log("validate")
}

const createOrUpdateSediments = (sediment: ISediments, action: string) => {
	showLoading.value = true

	if (action == Actions.SAVE) {
		createSediments(sediment)
	} else {
		console.log("update")
	}
}

const createSediments = async (sediment: ISediments) => {
	sediment.idCompany = idCompany.value
	sediment.idDepartment = idDepartment.value

	const res: any = await createSedmentsApi(sediment)

	console.log("resid", res)

	if (res?.status == 201) {
		content.value = [...content.value, ...parseData([res?.data.createSediment])]

		setTotalPages(res?.data.totalPages)
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const getSedimentsByPage = async (
	currentPage: number,
	itemsPerPage: number
) => {
	showLoading.value = true

	content.value = []

	const res: any = await getSedimentsByPageApi(
		currentPage,
		itemsPerPage,
		idCompany.value,
		idDepartment.value
	)

	if (res?.status == 200) {
		content.value = parseData(res?.data.sediments)

		setTotalPages(res?.data.totalPages)
	} else if (res?.status == 404) {
		content.value = []
	} else {
		handleApiResponse(res?.data.message)

		showNotificationModal.value = true
	}

	showLoading.value = false
}

const getNameOfSediments = async () => {
	const res: any = await getNameOfSedimentsApi(
		idCompany.value,
		idDepartment.value
	)

	if (res?.status == 200) sediments.value = res?.data.nameOfSediments
}

const setTotalPages = (pages: number) => {
	totalPages.value = []

	for (let i = 0; i <= pages - 1; i++) {
		totalPages.value.push(i)
	}
}

const parseData = (data: any[]): Array<ISediments> => {
	const parsedData = data.map((d: ISedimentsApi) => {
		return {
			name: d.name,
			classification: d.classification,
			risk: d.risk,
			state: d.state,
			packaging: d.packaging,
			id: d._id,
			idCompany: d.idCompany,
			idDepartment: d.idDepartment,
		}
	})

	return parsedData
}

const getId = () => {
	idCompany.value = idCompanyStore.getIdCompany
	idDepartment.value = departmentStore.getIdDepartment
}

onMounted(async () => {
	getId()

	await getSedimentsByPage(page.value, itemsPerPage.value)

	await getNameOfSediments()
})
</script>
