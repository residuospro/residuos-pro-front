import { ISediments, ISedimentStore } from "@/utils/interfaces"
import { defineStore } from "pinia"

export const sedimentStore = defineStore("sedimentStore", {
	state: (): ISedimentStore => ({
		sediments: [],

		totalPages: [],
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
	},
})
