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

		async getDepartmentByPage(
			currentPage: number,
			itemsPerPage: number,
			idCompany: string
		) {
			let department: IUserDepartmentInfo[] = []
			let pages: number[] = []

			const res: any = await takeDepartmentsByPage(
				currentPage,
				itemsPerPage,
				idCompany
			)

			if (res?.status == 200) {
				this.departments = []
				this.totalPages = []

				department = parseDepartment(res?.data.departments)

				this.departments = department

				pages = setTotalPages(res?.data.totalPages)

				this.totalPages = pages
			} else if (res?.status == 404) {
				this.departments = []
				this.totalPages = []

				department = []
				pages = []
			}

			return { department, pages }
		},
	},
})
