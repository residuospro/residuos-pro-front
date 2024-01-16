<template>
	<Loading v-if="showLoading" />

	<ModalRefuse
		v-if="showModalRefuse"
		:closeModalRefuse="closeModalRefuse"
		:refuseRequest="refuseRequest" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="closeModal"
		v-if="showNotificationModal" />

	<ActionModal
		v-if="showDeleteModal"
		:closeDeleteModal="() => (showDeleteModal = false)"
		:confirm-action="deleteCollection"
		title="Confirmar cancelamento"
		sub-title="Tem certeza que deseja cancelar esse pedido?" />

	<ActionModal
		v-if="showConfirmationModal"
		:closeDeleteModal="() => (showConfirmationModal = false)"
		:confirm-action="updateCollection"
		title="Confirmar atualização"
		sub-title="Tem certeza que deseja atualizar esse pedido?" />

	<Details
		:collectionDetails="collectionDetails"
		:sedimentsName="sedimentsName"
		:measure="measures"
		:showTextArea="showTextArea"
		:validateDataToUpdateCollection="validateDataToUpdateCollection"
		:selectMeasure="selectMeasure"
		:openConfirmationModal="openConfirmationModal"
		:selectSediment="selectSediment"
		:disabledInput="disabledInput"
		:openDeleteModal="openDeleteModal"
		:getColorByStatus="getColorByStatus"
		:openModalRefuse="openModalRefuse"
		:setColorSpinnerBar="setColorSpinnerBar"
		:validatedStatus="validatedStatus"
		:setStatusStyle="setStatusStyle"
		:setBackgroundInputDetails="setBackgroundInputDetails"
		:setTextButton="setTextButton"
		:showButtonsForAdm="showButtonsForAdm"
		:setBackgroundTextArea="setBackgroundTextArea"
		:showButtonsAndInputForManager="showButtonsAndInputForManager"
		:updateCollectionStatus="updateCollectionStatus" />
</template>

<script setup lang="ts">
/* eslint-disable no-useless-escape */
import Details from "@/components/organisms/Details.vue"
import ModalRefuse from "@/components/molecules/ModalRefuse.vue"
import { ICollectionData, IMessage, ISedimentsApi } from "@/utils/interfaces"
import ActionModal from "@/components/molecules/ActionModal.vue"
import Notification from "@/components/molecules/NotificationModal.vue"
import { ref, onMounted } from "vue"
import useProps from "@/context/useProps"
import {
	deleteCollectionApi,
	getCollectionByIdApi,
	updateCollectionApi,
	updateCollectionStatusApi,
} from "@/api/collection"
import Loading from "@/components/molecules/Loading.vue"
import { AuthorizationUser, Status } from "@/utils/enum"
import { hasPermission } from "@/utils/permissions"
import { reactive } from "vue"
import { socket } from "@/socket"
import router from "@/router"
import { detailsScreenEvent } from "@/socket/detailsScreenEvent"

const {
	parseCollections,
	setStore,
	getColorByStatus,
	setStatusStyle,
	validatedStatus,
	setColorSpinnerBar,
	handleUrl,
} = useProps()

const { idCompany_store, department_store, user_store, sediment_store } =
	setStore()

const measures = ["kg", "L", "m³"]

let idCompany = ref("")
let showDeleteModal = ref(false)
let showConfirmationModal = ref(false)
let showNotificationModal = ref(false)
let idDepartment = ref<string | undefined>("")
let collectionId = ref("")
let userId = ref("")
let collectionDetails = ref<Partial<ICollectionData>>({})
let showLoading = ref(false)
let showModalRefuse = ref(false)
let title = ref("")
let subTitle = ref("")
let sedimentsData = ref<ISedimentsApi[]>([])
let sedimentsName = ref<string[]>([])
let isDeleted = ref(false)

const closeModal = () => {
	showNotificationModal.value = false

	backToCollectionScreen()
}

const backToCollectionScreen = () => {
	if (isDeleted.value) {
		router.back()
		isDeleted.value = false
	}
}

