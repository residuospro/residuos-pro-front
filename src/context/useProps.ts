import { IDepartment, IUseProps } from "@/utils/interfaces"

const useProps = (): IUseProps => {
	const setTableBackground = (index: number) => {
		if (index % 2 == 0) {
			return "bg-v_white_one"
		}

		return ""
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
	}
}

export default useProps
