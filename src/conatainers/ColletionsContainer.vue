<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="closeModal"
		v-if="showNotificationModal" />

	<CollectionsModal
		v-if="showCollectionModal"
		:showButton="showButton"
		:measure="measures"
		:sedimentsName="sedimentsName"
		:closeCollectionModal="closeCollectionModal"
		:selectSedimentId="selectSedimentId"
		:validateDataToCreateCollection="validateDataToCreateCollection"
		:createCollectionOrder="createCollectionOrder" />

	<Collections
		:itemsPerPage="itemsPerPage"
		:departments="departmentsName"
		:headers="headers"
		:actions="actions"
		:collections="collections"
		:collectionFilter="collectionFilter"
		:status="status"
		:sedimentsName="sedimentsName"
		:getColorByStatus="getColorByStatus"
		:setColorSpinnerBar="setColorSpinnerBar"
		:validatedStatus="validatedStatus"
		:handleCollectionsFilter="handleCollectionsFilter"
		:showDeleteModal="openDeleteModal"
		:openCollectionsModal="openCollectionModal"
		:collectionsFilterCleaning="collectionFilterCleaning"
		:setStatusStyle="setStatusStyle" />

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
import Collections from "@/components/organisms/Collections.vue"
import CollectionsModal from "@/components/organisms/CollectionsModal.vue"
import Loading from "@/components/molecules/Loading.vue"
import Pagination from "../components/organisms/Pagination.vue"
import ItemsPerPage from "../components/molecules/ItemsPerPage.vue"
import Notification from "@/components/molecules/NotificationModal.vue"
import { AuthorizationUser, Status, SocketEvent } from "@/utils/enum"
import {
	ICollectionData,
	ICollectionEvent,
	ICollectionFilter,
	ICollectionForm,
	IMessage,
	ISedimentsApi,
	IUserInfo,
} from "@/utils/interfaces"
import { hasPermission } from "@/utils/permissions"
import { onMounted } from "vue"
import { ref } from "vue"
import useProps from "@/context/useProps"
import { createCollectionApi, getCollectionByPageApi } from "@/api/collection"
import { socket } from "../socket"
import sound from "@/assets/sounds/r.mp3"
import { audioStore } from "@/store/audioStore"

const audio = audioStore()

const {
	setStore,
	parseCollections,
	setTotalPages,
	getColorByStatus,
	setStatusStyle,
	validatedStatus,
	setColorSpinnerBar,
} = useProps()

const { sediment_store, idCompany_store, department_store, user_store } =
	setStore()

const headers = [
	"Nº Pedido",
	"Resíduo",
	"Acondicionamento",
	"Quantidade",
	"Departamento",
	"Status",
]

const measures = ["kg", "L", "m³"]

let collectionFilter: ICollectionFilter[] = [
	{ label: "Nº Pedido", value: "order number" },
	{ label: "Resíduo", value: "sediment" },
	{ label: "Status", value: "status" },
]

const actions = ["Atualizar", "Deletar"]

let collections = ref<Partial<ICollectionData>[]>([])
let collectiontSelected = ref(false)
let idCollections = ref<string | undefined>("")
let showButton = ref(false)
let showDeleteModal = ref(false)
let showLoading = ref(false)
let showCollectionModal = ref(false)
let page = ref(1)
let itemsPerPage = ref(10)
let totalPages = ref<number[]>([])
let typeAction = ref("Cadastrar")
let departmentsName = ref<string[]>([])
let sedimentsName = ref<string[]>([])
let sedimentsData = ref<ISedimentsApi[]>([])
let sediment = ref<ISedimentsApi>({
	_id: "",
	name: "",
	classification: "",
	risk: "",
	state: "",
})
let idCompany = ref("")
let idDepartment = ref<string | undefined>("")
let userInfo = ref<IUserInfo>({
	userId: "",
	name: "",
	email: "",
	ramal: "",
	department: "",
})
let title = ref("")
let subTitle = ref("")
let showNotificationModal = ref(false)
let status = ref([
	Status.WAITING_FOR_APPROVAL,
	Status.WAITING_FOR_COLLECTION,
	Status.FINISHED,
	Status.REFUSED,
])

socket.on(SocketEvent.COLLECTION_CREATED, (data: ICollectionEvent) => {
	const { idCompany } = data.data

	if (idCompany == idCompany_store) {
		getCollectionsByPage(page.value, itemsPerPage.value)
	}
})

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

