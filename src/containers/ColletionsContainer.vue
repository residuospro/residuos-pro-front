<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="showNotificationModal = false"
		v-if="showNotificationModal" />

	<WrapperModal
		v-if="showCollectionModal"
		:closeModalOutside="() => (showCollectionModal = false)">
		<CollectionsModal
			:measure="measures"
			:sedimentsName="sedimentsName"
			:closeCollectionModal="closeCollectionModal"
			:selectSedimentId="selectSedimentId"
			:validateDataToCreateCollection="validateDataToCreateCollection"
			:createCollectionOrder="createCollectionOrder">
			<ModalActionButtons
				:type-action="typeAction"
				:showButton="showButton"
				:closeModal="closeCollectionModal" />
		</CollectionsModal>
	</WrapperModal>

	<Container type="page">
		<Wrapper type="header">
			<CollectionsFilter
				:page="page"
				:departmentNames="departmentNames"
				:status="status"
				:sedimentsName="sedimentsName"
				:showClearFilterButton="collection_store.showClearFilterButton"
				:callCollectionsByPage="callCollectionsByPage"
				:getCollectionByFilter="getCollectionByFilter"
				:openCollectionsModal="openCollectionModal" />

			<Button
				v-if="!hasPermission([AuthorizationUser.ADMIN])"
				buttonType="submit"
				@click="openCollectionModal(Actions.SAVE)"
				class="bg-white">
				<p class="text-v_dark_gray">Criar</p>
			</Button>
		</Wrapper>

		<CollectionTable
			:itemsPerPage="itemsPerPage"
			:actions="actions"
			:collections="collections"
			:collectionFilter="collectionFilter"
			:getColorByStatus="getColorByStatus"
			:setColorSpinnerBar="setColorSpinnerBar"
			:validatedStatus="validatedStatus"
			:showDeleteModal="openDeleteModal"
			:setStatusStyle="setStatusStyle">
			<template v-slot:emptyTable>
				<EmptyTable :content="collections.length" />
			</template>

			<template v-slot:header>
				<TableHead :headers="headers" action="Ajustar" />
			</template>
		</CollectionTable>

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
import Container from "@/components/atoms/Container.vue"
import CollectionsFilter from "@/components/organisms/CollectionsFilter.vue"
import CollectionTable from "@/components/organisms/CollectionTable.vue"
import TableHead from "@/components/molecules/TableHead.vue"
import EmptyTable from "@/components/molecules/EmptyTable.vue"
import Wrapper from "@/components/atoms/Wrapper.vue"
import WrapperPagination from "@/components/molecules/WrapperPagination.vue"
import ModalActionButtons from "@/components/molecules/ModalActionButtons.vue"
import WrapperModal from "@/components/molecules/WrapperModal.vue"
import CollectionsModal from "@/components/organisms/CollectionsModal.vue"
import Loading from "@/components/molecules/Loading.vue"
import Pagination from "../components/organisms/Pagination.vue"
import ItemsPerPage from "../components/molecules/ItemsPerPage.vue"
import Button from "@/components/atoms/Button.vue"
import Notification from "@/components/molecules/NotificationModal.vue"
import { AuthorizationUser, Status, Actions } from "@/utils/enum"
import {
	ICollectionData,
	ICollectionFilter,
	ICollectionForm,
	ICollectionStatus,
	IFilterSelected,
	IMessage,
	ISedimentsApi,
	IStates,
	IStatusStyle,
	IUserInfo,
} from "@/utils/interfaces"
import { hasPermission } from "@/utils/permissions"
import { onMounted } from "vue"
import { ref } from "vue"
import useProps from "@/context/useProps"
import {
	createCollectionApi,
	getCollectionByFilterApi,
	getCollectionByPageApi,
} from "@/api/collection"
import { socket } from "../socket"
import { collectionScreenEvent } from "@/socket/collectionScreenEvent"
import sound from "@/assets/sounds/r.mp3"
import { audioStore } from "@/store/audioStore"
import { stores } from "@/store"
import { useHead } from "@vueuse/head"

