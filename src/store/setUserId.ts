import { defineStore } from "pinia"

export const setUserId = defineStore("setUserId", {
	state: () => ({
		userId: "",
	}),
	getters: {
		getUserId(state) {
			return state.userId
		},
	},
	actions: {
		setUserId(details: string) {
			this.userId = details
		},
	},
})
