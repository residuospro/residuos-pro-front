import {
	ICollectionApi,
	ICollectionData,
	IDepartment,
	ISediments,
	ISedimentsApi,
	IUseProps,
	IUserApi,
	IUsers,
} from "@/utils/interfaces"
import { Service } from "@/utils/enum"

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

	const handleAutoCompleteStyle = (value: string | undefined | null): any => {
		if (value) {
			return { background: "#fff", height: "3.5rem", fontWeight: "bold" }
		} else {
			return { background: "#f3f4f6", height: "3rem", fontWeight: "bold" }
		}
	}

	const handleUrl = (url: string): string => {
		const regex = /\/Detalhes\/([^/]+)$/i
		const match = url.match(regex)

		if (match) return match[1]

		return ""
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

	const parseCollections = (
		data: ICollectionApi[]
	): Array<Partial<ICollectionData>> => {
		const parsedData = data.map((c: ICollectionApi) => {
			return {
				id: c._id,
				observation: c.observation,
				reason: c.reasonRefusal ? c.reasonRefusal : "",
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
				userId: c.userId,
				orderNumber: c.orderNumber,
				date: parseDate(c.createdAt),
			}
		})

		return parsedData
	}

	const parseDate = (date: string) => {
		const newDate = new Date(date)

		const formattedDate = new Intl.DateTimeFormat("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timeZone: "UTC",
		})

		return formattedDate.format(newDate)
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
		parseSediments,
		parseUpdateSediment,
		parseUser,
		parseUpdateUser,
		parseUpdateUserAfterDepartment,
		parseCollections,
		handleUrl,
	}
}

export default useProps
