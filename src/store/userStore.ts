import { IUserInfo, IUsers, IUsersState } from "@/utils/interfaces"
import { defineStore } from "pinia"

export const userStore = defineStore("userStore", {
	state: (): IUsersState => ({
		userId: "",

		user: { userId: "", name: "", email: "", ramal: "", department: "" },

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

		getUser(state) {
			return state.user
		},
	},
	actions: {
		setUserId(details: string) {
			this.userId = details
		},

		setUsers(users: IUsers[]) {
			this.users = users
		},

		setUser(user: IUserInfo) {
			this.user = user
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
