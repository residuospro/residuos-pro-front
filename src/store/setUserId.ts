import { defineStore } from "pinia"

export const setUserId = defineStore("setUserId", {
	state: () => ({
		userId: "",
	}),
	getters: {
		// automatically infers the return type as a number
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
