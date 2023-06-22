import { defineStore } from "pinia"

export const setCompany = defineStore("setCompany", {
	state: () => ({
		company: "",
	}),
	getters: {
		// automatically infers the return type as a number
		getCompany(state) {
			return state.company
		},
	},
	actions: {
		setCompany(details: string) {
			this.company = details
		},
	},
})
