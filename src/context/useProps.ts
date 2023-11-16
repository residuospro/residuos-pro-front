import { IDepartment, IUseProps } from "@/utils/interfaces"

const useProps = (): IUseProps => {
	const setTableBackground = (index: number) => {
		if (index % 2 == 0) {
			return { background: "#F8f8f8" }
		}

		return { background: "transparent" }
	}

	const parseDepartment = (data: any[]): Array<IDepartment> => {
		console.log("parse", data)

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

	return {
		setTableBackground,
		parseDepartment,
		handleAutoCompleteStyle,
		setTotalPages,
	}
}

export default useProps
