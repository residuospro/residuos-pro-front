import { IUserDepartmentInfo } from "@/utils/interfaces"
import { defineStore } from "pinia"

export const setDepartment = defineStore("setDepartment", {
	state: () => ({
		department: {
			name: "",
			ramal: 0,
			id: "",
		},
	}),
	getters: {
		getIdDepartment(state) {
			return state.department.id
		},
		getDepartment(state) {
			return state.department
		},
	},
	actions: {
		setIdDepartment(details: IUserDepartmentInfo) {
			console.log("d", details)

			this.department = { ...details }
		},
	},
})
