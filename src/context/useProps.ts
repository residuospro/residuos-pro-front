import {
	IDepartment,
	ISediments,
	ISedimentsApi,
	ISetStore,
	IUseProps,
	IUserApi,
	IUsers,
} from "@/utils/interfaces"
import { companyStore } from "@/store/companyStore"
import { departmentStore } from "@/store/departmentStore"
import { sedimentStore } from "@/store/sedimentStore"
import { userStore } from "@/store/userStore"

const useProps = (): IUseProps => {
	const setTableBackground = (index: number) => {
		if (index % 2 == 0) {
			return { background: "#F8f8f8" }
		}

		return { background: "transparent" }
	}

	const setTotalPages = (pages: number): number[] => {
		const totalPages = []

		for (let i = 0; i <= pages - 1; i++) {
			totalPages.push(i)
		}

		return totalPages
	}

	const setStore = (): ISetStore => {
		const idCompany_store = companyStore().getIdCompany

		const sediment_store = sedimentStore()
		const department_store = departmentStore()
		const user_store = userStore()

		const departments = department_store.getDepartment
		const sediments = sediment_store.getSediments
		const users = user_store.getUsers

		return {
			idCompany_store,
			department_store,
			sediment_store,
			user_store,
			users,
			departments,
			sediments,
		}
	}

	const handleAutoCompleteStyle = (value: string | undefined | null): any => {
		if (value) {
			return { background: "#fff", height: "3.5rem" }
		} else {
			return { background: "#f3f4f6", height: "3rem" }
		}
	}

	const parseDepartment = (data: any[]): Array<IDepartment> => {
		const parsedData = data.map((d) => {
			return {
				name: d.name,
				responsible: d.responsible,
				ramal: d.ramal,
				email: d.email,
				id: d._id,
				idCompany: d.idCompany,
			}
		})

		return parsedData
	}

	const parseSediments = (data: any[]): Array<ISediments> => {
		const parsedData = data.map((d: ISedimentsApi) => {
			return {
				name: d.name,
				classification: d.classification,
				risk: d.risk,
				state: d.state,
				id: d._id,
				idCompany: d.idCompany,
				idDepartment: d.idDepartment,
			}
		})

		return parsedData
	}

	const parseUser = (data: any[]): Array<IUsers> => {
		const parsedData = data.map((d) => {
			return {
				name: d.name,
				username: d.username,
				ramal: d.ramal,
				email: d.email,
				id: d._id,
				department: d.department,
				idDepartment: d.idDepartment,
				idCompany: d.idCompany,
			}
		})

		return parsedData
	}

	const parseUpdateDepartment = (
		data: any[],
		departments: IDepartment[]
	): IDepartment[] => {
		const updateDepartment = departments.find((d) => d.id == data[0]._id)

		if (updateDepartment) {
			const index = departments.indexOf(updateDepartment)

			departments[index] = parseDepartment(data)[0]
		}

		return departments
	}

	const parseUpdateSediment = (
		data: any[],
		sediments: ISediments[]
	): ISediments[] => {
		const updateSediments = sediments.find((s) => s.id == data[0]._id)

		if (updateSediments) {
			const index = sediments.indexOf(updateSediments)

			sediments[index] = parseSediments(data)[0]
		}

		return sediments
	}

	const parseUpdateUser = (data: IUserApi[], users: IUsers[]): IUsers[] => {
		const user = users.find((d) => d.id == data[0]._id)

		if (user) {
			const index = users.indexOf(user)

			users[index] = parseUser(data)[0]
		}

		return users
	}

	return {
		setTableBackground,
		parseDepartment,
		handleAutoCompleteStyle,
		setTotalPages,
		parseUpdateDepartment,
		setStore,
		parseSediments,
		parseUpdateSediment,
		parseUser,
		parseUpdateUser,
	}
}

export default useProps
