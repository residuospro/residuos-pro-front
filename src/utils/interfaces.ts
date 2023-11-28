export interface Credential {
	username: string
	password: string
}

export interface IUseProps {
	setTableBackground: (index: number) => any
	parseDepartment: (data: any[]) => Array<IDepartment>
	parseSediments: (data: ISedimentsApi[]) => Array<ISediments>
	handleAutoCompleteStyle: (value: string | undefined | null) => string
	setTotalPages: (page: number) => number[]
	parseUpdateDepartment: (
		data: any[],
		departments: IDepartment[]
	) => IDepartment[]

	parseUpdateSediment: (data: any, sediments: ISediments[]) => ISediments[]
	setStore: () => ISetStore
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

export interface IDepartmentState {
	departments: Array<IUserDepartmentInfo>
	department: IUserDepartmentInfo
	totalPages: Array<number>
	idDepartment: string
}

export interface ISedimentStore {
	sediments: Array<ISediments>
	totalPages: Array<number>
}

export interface DepartmentActions {
	setDepartment(details: IUserDepartmentInfo): void
	setIdDepartment(id: string): void
	setTotalPages(details: number[]): void
	setDepartments(details: IUserDepartmentInfo[]): void
}

export interface ISediments {
	name: string
	classification: string | undefined
	risk: string | undefined
	state: string | undefined
	idDepartment: string | undefined
	idCompany: string | undefined
	id: string | undefined
	totalItems?: string
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

export interface IPropsDepartmentStore {
	getIdDepartment?: string
	getDepartment: IDepartment[]
	getTotalPages: number[]
	setDepartment(details: IUserDepartmentInfo): void
	setIdDepartment(id: string): void
	setTotalPages(details: number[]): void
	setDepartments(details: IUserDepartmentInfo[]): void
}

export interface IPropsSedimentStore {
	getSediments: ISediments[]
	setSediments(sediments: ISediments[]): void
	setTotalPages(details: number[]): void
}

export interface ISetStore {
	idCompany_store: string
	departments: IDepartment[]
	department_store: IPropsDepartmentStore
	sediments: ISediments[]
	sediment_store: IPropsSedimentStore
}

interface userInfo {
	idCompany: string
	idDepartment: string
	totalPages: number
}

export interface ISedimentEvent extends userInfo {
	item: ISedimentsApi
}

export interface IDepartmentEvent extends userInfo {
	item: ISedimentsApi
}