const notifyCollectionCancellation = () => {
	title.value = "Coleta cancelada"
	subTitle.value = "Essa coleta foi cancelada pelo solicitante"

	isDeleted.value = true
	showNotificationModal.value = true
}

const notifyCollectionUpdate = () => {
	title.value = "Coleta Atualizada"
	subTitle.value = "Essa coleta foi atualizada pelo solicitante"

	showNotificationModal.value = true
}

const closeModalRefuse = (event: Event) => {
	event.stopPropagation()

	showModalRefuse.value = false
}

const openDeleteModal = () => {
	showDeleteModal.value = true
}

const openModalRefuse = () => {
	showModalRefuse.value = true
}

const openConfirmationModal = (collection: Partial<ICollectionData>) => {
	collectionDetails.value = collection

	showConfirmationModal.value = true
}

const refuseRequest = async (reason: string) => {
	showLoading.value = true

	let status = Status.REFUSED

	const res: any = await updateCollectionStatusApi(
		collectionId.value,
		status,
		idCompany.value,
		reason
	)

	if (res?.status == 200) {
		collectionDetails.value = parseCollections([res?.data])[0]
	}

	showLoading.value = false
	showModalRefuse.value = false
}

const showTextArea = () => {
	const status = [String(Status.WAITING_FOR_APPROVAL)]

	if (
		hasPermission([AuthorizationUser.ADMIN]) &&
		collectionDetails.value.observation != ""
	) {
		return true
	} else if (
		!hasPermission([AuthorizationUser.ADMIN]) &&
		collectionDetails.value.observation != ""
	) {
		return true
	} else if (
		!hasPermission([AuthorizationUser.ADMIN]) &&
		collectionDetails.value.userId == userId.value &&
		status.includes(String(collectionDetails.value.status))
	) {
		return true
	} else {
		return false
	}
}
const setTextButton = (status?: string) => {
	if (status == Status.WAITING_FOR_APPROVAL) {
		return "Aceitar"
	} else if (status == Status.AWAITING_COLLECTION) {
		return "Sair para coleta"
	} else if (status == Status.WENT_OUT_FOR_COLLECTION) {
		return "Finalizar"
	} else {
		return ""
	}
}

const showButtonsForAdm = () => {
	const status = [
		String(Status.AWAITING_COLLECTION),
		String(Status.WAITING_FOR_APPROVAL),
		String(Status.WENT_OUT_FOR_COLLECTION),
	]
	if (
		hasPermission([AuthorizationUser.ADMIN]) &&
		status.includes(String(collectionDetails.value.status))
	) {
		return true
	}

	return false
}

const showButtonsAndInputForManager = () => {
	if (
		hasPermission([
			AuthorizationUser.COLLABORATOR,
			AuthorizationUser.MANAGER,
		]) &&
		collectionDetails.value.status == Status.WAITING_FOR_APPROVAL &&
		collectionDetails.value.userId == userId.value
	) {
		return true
	}

	return false
}

const setBackgroundInputDetails = () => {
	const status = [
		String(Status.FINISHED),
		String(Status.REFUSED),
		String(Status.AWAITING_COLLECTION),
	]

	if (
		hasPermission([AuthorizationUser.ADMIN]) ||
		status.includes(collectionDetails.value.status!) ||
		collectionDetails.value.userId != userId.value
	) {
		return ""
	}

	return "bg-white"
}

const setBackgroundTextArea = () => {
	const status = [
		String(Status.FINISHED),
		String(Status.REFUSED),
		String(Status.AWAITING_COLLECTION),
	]

	if (
		hasPermission([AuthorizationUser.ADMIN]) ||
		status.includes(collectionDetails.value.status!) ||
		collectionDetails.value.userId != userId.value
	) {
		return "!w-[40rem]"
	}

	return "bg-white !w-[40rem]"
}

const disabledInput = () => {
	const status = [
		String(Status.FINISHED),
		String(Status.REFUSED),
		String(Status.AWAITING_COLLECTION),
	]

	if (hasPermission([AuthorizationUser.ADMIN])) {
		return true
	} else if (status.includes(collectionDetails.value.status!)) {
		return true
	} else if (collectionDetails.value.userId != userId.value) {
		return true
	} else {
		return false
	}
}

