export interface Credential {
	username: string
	password: string
}

interface IBackground {
	background: string | undefined
}

export interface IUseProps {
	setTableBackground: (index: number) => any
	parseDepartment: (data: any[]) => Array<IDepartment>
	handleAutoCompleteStyle: (value: string | undefined | null) => string
	setTotalPages: (page: number) => number[]
	parseUpdateDepartment: (
		data: any[],
		departments: IDepartment[]
	) => IDepartment[]
}

export interface IMessage {
	title: string
	subTitle: string
}

export interface IDepartment {
	name: string
	responsible: string
	ramal: string
	email: string
	idCompany?: string
	id?: string
}

export interface IUsers {
	name: string
	username: string
	email: string
	department: string | undefined
	ramal: string
	id: string | undefined
	idDepartment: string | undefined
	idCompany: string | undefined
}

export interface IUserDepartmentInfo {
	name: string
	ramal: string
	idCompany?: string
	id?: string
	responsible: string
	email: string
}

export interface IDepartmentStore {
	departments: Array<IUserDepartmentInfo>
	department: IUserDepartmentInfo
	totalPages: Array<number>
	idDepartment: string
	modifiedDepartment: boolean
}

export interface ISediments {
	name: string
	classification: string | undefined
	risk: string | undefined
	state: string | undefined
	packaging: string
	idDepartment: string | undefined
	idCompany: string | undefined
	id: string | undefined
}

export interface ISedimentsApi extends ISediments {
	_id: string | undefined
}

export interface IInputContainerStyle {
	minHeight: string
}

export interface IInputWrappingStyle {
	display: string
	width: string
	justifyContent: string
	marginTop: string
	position: string
	flexWrap: string
	minHeight: string
}

export interface ICollectionFilter {
	label: string
	value: string
}

export interface IFilterSelected {
	orderNumber: string
	sediment: null | string
	department: null | string
	status: null | string
	date: string
}

export type IFilter = {
	orderNumber: ""
	sediment: null
	department: null
	status: null
	date: ""
}