const closeModal = () => {
	showNotificationModal.value = false
}

const closeCollectionModal = (event: Event) => {
	event.stopPropagation()
	showCollectionModal.value = false
}

const callCollectionsByPage = async (page: number, itemsPerPage: number) => {
	showLoading.value = true

	await getCollectionsByPage(page, itemsPerPage)

	showLoading.value = false
}

const openDeleteModal = (id?: string) => {
	idCollections.value = id
	showDeleteModal.value = true
}

const openCollectionModal = async (action: string, id?: string) => {
	showCollectionModal.value = true
	typeAction.value = action
	idCollections.value = id
}

const collectionFilterCleaning = () => {
	if (collectiontSelected.value) {
		collections.value = []

		callCollectionsByPage(page.value, itemsPerPage.value)

		collectiontSelected.value = false
	}
}

const handleCollectionsFilter = (filter: string[]) => {
	console.log("collections", filter)
}

const setCollectionsFilter = () => {
	if (hasPermission([AuthorizationUser.ADMIN])) {
		collectionFilter.push({ label: "Departamento", value: "department" })
	}
}

const changeVariableState = () => {
	showNotificationModal.value = true
	showCollectionModal.value = false
	showButton.value = false
	showLoading.value = false
}

const handleApiResponse = (message: IMessage) => {
	title.value = message.title
	subTitle.value = message.subTitle
}

const selectSedimentId = (sedimentName: string) => {
	console.log("sn", sedimentName)
	if (sedimentName) {
		const sediments = sedimentsData.value.filter((s) => (s.name = sedimentName))

		sediment.value = sediments[0]
	}
}

const validateDataToCreateCollection = (collection: ICollectionForm) => {
	let validate = []

	for (const key in collection) {
		if (
			collection[key as keyof ICollectionForm] != "" &&
			collection[key as keyof ICollectionForm] != null
		) {
			validate.push(key)
		}
	}

	if (validate.length >= 4) showButton.value = true
	else showButton.value = false
}

const createCollectionOrder = async (
	collectionData: Partial<ICollectionData>
) => {
	showLoading.value = true

	const collection = setCollection(collectionData)

	const res: any = await createCollectionApi(collection)

	if (res?.status == 201) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	changeVariableState()
}

const setCollection = (
	collectionData: Partial<ICollectionData>
): ICollectionData => {
	const collection = {
		idCompany: idCompany.value,
		totalItems: collections.value.length,
		userId: userInfo.value.userId,
		name: userInfo.value.name,
		email: userInfo.value.email,
		ramal: userInfo.value.ramal,
		idDepartment: idDepartment.value,
		department: userInfo.value.department,
		sedimentsId: sediment.value._id,
		sedimentName: sediment.value.name,
		classification: sediment.value.classification,
		risk: sediment.value.risk,
		state: sediment.value.state,
		amount: collectionData.amount!,
		measure: collectionData.measure!,
		packaging: collectionData.packaging!,
		observation: collectionData.observation,
	}

	return collection
}

const getCollectionsByPage = async (
	currentPage: number,
	itemsPerPage: number
) => {
	showLoading.value = true

	const res: any = await getCollectionByPageApi(
		idCompany.value,
		currentPage,
		itemsPerPage,
		idDepartment.value
	)

	if (res?.status == 200) {
		collections.value = parseCollections(res?.data.collections)
		totalPages.value = setTotalPages(res?.data.totalPages)
	} else if (res?.status == 404) {
		collections.value = []
		totalPages.value = []
	} else {
		handleApiResponse(res?.response?.data?.message)

		showNotificationModal.value = true
	}

	showLoading.value = false
}

onMounted(async () => {
	audio.initializeAudio(sound)

	idCompany.value = idCompany_store
	userInfo.value = user_store.getUser
	idDepartment.value = department_store.getIdDepartment

	getCollectionsByPage(page.value, itemsPerPage.value)

	if (
		hasPermission([AuthorizationUser.MANAGER, AuthorizationUser.COLLABORATOR])
	) {
		const { sediment_data, sediments_name } =
			await sediment_store.getSedimentsData()

		sedimentsName.value = sediments_name
		sedimentsData.value = sediment_data
	}

	setCollectionsFilter()
})
</script>
