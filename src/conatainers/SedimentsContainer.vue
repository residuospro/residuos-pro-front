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
		:select-sediments="filterDepartment"
		:show-delete-modal="openDeleteModal"
		:openSedimentsModal="openSedimentsModal"
		:sedimentsFilterCleaning="sedimentsFilterCleaning" />

	<div
		class="w-full mt-4 ml-10"
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
import Sediments from "@/components/organisms/Sediments.vue"
import Loading from "@/components/molecules/Loading.vue"
import Notification from "@/components/molecules/Notification.vue"
import Pagination from "@/components/organisms/Pagination.vue"
import ItemsPerPage from "@/components/molecules/ItemsPerPage.vue"
import DeleteModal from "@/components/molecules/DeleteModal.vue"
import SedimentsCreateOrUpdateModal from "@/components/organisms/SedimentsCreateOrUpdateModal.vue"
import { ref } from "vue"
import { IMessage, ISediments, ISedimentsApi } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"
import { onMounted } from "vue"
import { setIdCompany } from "@/store/setIdCompany"
import { departmentStore } from "@/store/departmentStore"
import {
	createSedmentsApi,
	deleteSedimentApi,
	getNameOfSedimentsApi,
	getSedimentByNameApi,
	getSedimentsByPageApi,
	updateSedimentsApi,
} from "@/api/sediments"

const idCompanyStore = setIdCompany()

const getDepartmentStore = departmentStore()

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
let sedimentSelected = ref(false)
let content = ref<any[]>([])
let title = ref("")
let subTitle = ref("")
let page = ref(1)
let itemsPerPage = ref(10)
let totalPages = ref<number[]>([])
let sedimentId = ref()
let idCompany = ref("")
let idDepartment = ref("")

const callGetSedimentsByPage = async (page: number, itemsPerPage: number) => {
	showLoading.value = true

	await getSedimentsByPage(page, itemsPerPage)

	showLoading.value = false
}

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
	getNameOfSediments()
	showNotificationModal.value = false
}

const setPagination = (currentPage: number) => {
	if (page.value != currentPage) {
		page.value = currentPage
		callGetSedimentsByPage(currentPage, itemsPerPage.value)
	}
}

const setItemsPerPage = (value: number) => {
	if (itemsPerPage.value != value) {
		itemsPerPage.value = value
		callGetSedimentsByPage(page.value, value)
	}
}

const selectSediments = async (sediment: string) => {
	if (sediment) {
		showLoading.value = true

		const res: any = await getSedimentByNameApi(
			sediment,
			idCompany.value,
			idDepartment.value
		)

		if (res?.status == 200) {
			content.value = []
			totalPages.value = []

			content.value = parseData([res?.data])
		}

		showLoading.value = false

		sedimentSelected.value = true
	}
}

const filterDepartment = async (sediment: string) => {
	sedimentSelected.value = true

	content.value = content.value.filter((d) => d.name == sediment)

	if (content.value.length == 0) selectSediments(sediment)
}

const openDeleteModal = (id: string | undefined) => {
	showDeleteModal.value = true
	sedimentId.value = id
}

const openSedimentsModal = (action: string, id?: string) => {
	showSedimentsModal.value = true
	typeAction.value = action
	sedimentId.value = id
}

const sedimentsFilterCleaning = () => {
	if (sedimentSelected.value) {
		callGetSedimentsByPage(page.value, itemsPerPage.value)
		sedimentSelected.value = true
	}
}

const deleteSediments = async () => {
	showLoading.value = true

	const res: any = await deleteSedimentApi(sedimentId.value)

	if (res?.status == 201) {
		await getSedimentsByPage(page.value, itemsPerPage.value)

		await getNameOfSediments()
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
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

const validateDataToUpdateSediments = (sediment: ISediments) => {
	let validate = []

	for (const key in sediment) {
		if (
			sediment[key as keyof ISediments] != undefined &&
			sediment[key as keyof ISediments] != ""
		) {
			validate.push(key)
		}
	}

	showButton.value = validate.length >= 1 ? true : false
}

const createOrUpdateSediments = (sediment: ISediments, action: string) => {
	showLoading.value = true

	if (action == Actions.SAVE) {
		createSediments(sediment)
	} else {
		updateSediments(sediment)
	}
}

const createSediments = async (sediment: ISediments) => {
	sediment.idCompany = idCompany.value
	sediment.idDepartment = idDepartment.value

	const res: any = await createSedmentsApi(sediment)

	if (res?.status == 201) {
		content.value = [...content.value, ...parseData([res?.data.createSediment])]

		setTotalPages(res?.data.totalPages)
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const updateSediments = async (sediment: ISediments) => {
	sediment.idCompany = idCompany.value
	sediment.idDepartment = idDepartment.value

	const res: any = await updateSedimentsApi(sediment, sedimentId.value)

	if (res?.status == 201) {
		parseUpdateSediments([res?.data.updateSediment])
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const getSedimentsByPage = async (
	currentPage: number,
	itemsPerPage: number
) => {
	const res: any = await getSedimentsByPageApi(
		currentPage,
		itemsPerPage,
		idCompany.value,
		idDepartment.value
	)

	if (res?.status == 200) {
		content.value = []
		totalPages.value = []

		content.value = parseData(res?.data.sediments)

		setTotalPages(res?.data.totalPages)
	} else if (res?.status == 404) {
		content.value = []
	} else {
		handleApiResponse(res?.response.data.message)

		showNotificationModal.value = true
	}
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

const parseUpdateSediments = (data: any[]) => {
	const updateSediments = content.value.find((d) => d.id == data[0]._id)

	if (updateSediments) {
		const index = content.value.indexOf(updateSediments)

		content.value[index] = parseData(data)[0]
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
	idDepartment.value = getDepartmentStore.getIdDepartment!
}

onMounted(async () => {
	getId()

	await callGetSedimentsByPage(page.value, itemsPerPage.value)

	await getNameOfSediments()
})
</script>
