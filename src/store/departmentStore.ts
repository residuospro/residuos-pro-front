import { takeDepartmentsByPage } from "@/api/department"
import { IDepartmentStore, IUserDepartmentInfo } from "@/utils/interfaces"
import { defineStore } from "pinia"
import useProps from "../context/useProps"

const { parseDepartment, setTotalPages } = useProps()

export const departmentStore = defineStore("departmentStore", {
	state: (): IDepartmentStore => ({
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

		modifiedDepartment: false,
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

		getModifiedDepartment(state) {
			return state.modifiedDepartment
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

		setModifiedDepartment(isModified: boolean) {
			this.modifiedDepartment = isModified
		},
	},
})
