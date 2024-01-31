<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="showNotificationModal = false"
		v-if="showNotificationModal" />

	<Dashboard>
		<Reports
			:departmentNames="departmentNames"
			:sedimentsName="sedimentsName" />

		<SedimetsCard
			:sedimentsInfo="sedimentsInfo"
			:validadeState="validadeState"
			:setBackgroundColor="setBackgroundColor"
			:setTextColor="setTextColor" />
	</Dashboard>
</template>

<script setup lang="ts">
import Loading from "@/components/molecules/Loading.vue"
import Notification from "@/components/molecules/NotificationModal.vue"
import SedimetsCard from "@/components/organisms/SedimentsCard.vue"
import Dashboard from "@/views/Dashboard.vue"
import Reports from "@/components/molecules/Reports.vue"
import { ref } from "vue"
import { onMounted } from "vue"
import { stores } from "@/store"
import { getAllCollectionsApi } from "@/api/collection"
import {
	ICollectionApi,
	IMessage,
	ISedimentsColor,
	ISedimentsInfo,
	IStates,
} from "@/utils/interfaces"
import gas from "@/assets/cilindro.json"
import liquid from "@/assets/liquid.json"
import solid from "@/assets/solid.json"

const { department_store, sediment_store, company_store } = stores()

let showLoading = ref(false)
let departmentNames = ref<string[]>([])
let sedimentsName = ref<string[]>([])
let idCompany = ref("")
let idDepartment = ref<string | undefined>("")
let title = ref("")
let subTitle = ref("")
let showNotificationModal = ref(false)
let sedimentsInfo = ref<ISedimentsInfo[]>([])

const handleApiResponse = (message: IMessage) => {
	title.value = message.title
	subTitle.value = message.subTitle
}

const validadeState = (state?: string) => {
	const states: IStates = {
		Sólido: solid,
		Líquido: liquid,
		Gasoso: gas,
	}

	return states[state as keyof IStates]
}

const setBackgroundColor = (state?: string) => {
	const states: ISedimentsColor = {
		Sólido: { background: "rgba(255, 168, 0, 0.2)" },
		Líquido: { background: "rgba(46, 124, 221, 0.1)" },
		Gasoso: { background: "rgba(74, 217, 137, 0.1)" },
	}

	return states[state as keyof ISedimentsColor]
}

const setTextColor = (state?: string) => {
	const states: ISedimentsColor = {
		Sólido: { color: "#FFa100" },
		Líquido: { color: "#2E7CDD" },
		Gasoso: { color: "#36802d" },
	}

	return states[state as keyof ISedimentsColor]
}

const getAllCollections = async () => {
	showLoading.value = true
	const res: any = await getAllCollectionsApi(
		idCompany.value,
		idDepartment.value
	)

	if (res?.status == 200) {
		sedimentsInfo.value = sumItemsBySedimentName(res?.data)
	} else if (res?.status == 404) {
		handleApiResponse(res?.data.message)
		showNotificationModal.value = true
	} else {
		handleApiResponse(res?.response?.data?.message)

		showNotificationModal.value = true
	}

	showLoading.value = false
}

const sumItemsBySedimentName = (
	items: ICollectionApi[]
): {
	sedimentName: string
	total: number
	measure: string
	state?: string
}[] => {
	const groupedItems: {
		[key: string]: { total: number; measure: string; state?: string }
	} = {}

	items.forEach((item) => {
		const { sedimentName, amount, measure, state } = item

		if (!groupedItems[sedimentName!]) {
			groupedItems[sedimentName!] = { total: 0, measure, state }
		}

		groupedItems[sedimentName!].total += amount
	})

	return Object.keys(groupedItems).map((sedimentName) => ({
		sedimentName,
		total: groupedItems[sedimentName].total,
		measure: groupedItems[sedimentName].measure,
		state: groupedItems[sedimentName].state,
	}))
}

onMounted(async () => {
	idCompany.value = company_store.getIdCompany
	idDepartment.value = department_store.getIdDepartment

	getAllCollections()

	departmentNames.value = await department_store.getDepartmentNames()

	const { sediments_name } = await sediment_store.getSedimentsData()

	sedimentsName.value = sediments_name
})
</script>
