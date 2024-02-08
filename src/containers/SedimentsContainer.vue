<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="closeNotificationModal"
		v-if="showNotificationModal" />

	<ActionModal
		v-if="showDeleteModal"
		:closeDeleteModal="() => (showDeleteModal = false)"
		:confirm-action="deleteSediments"
		title="Confirmar exclusão"
		sub-title="Tem certeza que deseja excluir esse resíduo?" />

	<WrapperModal
		v-if="showSedimentsModal"
		:closeModalOutside="() => (showSedimentsModal = false)">
		<SedimentsModal
			:type-action="typeAction"
			:classifications="classifications"
			:states="states"
			:risk="risk"
			:createOrUpdateSediments="createOrUpdateSediments"
			:validateDataToCreateSediments="validateDataToCreateSediments"
			:validateDataToUpdateSediments="validateDataToUpdateSediments">
			<ModalActionButtons
				:showButton="showButton"
				:closeModal="closeSedimentsModal" />
		</SedimentsModal>
	</WrapperModal>

	<SedimentsView>
		<Wrapper type="header">
			<SedimentFilter
				:sedimentsName="sedimentsName"
				:select-sediments="filterSediments"
				:sedimentsFilterCleaning="sedimentsFilterCleaning" />

			<Button
				buttonType="submit"
				@click="openSedimentsModal(Actions.SAVE)"
				class="bg-white">
				<p class="text-v_dark_gray">Cadastrar</p>
			</Button>
		</Wrapper>

		<SedimentTable
			:headers="headers"
			:actions="actions"
			:content="sediments"
			:show-delete-modal="openDeleteModal"
			:openSedimentsModal="openSedimentsModal" />

		<WrapperPagination :totalPages="totalPages" :itemsPerPage="itemsPerPage">
			<ItemsPerPage @setItemsPerPage="setItemsPerPage" class="float-left" />

			<Pagination
				:current-page="page"
				:pageCount="totalPages.length"
				:items="totalPages"
				@paginate="setPagination"
				class="float-right" />
		</WrapperPagination>
	</SedimentsView>
</template>

<script setup lang="ts">
/* eslint-disable no-useless-escape */
import SedimentsView from "@/views/SedimentsView.vue"
import SedimentFilter from "@/components/molecules/SedimentFilter.vue"
import Wrapper from "@/components/atoms/Wrapper.vue"
import WrapperPagination from "@/components/molecules/WrapperPagination.vue"
import ModalActionButtons from "@/components/molecules/ModalActionButtons.vue"
import WrapperModal from "@/components/molecules/WrapperModal.vue"
import SedimentTable from "@/components/organisms/SedimentTable.vue"
import Loading from "@/components/molecules/Loading.vue"
import Button from "@/components/atoms/Button.vue"
import Notification from "@/components/molecules/NotificationModal.vue"
import Pagination from "@/components/organisms/Pagination.vue"
import ItemsPerPage from "@/components/molecules/ItemsPerPage.vue"
import ActionModal from "@/components/molecules/ActionModal.vue"
import SedimentsModal from "@/components/organisms/SedimentsModal.vue"
import { Ref, computed, ref, watch } from "vue"
import { IMessage, ISediments } from "@/utils/interfaces"
import { Actions } from "@/utils/enum"
import { onMounted } from "vue"
import {
	createSedmentsApi,
	deleteSedimentApi,
	getSedimentsByPageApi,
	updateSedimentsApi,
} from "@/api/sediments"
import useProps from "@/context/useProps"
import { stores } from "@/store"

const { setTotalPages, parseSediments } = useProps()

const { sediment_store, department_store, company_store } = stores()

const headers = ["Nome", "Classificação", "Risco Associado", "Estado"]

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
let sedimentsName = ref<Array<string | undefined>>([])
let sedimentSelected = ref(false)
let sediments = ref<ISediments[]>([])
let title = ref("")
let subTitle = ref("")
let page = ref(1)
let itemsPerPage = ref(10)
let totalPages = ref<number[]>([])
let sedimentId = ref()
let idDepartment = ref<string | undefined>("")
let resetComputed = ref(0)
let idCompany = ref("")