useHead({
	title: "Resíduos Pro - Coletas",
})

const audio = audioStore()

const { parseCollections, setTotalPages } = useProps()

const {
	collection_store,
	sediment_store,
	company_store,
	department_store,
	user_store,
} = stores()

const headers = [
	"Nº Pedido",
	"Status",
	"Resíduo",
	"Acondicionamento",
	"Quantidade",
	"Departamento",
	"Data",
]

const measures = ["kg", "L", "m³"]

let collectionFilter: ICollectionFilter[] = [
	{ label: "Nº Pedido", value: "order number" },
	{ label: "Resíduo", value: "sediment" },
	{ label: "Status", value: "status" },
]

const actions = ["Atualizar", "Deletar"]

let collections = ref<Partial<ICollectionData>[]>([])
let idCollections = ref<string | undefined>("")
let showButton = ref(false)
let showDeleteModal = ref(false)
let showLoading = ref(false)
let showCollectionModal = ref(false)
let showNotificationModal = ref(false)
let page = ref(1)
let itemsPerPage = ref(10)
let totalPages = ref<number[]>([])
let typeAction = ref("Cadastrar")
let departmentNames = ref<string[]>([])
let sedimentsName = ref<string[]>([])
let sedimentsData = ref<ISedimentsApi[]>([])
let idCompany = ref("")
let idDepartment = ref<string | undefined>("")
let title = ref("")
let subTitle = ref("")

let status = ref([
	Status.WAITING_FOR_APPROVAL,
	Status.AWAITING_COLLECTION,
	Status.WENT_OUT_FOR_COLLECTION,
	Status.FINISHED,
	Status.REFUSED,
])
let sediment = ref<ISedimentsApi>({
	_id: "",
	name: "",
	classification: "",
	risk: "",
	state: "",
})
let userInfo = ref<IUserInfo>({
	userId: "",
	name: "",
	email: "",
	ramal: "",
	department: "",
})

const getBackgroundColorByStatus = (status: string) => {
	const backgroundColorByStatus: ICollectionStatus = {
		"Aguardando aprovação": "rgba(255, 168, 0, 0.2)",
		"Aguardando coleta": "rgba(255, 215, 0, 0.2)",
		"Saiu para coleta": "rgba(0, 255, 0, 0.5)",
		Finalizado: "rgba(0, 128, 0, 0.2)",
		Recusado: "rgba(255, 0, 0, 0.2)",
	}

	return backgroundColorByStatus[status as keyof ICollectionStatus]
}

const getColorByStatus = (status: string) => {
	const colorByStatus: ICollectionStatus = {
		"Aguardando aprovação": "#FFa100",
		"Aguardando coleta": "#FFC300",
		"Saiu para coleta": "#00FF00",
		Finalizado: "#008000",
		Recusado: "#FF0000",
	}

	return colorByStatus[status as keyof ICollectionStatus]
}

const setStatusStyle = (status: string): any => {
	const style: IStatusStyle[] = [
		{
			background: getBackgroundColorByStatus(status),
			marginTop: "0.5em",
			marginBottom: "0.5em",
			borderRadius: "8px",
			color: getColorByStatus(status),
			fontWeight: "bold",
			borderColor: getColorByStatus(status),
			borderWidth: "1px",
			display: "flex",
			flexDirection: "columun",
			justifyContent: "center",
			padding: "0 2rem",
			width: "70%",
			height: "2rem",
			alignItems: "center",
		},
	]

	return style[0]
}

const validatedStatus = (currentStatus: string) => {
	const status = [
		String(Status.WAITING_FOR_APPROVAL),
		String(Status.AWAITING_COLLECTION),
		String(Status.WENT_OUT_FOR_COLLECTION),
	]
	if (status.includes(currentStatus)) {
		return true
	}

	return false
}

