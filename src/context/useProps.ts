import { IDepartment, ISetStore, IUseProps } from "@/utils/interfaces"
import { companyStore } from "@/store/companyStore"
import { departmentStore } from "@/store/departmentStore"

const useProps = (): IUseProps => {
	const setTableBackground = (index: number) => {
		if (index % 2 == 0) {
			return { background: "#F8f8f8" }
		}

		return { background: "transparent" }
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

	const setTotalPages = (pages: number): number[] => {
		const totalPages = []

		for (let i = 0; i <= pages - 1; i++) {
			totalPages.push(i)
		}

		return totalPages
	}

	const handleAutoCompleteStyle = (value: string | undefined | null): any => {
		if (value) {
			return { background: "#fff", height: "3.5rem" }
		} else {
			return { background: "#f3f4f6", height: "3rem" }
		}
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

	const setStore = (): ISetStore => {
		const idCompany = companyStore().getIdCompany
		const department_store = departmentStore()

		const departments = department_store.getDepartment

		return { idCompany, departments, department_store }
	}

	return {
		setTableBackground,
		parseDepartment,
		handleAutoCompleteStyle,
		setTotalPages,
		parseUpdateDepartment,
		setStore,
	}
}

export default useProps
