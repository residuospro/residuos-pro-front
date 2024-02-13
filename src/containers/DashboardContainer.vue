<template>
	<Loading v-if="showLoading" />

	<Notification
		:title="title"
		:subTitle="subTitle"
		@closeModal="showNotificationModal = false"
		v-if="showNotificationModal" />

	<Container type="page">
		<Reports
			:departmentNames="departmentNames"
			:sedimentsName="sedimentsName" />

		<Wrapper type="chart">
			<Chart
				:months="months"
				:annualSediments="annualSediments"
				@show-loading="(value: boolean) => (showLoading = value)" />

			<CardDailySediments
				:cardTitleDailySediments="cardTitleDailySediments"
				:dailySediment="dailySediment"
				:setTextColor="setTextColor" />
		</Wrapper>

		<WrapperSendimentCard :cardTitle="cardTitle">
			<SedimetsCard
				:sedimentsInfo="sedimentsInfo"
				:validadeState="validadeState"
				:setBackgroundColor="setBackgroundColor"
				:setTextColor="setTextColor" />

			<EmptyTable :content="sedimentsInfo.length" />
		</WrapperSendimentCard>
	</Container>
</template>

<script setup lang="ts">
import Loading from "@/components/molecules/Loading.vue"
import EmptyTable from "@/components/molecules/EmptyTable.vue"
import Container from "@/components/atoms/Container.vue"
import CardDailySediments from "@/components/molecules/CardDailySediments.vue"
import Chart from "@/components/molecules/Chart.vue"
import Wrapper from "@/components/atoms/Wrapper.vue"
import WrapperSendimentCard from "@/components/molecules/WrapperSendimentCard.vue"
import Notification from "@/components/molecules/NotificationModal.vue"
import SedimetsCard from "@/components/organisms/SedimentsCard.vue"
import Reports from "@/components/molecules/Reports.vue"
import { ref } from "vue"
import { onMounted } from "vue"
import { stores } from "@/store"
import { getAllCollectionsApi } from "@/api/collection"
import {
	DayStateTotal,
	ICollectionApi,
	IMessage,
	ISedimentsColor,
	ISedimentsInfo,
	IStates,
	MonthTotals,
} from "@/utils/interfaces"
import gas from "@/assets/gas.json"
import liquid from "@/assets/liquid.json"
import solid from "@/assets/solid.json"
import { hasPermission } from "@/utils/permissions"
import { AuthorizationUser } from "@/utils/enum"
import { useHead } from "@vueuse/head"

useHead({
	title: "Resíduos Pro - Dashboard",
})

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
let annualSediments = ref<MonthTotals>({ solid: [], liquid: [], gaseous: [] })
let dailySediment = ref<DayStateTotal[]>([])
let months = ref<string[]>([])
let cardTitle = ref("")
let cardTitleDailySediments = ref("")

const setCardTitle = () => {
	if (hasPermission([AuthorizationUser.ADMIN])) {
		cardTitle.value = "Estoque"
	} else {
		cardTitle.value = "Saída"
	}
}

const setCardTitleDailySediments = () => {
	if (hasPermission([AuthorizationUser.ADMIN])) {
		cardTitleDailySediments.value = "Entradas"
	} else {
		cardTitleDailySediments.value = "Saídas"
	}
}

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
		Sólido: { background: "rgba(255, 206, 86, 0.2)" },
		Líquido: { background: "rgba(54, 162, 235, 0.2)" },
		Gasoso: { background: "rgba(74, 217, 137, 0.1)" },
	}

	return states[state as keyof ISedimentsColor]
}

const setTextColor = (state?: string) => {
	const states: ISedimentsColor = {
		Sólido: { color: "rgba(255, 159, 64, 1)" },
		Líquido: { color: "rgba(54, 162, 235, 1)" },
		Gasoso: { color: "#77ab59" },
	}

	return states[state as keyof ISedimentsColor]
}

