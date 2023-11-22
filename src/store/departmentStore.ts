import { IDepartmentState, IUserDepartmentInfo } from "@/utils/interfaces"
import { defineStore } from "pinia"

export const departmentStore = defineStore("departmentStore", {
	state: (): IDepartmentState => ({
		departments: [],

		department: {
			name: "",
			responsible: "",
			ramal: "",
			email: "",
			id: "",
			idCompany: "",
		},

		totalPages: [],

		idDepartment: "",
	}),

	getters: {
		getIdDepartment(state) {
			return state.department.id
		},

		getDepartment(state) {
			return state.departments
		},

		getTotalPages(state) {
			return state.totalPages
		},
	},
	actions: {
		setDepartment(details: IUserDepartmentInfo) {
			this.department = { ...details }
		},

		setIdDepartment(id: string) {
			this.idDepartment = id
		},

		setTotalPages(details: number[]) {
			this.totalPages = details
		},

		setDepartments(details: IUserDepartmentInfo[]) {
			this.departments = details
		},
	},
})
