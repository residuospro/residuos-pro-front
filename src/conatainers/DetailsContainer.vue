<template>
	<Loading v-if="showLoading" />

	<ModalRefuse
		v-if="showModalRefuse"
		:closeModalRefuse="closeModalRefuse"
		:refuseRequest="refuseRequest" />

	<Details
		:collectionDetails="collectionDetails"
		:disabledInput="disabledInput"
		:getColorByStatus="getColorByStatus"
		:openModalRefuse="openModalRefuse"
		:setColorSpinnerBar="setColorSpinnerBar"
		:validatedStatus="validatedStatus"
		:setStatusStyle="setStatusStyle"
		:setBackgroundInputDetails="setBackgroundInputDetails"
		:setTextButton="setTextButton"
		:showButtonsForAdm="showButtonsForAdm"
		:setBackgroundTextArea="setBackgroundTextArea"
		:showButtonsForManager="showButtonsForManager"
		:updateCollectionStatus="updateCollectionStatus" />
</template>

<script setup lang="ts">
/* eslint-disable no-useless-escape */
import Details from "@/components/organisms/Details.vue"
import ModalRefuse from "@/components/molecules/ModalRefuse.vue"
import { ICollectionData, ICollectionEvent } from "@/utils/interfaces"
import { ref, onMounted } from "vue"
import useProps from "@/context/useProps"
import {
	getCollectionByIdApi,
	updateCollectionStatusApi,
} from "@/api/collection"
import Loading from "@/components/molecules/Loading.vue"
import { AuthorizationUser, SocketEvent, Status } from "@/utils/enum"
import { hasPermission } from "@/utils/permissions"
import { reactive } from "vue"
import { socket } from "@/socket"

const {
	parseCollections,
	setStore,
	getColorByStatus,
	setStatusStyle,
	validatedStatus,
	setColorSpinnerBar,
} = useProps()

const { idCompany_store, department_store, user_store } = setStore()

let idCompany = ref("")
let idDepartment = ref<string | undefined>("")
let collectionId = ref("")
let userId = ref("")
let collectionDetails = reactive<Partial<ICollectionData>>({})
let showLoading = ref(false)
let showModalRefuse = ref(false)

socket.on(SocketEvent.UPDATE_COLLECTION_DETAILS, (data: ICollectionEvent) => {
	const { idCompany, collection } = data.data

	if (idCompany == idCompany_store && collection._id == collectionDetails.id) {
		getCollectionById(collectionId.value)
	}
})

const closeModalRefuse = (event: Event) => {
	event.stopPropagation()

	showModalRefuse.value = false
}

const openModalRefuse = () => {
	showModalRefuse.value = true
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
		collectionDetails = parseCollections([res?.data])[0]
	}

	showLoading.value = false
	showModalRefuse.value = false
}

const setBackgroundInputDetails = () => {
	const status = [String(Status.FINISHED), String(Status.REFUSED)]

	if (status.includes(collectionDetails.status!)) return ""

	return "bg-white"
}

const setTextButton = (status?: string) => {
	if (status == Status.WAITING_FOR_APPROVAL) {
		return "Aceitar"
	} else if (status == Status.WAITING_FOR_COLLECTION) {
		return "Finalizar"
	} else {
		return ""
	}
}

const showButtonsForAdm = () => {
	if (
		(hasPermission([AuthorizationUser.ADMIN]) &&
			collectionDetails.status == Status.WAITING_FOR_APPROVAL) ||
		(hasPermission([AuthorizationUser.ADMIN]) &&
			collectionDetails.status == Status.WAITING_FOR_COLLECTION)
	) {
		return true
	}

	return false
}

const showButtonsForManager = () => {
	if (
		hasPermission([
			AuthorizationUser.COLLABORATOR,
			AuthorizationUser.MANAGER,
		]) &&
		collectionDetails.status == Status.WAITING_FOR_APPROVAL &&
		collectionDetails.userId == userId.value
	) {
		return true
	}

	return false
}

const setBackgroundTextArea = (observation?: string) => {
	const status = [String(Status.FINISHED), String(Status.REFUSED)]

	if (
		(!status.includes(collectionDetails.status!) && observation) ||
		(collectionDetails.observation &&
			!status.includes(collectionDetails.status!))
	) {
		return "bg-white !w-[40rem]"
	}

	return "!w-[40rem]"
}

const disabledInput = () => {
	const status = [
		String(Status.FINISHED),
		String(Status.REFUSED),
		String(Status.WAITING_FOR_COLLECTION),
	]

	if (hasPermission([AuthorizationUser.ADMIN])) {
		return true
	} else if (status.includes(collectionDetails.status!)) {
		return true
	} else if (collectionDetails.userId != userId.value) {
		return true
	} else {
		return false
	}
}

const updateCollectionStatus = async () => {
	showLoading.value = true

	let status = ""

	if (collectionDetails.status == Status.WAITING_FOR_APPROVAL) {
		status = Status.WAITING_FOR_COLLECTION
	} else if (collectionDetails.status == Status.WAITING_FOR_COLLECTION) {
		status = Status.FINISHED
	}

	const res: any = await updateCollectionStatusApi(
		collectionId.value,
		status,
		idCompany.value
	)

	if (res?.status == 200) {
		collectionDetails = parseCollections([res?.data])[0]
	}

	showLoading.value = false
}

const getId = async () => {
	let url = window.location.href

	let regex = /\/Detalhes\/([^/]+)$/i
	let match = url.match(regex)

	if (match) {
		collectionId.value = match[1]
		await getCollectionById(match[1])
	}
}

const getCollectionById = async (id: string) => {
	showLoading.value = true

	const res: any = await getCollectionByIdApi(
		idCompany.value,
		id,
		idDepartment.value
	)

	if (res?.status == 200) {
		collectionDetails = parseCollections([res?.data])[0]
	}

	showLoading.value = false
}

onMounted(() => {
	idCompany.value = idCompany_store
	idDepartment.value = department_store.getIdDepartment
	userId.value = user_store.getUserId

	getId()
})
</script>