function getMonthAbbreviations(collections: ICollectionApi[]) {
	const monthNames: string[] = [
		"Jan",
		"Fev",
		"Mar",
		"Abr",
		"Mai",
		"Jun",
		"Jul",
		"Ago",
		"Set",
		"Out",
		"Nov",
		"Dez",
	]

	const uniqueMonths: Set<number> = new Set()

	for (const collection of collections) {
		const month = new Date(collection.createdAt).getMonth()
		uniqueMonths.add(month)
	}

	uniqueMonths.forEach((month) => {
		months.value.push(monthNames[month])
	})
}

const getAllCollections = async () => {
	showLoading.value = true

	const res: any = await getAllCollectionsApi(
		idCompany.value,
		idDepartment.value
	)

	if (res?.status == 200) {
		sedimentsInfo.value = sumItemsBySedimentName(res?.data.collectionsThisMonth)

		annualSediments.value = calculateMonthlyTotals(
			res?.data.collectionsThisYear
		)

		getMonthAbbreviations(res?.data.collectionsThisYear)

		dailySediment.value = calculateTotalsDay(res?.data.collectionsToday)
	} else if (res?.status == 404) {
		handleApiResponse(res?.data.message)
		showNotificationModal.value = true
	} else {
		handleApiResponse(res?.response?.data?.message)

		showNotificationModal.value = true
	}
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

	return Object.keys(groupedItems)
		.map((sedimentName) => ({
			sedimentName,
			total: groupedItems[sedimentName].total,
			measure: groupedItems[sedimentName].measure,
			state: groupedItems[sedimentName].state,
		}))
		.sort((a, b) => {
			const stateOrder: { [key: string]: number } = {
				Sólido: 0,
				Líquido: 1,
				Gasoso: 2,
			}

			const stateA = a.state || ""
			const stateB = b.state || ""

			return stateOrder[stateA] - stateOrder[stateB]
		})
}

const calculateMonthlyTotals = (data: ICollectionApi[]): MonthTotals => {
	const monthTotals: MonthTotals = {
		solid: Array(12).fill(0),
		liquid: Array(12).fill(0),
		gaseous: Array(12).fill(0),
	}

	const stateMapping: { [key: string]: keyof MonthTotals } = {
		Sólido: "solid",
		Líquido: "liquid",
		Gasoso: "gaseous",
	}

	for (const item of data) {
		const createdAtDate = new Date(item.createdAt)
		const month = createdAtDate.getMonth()

		if (item.state && month >= 0 && month < 12) {
			const amount = item.amount

			const stateKey = stateMapping[item.state]

			if (stateKey) {
				monthTotals[stateKey][month] += amount
			}
		}
	}

	return monthTotals
}

const calculateTotalsDay = (data: ICollectionApi[]): DayStateTotal[] => {
	const dayStateTotals: { [key: string]: DayStateTotal } = {
		Sólido: { name: "Sólido", total: 0, lastEntry: 0, measure: "" },
		Líquido: { name: "Líquido", total: 0, lastEntry: 0, measure: "" },
		Gasoso: { name: "Gasoso", total: 0, lastEntry: 0, measure: "" },
	}

	const stateMapping: { [key: string]: keyof typeof dayStateTotals } = {
		Sólido: "Sólido",
		Líquido: "Líquido",
		Gasoso: "Gasoso",
	}

	for (const item of data) {
		const createdAtDate = new Date(item.createdAt)
		const day = createdAtDate.getDay()

		if (item.state && day >= 0 && day <= 31) {
			const amount = item.amount
			const measure = item.measure

			const stateKey = stateMapping[item.state]

			if (stateKey) {
				dayStateTotals[stateKey].total += amount
				dayStateTotals[stateKey].lastEntry = amount
				dayStateTotals[stateKey].measure = measure
			}
		}
	}

	return Object.values(dayStateTotals)
}

onMounted(async () => {
	idCompany.value = company_store.getIdCompany
	idDepartment.value = department_store.getIdDepartment

	getAllCollections()

	setCardTitle()

	setCardTitleDailySediments()

	departmentNames.value = await department_store.getDepartmentNames()

	const { sediments_name } = await sediment_store.getSedimentsData()

	sedimentsName.value = sediments_name
})
</script>