const callGetSedimentsByPage = async (
	currentPage: number,
	itemsPerPage: number
) => {
	showLoading.value = true

	if (sediment_store.getSediments.length == 0) {
		await getSedimentsByPage(currentPage, itemsPerPage)
	} else {
		resetComputed.value = new Date().getMilliseconds()
	}

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

const closeNotificationModal = () => {
	getNameOfSediments()
	showNotificationModal.value = false
}

const closeSedimentsModal = (event: Event) => {
	event.stopPropagation()
	showSedimentsModal.value = false
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

const filterSediments = async (sediment: string) => {
	sedimentSelected.value = true

	sediments.value = sediments.value.filter((d) => d.name == sediment)
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

const paginatedItems = computed(() => {
	resetComputed.value

	const sediment = sediment_store.getSediments

	const totalPages = setTotalPages(
		Math.ceil(sediment.length / itemsPerPage.value)
	)

	const currentPage = page.value

	let items = itemsPerPage.value

	if (typeof items === "string") {
		items = parseInt(items)
	}

	const startIndex = (currentPage - 1) * items
	const endIndex = startIndex + items

	return { sediment: sediment.slice(startIndex, endIndex), totalPages }
})

watch(paginatedItems, () => {
	totalPages.value = paginatedItems.value.totalPages

	sediments.value = paginatedItems.value.sediment

	getNameOfSediments()

	sediment_store.setTotalPages(paginatedItems.value.totalPages)

	if (paginatedItems.value.sediment.length == 0) {
		page.value -= 1
	}

	if (paginatedItems.value.totalPages.length == 1) {
		page.value = 1
	}
})

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

	showButton.value = validate.length == 4 ? true : false
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
	sediment.totalItems = String(sediment_store.getSediments.length)

	const res: any = await createSedmentsApi(sediment)

	if (res?.status == 201 || res?.status == 409) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	changeVariableState()

	if (sediment_store.getSediments.length == 0) {
		callGetSedimentsByPage(page.value, itemsPerPage.value)
	}
}

const updateSediments = async (sediment: ISediments) => {
	sediment.idCompany = idCompany.value
	sediment.idDepartment = idDepartment.value

	const res: any = await updateSedimentsApi(sediment, sedimentId.value)

	if (res?.status == 201 || res?.status == 409) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	handleApiResponse(res?.data.message)

	changeVariableState()
}

const deleteSediments = async () => {
	showLoading.value = true

	const res: any = await deleteSedimentApi(
		sedimentId.value,
		idCompany.value,
		idDepartment.value
	)

	if (res?.status == 201) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

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
		sediment_store.setSediments(parseSediments(res?.data.sediments))

		sediment_store.setTotalPages(res?.data.totalPages)
	} else if (res?.status == 404) {
		sediment_store.setSediments([])

		sediment_store.setTotalPages([])
	} else {
		handleApiResponse(res?.response.data.message)

		showNotificationModal.value = true
	}
}

const getNameOfSediments = async () => {
	sedimentsName.value = sediment_store.getSediments.map((s) => s.name)
}

const parseUpdateSediments = (data: any[]) => {
	const updateSediments = sediments.value.find((d) => d.id == data[0]._id)

	if (updateSediments) {
		const index = sediments.value.indexOf(updateSediments)

		sediments.value[index] = parseSediments(data)[0]
	}
}

const getId = () => {
	idCompany.value
	idDepartment.value = department_store.getIdDepartment
}

const print = () => {
	console.log("aqui")
}
const modalContainer: Ref<HTMLElement | null> = ref(null)

onMounted(async () => {
	idCompany.value = company_store.getIdCompany

	getId()

	callGetSedimentsByPage(page.value, itemsPerPage.value)
})
</script>
