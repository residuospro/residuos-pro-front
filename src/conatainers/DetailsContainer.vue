<template>
	<Loading v-if="showLoading" />

	<Details
		:collectionDetails="collectionDetails"
		:getColorByStatus="getColorByStatus"
		:setColorSpinnerBar="setColorSpinnerBar"
		:validatedStatus="validatedStatus"
		:setStatusStyle="setStatusStyle" />
</template>

<script setup lang="ts">
/* eslint-disable no-useless-escape */
import Details from "@/components/organisms/Details.vue"
import { ICollectionData, ICollectionDetails } from "@/utils/interfaces"
import { ref, onMounted } from "vue"
import useProps from "@/context/useProps"
import { getCollectionByIdApi } from "@/api/collection"
import Loading from "@/components/molecules/Loading.vue"

const {
	parseCollections,
	setStore,
	getColorByStatus,
	setStatusStyle,
	validatedStatus,
	setColorSpinnerBar,
} = useProps()
const { idCompany_store, department_store } = setStore()

let idCompany = ref("")
let idDepartment = ref<string | undefined>("")

let collectionDetails = ref<Partial<ICollectionData>>({})
let showLoading = ref(false)

const getId = async () => {
	let url = window.location.href

	let regex = /\/Detalhes\/([^/]+)$/i
	let match = url.match(regex)

	if (match) {
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
		collectionDetails.value = parseCollections([res?.data])[0]
	}

	showLoading.value = false
}

onMounted(() => {
	idCompany.value = idCompany_store
	idDepartment.value = department_store.getIdDepartment

	getId()
})
</script>
