<template>
	<CollectionsModal
		v-if="showCollectionModal"
		:showButton="showButton"
		:measure="measures"
		:sedimentsName="sedimentsName"
		:closeCollectionModal="closeCollectionModal" />

	<Collections
		:itemsPerPage="itemsPerPage"
		:departments="departmentsName"
		:headers="headers"
		:actions="actions"
		:collections="collections"
		:collectionFilter="collectionFilter"
		:status="status"
		:handleCollectionsFilter="handleCollectionsFilter"
		:showDeleteModal="openDeleteModal"
		:openCollectionsModal="openCollectionModal"
		:collectionsFilterCleaning="collectionFilterCleaning" />
</template>

<script setup lang="ts">
import Collections from "@/components/organisms/Collections.vue"
import CollectionsModal from "@/components/organisms/CollectionsModal.vue"
import { AuthorizationUser } from "@/utils/enum"
import { ICollectionFilter } from "@/utils/interfaces"
import { hasPermission } from "@/utils/permissions"
import { onMounted } from "vue"
import { ref } from "vue"
import useProps from "@/context/useProps"

const { setStore } = useProps()

const { sediment_store } = setStore()

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

let collections = ref<any[]>([])
let collectiontSelected = ref(false)
let idCollections = ref<string | undefined>("")
let showButton = ref(false)
let showDeleteModal = ref(false)
let showLoading = ref(false)
let showCollectionModal = ref(false)
let page = ref(1)
let itemsPerPage = ref(10)
let typeAction = ref("Cadastrar")
let departmentsName = ref<string[]>([])
let sedimentsName = ref<string[]>([])
let status = ref([
	"Aguardando aprovação",
	"Aguardando coleta",
	"Finalizado",
	"Recusado",
])

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
	sedimentsName.value = await sediment_store.getSedimentsName()
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

const getCollectionsByPage = async (page: number, value: number) => {
	console.log("collections", page, value)
}

const setCollectionsFilter = () => {
	if (hasPermission([AuthorizationUser.ADMIN])) {
		collectionFilter.push({ label: "Departamento", value: "department" })
	}
}

onMounted(() => {
	setCollectionsFilter()
})
</script>
