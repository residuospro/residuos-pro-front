import { ISediments, ISedimentsApi, ISedimentStore } from "@/utils/interfaces"
import { defineStore } from "pinia"
import { getSedimentsByPageApi } from "@/api/sediments"
import { companyStore } from "@/store/companyStore"
import { departmentStore } from "@/store/departmentStore"

export const sedimentStore = defineStore("sedimentStore", {
	state: (): ISedimentStore => ({
		sediments: [],

		totalPages: [],

		sedimentsName: [],
	}),

	getters: {
		getSediments(state) {
			return state.sediments
		},
	},

	actions: {
		setSediments(sediments: ISediments[]) {
			this.sediments = sediments
		},

		setTotalPages(details: number[]) {
			this.totalPages = details
		},

		resetSedimentsState() {
			this.sediments = []
			this.totalPages = []
		},

		async getSedimentsData() {
			const idCompany = companyStore().getIdCompany
			const idDepartment = departmentStore().getIdDepartment

			const page = 1
			const itemsPerPage = 10

			const res: any = await getSedimentsByPageApi(
				page,
				itemsPerPage,
				idCompany,
				idDepartment
			)

			let sediments_name: string[] = []
			let sediment_data: ISedimentsApi[] = []

			if (res?.status == 200) {
				const sediments = res?.data.sediments as ISedimentsApi[]

				sediments_name = sediments.map((s: any) => s.name) as string[]

				sediment_data = sediments
			}

			return { sediments_name, sediment_data }
		},
	},
})