const setColorSpinnerBar = (status: string): string | undefined => {
	if (status == Status.WAITING_FOR_APPROVAL) {
		return "#FFa100"
	} else if (status == Status.AWAITING_COLLECTION) {
		return "#FFC300"
	} else if (status == Status.WENT_OUT_FOR_COLLECTION) {
		return "#00FF00"
	}
}

const setPagination = (currentPage: number) => {
	if (page.value != currentPage) {
		page.value = currentPage

		if (collection_store.showClearFilterButton) {
			getCollectionByFilter(collection_store.getCollectionDataForFilter)
		} else {
			getCollectionsByPage(currentPage, itemsPerPage.value)
		}
	}
}

const setItemsPerPage = (value: number) => {
	if (itemsPerPage.value != value) {
		itemsPerPage.value = value

		if (collection_store.showClearFilterButton) {
			getCollectionByFilter(collection_store.getCollectionDataForFilter)
		} else {
			getCollectionsByPage(page.value, value)
		}
	}
}

const closeCollectionModal = (event: Event) => {
	event.stopPropagation()
	showCollectionModal.value = false
}

const callCollectionsByPage = async () => {
	showLoading.value = true

	await getCollectionsByPage(page.value, itemsPerPage.value)

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

const setCollectionsFilter = () => {
	if (hasPermission([AuthorizationUser.ADMIN])) {
		collectionFilter.push({ label: "Departamento", value: "department" })
	}
}

const changeVariableState = () => {
	showNotificationModal.value = true
	showCollectionModal.value = false
	showButton.value = false
}

const handleApiResponse = (message: IMessage) => {
	title.value = message.title
	subTitle.value = message.subTitle
}

const selectSedimentId = (n: string) => {
	sediment.value = sedimentsData.value.find((s) => s.name == n)!
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

	if (validate.length >= 3) showButton.value = true
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
		measure: setMeasure(sediment.value.state!),
		packaging: collectionData.packaging!,
		observation: collectionData.observation,
	}

	return collection
}

const setMeasure = (state: string) => {
	const states: IStates = {
		Sólido: "Kg",
		Gasoso: "m³",
		Líquido: "L",
	}

	return states[state as keyof IStates]
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

		collection_store.setShowClearFilterButton(false)
	} else if (res?.status == 404) {
		collections.value = []
		totalPages.value = []
	} else {
		handleApiResponse(res?.response?.data?.message)

		showNotificationModal.value = true
	}

	showLoading.value = false
}

const getCollectionByFilter = async (collectionFilter: IFilterSelected) => {
	collection_store.setCollectionDataForFilter(collectionFilter)

	showLoading.value = true

	const res: any = await getCollectionByFilterApi(
		collectionFilter,
		idCompany.value,
		String(page.value),
		String(itemsPerPage.value),
		idDepartment.value
	)

	if (res?.status == 200) {
		collections.value = parseCollections(res?.data.collections)

		totalPages.value = setTotalPages(res?.data.totalPages)

		collection_store.setShowClearFilterButton(true)
	} else if (res?.status == 404) {
		handleApiResponse(res?.data.message)
		showNotificationModal.value = true
	} else {
		handleApiResponse(res?.response?.data?.message)

		showNotificationModal.value = true
	}

	showLoading.value = false
}

collectionScreenEvent(socket, async () => {
	await getCollectionsByPage(page.value, itemsPerPage.value)
})

onMounted(async () => {
	audio.initializeAudio(sound)

	idCompany.value = company_store.getIdCompany
	userInfo.value = user_store.getUser
	idDepartment.value = department_store.getIdDepartment

	getCollectionsByPage(page.value, itemsPerPage.value)

	departmentNames.value = await department_store.getDepartmentNames()

	const { sediment_data, sediments_name } =
		await sediment_store.getSedimentsData()

	sedimentsName.value = sediments_name
	sedimentsData.value = sediment_data

	setCollectionsFilter()
})
</script>
