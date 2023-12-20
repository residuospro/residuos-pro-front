import { IDepartmentState, IUserDepartmentInfo } from "@/utils/interfaces"
import { defineStore } from "pinia"

export const departmentStore = defineStore("departmentStore", {
	state: (): IDepartmentState => ({
		departments: [],

		department: {
			name: "",
			ramal: "",
			id: "",
			idCompany: "",
		},

		totalPages: [],
	}),

	getters: {
		getIdDepartment(state) {
			return state.department.id
		},

		getDepartments(state) {
			return state.departments
		},

		getDepartment(state) {
			return state.department
		},

		getTotalPages(state) {
			return state.totalPages
		},
	},
	actions: {
		setDepartment(details: IUserDepartmentInfo) {
			this.department = { ...details }
		},

		setTotalPages(details: number[]) {
			this.totalPages = details
		},

		setDepartments(details: IUserDepartmentInfo[]) {
			this.departments = details
		},

		resetDepartmentState() {
			this.department = {
				name: "",
				ramal: "",
				id: "",
				idCompany: "",
			}

			this.departments = []

			this.totalPages = []
		},
	},
})