const selectSediment = (sedimentName: string) => {
	const sediment = sedimentsData.value.find((s) => s.name == sedimentName)

	updateSedimentInCollection(sediment)
}

const selectMeasure = (measure: string) => {
	collectionDetails.value.measure = measure
}

const updateSedimentInCollection = (sediment?: ISedimentsApi) => {
	collectionDetails.value.sedimentName = sediment?.name
	collectionDetails.value.classification = sediment?.classification
	collectionDetails.value.risk = sediment?.risk
	collectionDetails.value.state = sediment?.state
}

const changeVariableState = () => {
	showDeleteModal.value = false
	showConfirmationModal.value = false
	showNotificationModal.value = true
	showLoading.value = false
}

const handleApiResponse = (message: IMessage) => {
	title.value = message.title
	subTitle.value = message.subTitle
}

const validateDataToUpdateCollection = () => {
	if (
		collectionDetails.value.amount! > 0 &&
		collectionDetails.value.classification &&
		collectionDetails.value.measure &&
		collectionDetails.value.sedimentName &&
		collectionDetails.value.state &&
		collectionDetails.value.risk &&
		collectionDetails.value.packaging
	) {
		return false
	}

	return true
}

const updateCollection = async () => {
	showLoading.value = true

	const res: any = await updateCollectionApi(
		collectionDetails.value,
		idCompany.value
	)

	if (res?.status == 200) {
		collectionDetails.value = parseCollections([res?.data.collection])[0]

		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	changeVariableState()
}

const updateCollectionStatus = async () => {
	showLoading.value = true

	let status = ""

	if (collectionDetails.value.status == Status.WAITING_FOR_APPROVAL) {
		status = Status.AWAITING_COLLECTION
	} else if (collectionDetails.value.status == Status.AWAITING_COLLECTION) {
		status = Status.WENT_OUT_FOR_COLLECTION
	} else if (collectionDetails.value.status == Status.WENT_OUT_FOR_COLLECTION) {
		status = Status.FINISHED
	}

	const res: any = await updateCollectionStatusApi(
		collectionId.value,
		status,
		idCompany.value
	)

	if (res?.status == 200) {
		collectionDetails.value = parseCollections([res?.data])[0]
	} else {
		handleApiResponse(res?.response.data.message)
		showNotificationModal.value = true
	}

	showLoading.value = false
}

const deleteCollection = async () => {
	showLoading.value = true

	const res: any = await deleteCollectionApi(
		idCompany.value,
		collectionDetails.value.id
	)

	if (res?.status == 201) {
		handleApiResponse(res?.data.message)
	} else {
		handleApiResponse(res?.response.data.message)
	}

	changeVariableState()
}

const getId = async () => {
	let id = handleUrl(window.location.href)

	collectionId.value = id

	await getCollectionById(id)
}

const getCollectionById = async (id: string) => {
	showLoading.value = true

	const res: any = await getCollectionByIdApi(
		idCompany.value,
		id,
		idDepartment.value
	)

	if (res?.status == 200) {
		collectionDetails.value = parseCollections([res?.data])[0]
	} else {
		handleApiResponse(res?.response.data.message)
	}

	showLoading.value = false
}

detailsScreenEvent(window.location.href, socket, {
	getCollectionById: async () => {
		await getCollectionById(collectionId.value)
	},
	notifyCollectionCancellation: () => notifyCollectionCancellation(),
	notifyCollectionUpdate: () => notifyCollectionUpdate(),
})

onMounted(async () => {
	idCompany.value = idCompany_store
	idDepartment.value = department_store.getIdDepartment
	userId.value = user_store.getUserId

	getId()

	if (
		hasPermission([AuthorizationUser.MANAGER, AuthorizationUser.COLLABORATOR])
	) {
		const { sediment_data, sediments_name } =
			await sediment_store.getSedimentsData()

		sedimentsName.value = sediments_name
		sedimentsData.value = sediment_data
	}
})
</script>
