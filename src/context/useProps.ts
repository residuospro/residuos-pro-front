import {
	ICollection,
	ICollectionApi,
	ICollectionData,
	ICollectionStatus,
	IDepartment,
	ISediments,
	ISedimentsApi,
	ISetStore,
	IStatusStyle,
	IUseProps,
	IUserApi,
	IUserEvent,
	IUsers,
} from "@/utils/interfaces"
import { companyStore } from "@/store/companyStore"
import { departmentStore } from "@/store/departmentStore"
import { sedimentStore } from "@/store/sedimentStore"
import { userStore } from "@/store/userStore"
import { Service, Status } from "@/utils/enum"

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

		const departments = department_store.getDepartments
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

	const getBackgroundColorByStatus = (status: string) => {
		const backgroundColorByStatus: ICollectionStatus = {
			"Aguardando aprovação": "rgba(255, 168, 0, 0.2)",
			"Aguardando coleta": "rgba(255, 215, 0, 0.2)",
			Finalizado: "rgba(0, 128, 0, 0.2)",
			Recusado: "rgba(255, 0, 0, 0.2)",
		}

		return backgroundColorByStatus[status as keyof ICollectionStatus]
	}

	const getColorByStatus = (status: string) => {
		const colorByStatus: ICollectionStatus = {
			"Aguardando aprovação": "#FFa100",
			"Aguardando coleta": "#FFC300 ",
			Finalizado: "#008000",
			Recusado: "#FF0000",
		}

		return colorByStatus[status as keyof ICollectionStatus]
	}

	const setStatusStyle = (status: string): any => {
		const style: IStatusStyle[] = [
			{
				background: "",
				marginTop: "0.5em",
				marginBottom: "0.5em",
				borderRadius: "8px",
				color: "",
				textAlign: "center",
				fontWeight: "bold",
				borderColor: "",
				borderWidth: "1px",
			},
		]

		style[0].background = getBackgroundColorByStatus(status)
		style[0].color = getColorByStatus(status)
		style[0].borderColor = getColorByStatus(status)

		return style[0]
	}

	const validatedStatus = (status: string) => {
		if (
			status == Status.WAITING_FOR_APPROVAL ||
			status == Status.WAITING_FOR_COLLECTION
		) {
			return true
		}

		return false
	}

	const setColorSpinnerBar = (status: string): string | undefined => {
		if (status == Status.WAITING_FOR_APPROVAL) {
			return "#FFa100"
		} else if (status == Status.WAITING_FOR_COLLECTION) {
			return "#FFC300"
		}
	}

	const handleAutoCompleteStyle = (value: string | undefined | null): any => {
		if (value) {
			return { background: "#fff", height: "3.5rem", fontWeight: "bold" }
		} else {
			return { background: "#f3f4f6", height: "3rem", fontWeight: "bold" }
		}
	}

	const parseDepartment = (data: any[]): Array<IDepartment> => {
		const parsedData = data.map((d) => {
			return {
				name: d.name,
				ramal: d.ramal,
				id: d._id,
				idCompany: d.idCompany,
			}
		})

		return parsedData
	}

	const parseCollections = (data: any[]): Array<Partial<ICollectionData>> => {
		console.log("data", data)

		const parsedData = data.map((c: ICollectionApi) => {
			return {
				id: c._id,
				observation: c.observation,
				packaging: c.packaging,
				amount: c.amount,
				measure: c.measure,
				status: c.status,
				name: c.name,
				department: c.department,
				email: c.email,
				ramal: c.ramal,
				sedimentName: c.sedimentName,
				classification: c.classification,
				risk: c.risk,
				state: c.state,
				orderNumber: c._id.slice(-6),
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
				service: Service.RESIDUOSPRO,
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

	const parseUpdateUserAfterDepartment = (
		data: IUsers[],
		users: IUsers[]
	): IUsers[] => {
		const user = users.filter((d) => d.idDepartment == data[0].idDepartment)

		if (user) {
			user.forEach((u: IUsers, i) => {
				const index = users.indexOf(u)

				users[index] = parseUser(data)[i]
			})
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
		parseUpdateUserAfterDepartment,
		parseCollections,
		getBackgroundColorByStatus,
		getColorByStatus,
		setStatusStyle,
		validatedStatus,
		setColorSpinnerBar,
	}
}

export default useProps
