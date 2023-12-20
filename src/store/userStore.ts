import { IUsers, IUsersState } from "@/utils/interfaces"
import { defineStore } from "pinia"

export const userStore = defineStore("userStore", {
	state: (): IUsersState => ({
		userId: "",

		users: [],

		totalPages: [],
	}),
	getters: {
		getUserId(state) {
			return state.userId
		},

		getTotalPages(state) {
			return state.totalPages
		},

		getUsers(state) {
			return state.users
		},
	},
	actions: {
		setUserId(details: string) {
			this.userId = details
		},

		setUsers(users: IUsers[]) {
			this.users = users
		},

		setTotalPages(details: number[]) {
			this.totalPages = details
		},

		resetUserState() {
			this.userId = ""
			this.users = []
			this.totalPages = []
		},
	},
})
