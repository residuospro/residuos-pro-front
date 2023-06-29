import { defineStore } from "pinia"

export const setIdCompany = defineStore("setIdCompany", {
	state: () => ({
		idCompany: "",
	}),
	getters: {
		getIdCompany(state) {
			return state.idCompany
		},
	},
	actions: {
		setIdCompany(details: string) {
			this.idCompany = details
		},
	},
})
