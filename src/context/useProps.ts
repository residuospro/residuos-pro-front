import {
	IDepartment,
	ISediments,
	ISedimentsApi,
	ISetStore,
	IUseProps,
} from "@/utils/interfaces"
import { companyStore } from "@/store/companyStore"
import { departmentStore } from "@/store/departmentStore"
import { sedimentStore } from "@/store/sedimentStore"

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

		const departments = department_store.getDepartment
		const sediments = sediment_store.getSediments

		return {
			idCompany_store,
			departments,
			department_store,
			sediments,
			sediment_store,
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
				packaging: d.packaging,
				id: d._id,
				idCompany: d.idCompany,
				idDepartment: d.idDepartment,
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

	return {
		setTableBackground,
		parseDepartment,
		handleAutoCompleteStyle,
		setTotalPages,
		parseUpdateDepartment,
		setStore,
		parseSediments,
		parseUpdateSediment,
	}
}

export default useProps
