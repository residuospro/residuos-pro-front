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
	parseUser: (data: any[]) => Array<IUsers>
	parseUpdateUser: (data: IUserApi[], users: IUsers[]) => IUsers[]
	parseUpdateSediment: (data: any, sediments: ISediments[]) => ISediments[]
	parseUpdateUserAfterDepartment: (data: IUsers[], users: IUsers[]) => IUsers[]
	setStore: () => ISetStore
}

export interface IMessage {
	title: string
	subTitle: string
}

export interface IDepartment {
	name: string
	ramal: string
	idCompany?: string
	id?: string
}
interface IDepartmentApi extends IDepartment {
	_id: string | undefined
}

export interface IUsers {
	name?: string
	username?: string
	email?: string
	department: string | undefined
	ramal?: string
	id: string | undefined
	idDepartment: string | undefined
	idCompany: string | undefined
	service: string | undefined
}

export interface IUserForm {
	name?: string
	email?: string
	department?: string
}

export interface IUserApi extends IUsers {
	_id: string | undefined
}

export interface IUserDepartmentInfo {
	name: string
	ramal: string
	idCompany?: string
	id?: string
}

export interface IDepartmentState {
	departments: Array<IUserDepartmentInfo>
	department: IUserDepartmentInfo
	totalPages: Array<number>
}

export interface IUsersState {
	users: IUsers[]
	totalPages: Array<number>
	userId: string
}

export interface ISedimentStore {
	sediments: Array<ISediments>
	sedimentsName: Array<string>
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
	getDepartments: IDepartment[]
	getDepartment: IDepartment
	getTotalPages: number[]
	setDepartment(details: IUserDepartmentInfo): void
	setTotalPages(details: number[]): void
	setDepartments(details: IUserDepartmentInfo[]): void
	resetDepartmentState(): void
}

export interface IPropsSedimentStore {
	getSediments: ISediments[]
	setSediments(sediments: ISediments[]): void
	setTotalPages(details: number[]): void
	resetSedimentsState(): void
	getSedimentsName(): Promise<string[]>
}

interface IPropsUserStore {
	getUserId: string
	getUsers: IUsers[]
	setUsers(users: IUsers[]): void
	setTotalPages(details: number[]): void
	resetUserState(): void
}

export interface ISetStore {
	idCompany_store: string
	departments: IDepartment[]
	department_store: IPropsDepartmentStore
	sediments: ISediments[]
	sediment_store: IPropsSedimentStore
	users: IUsers[]
	user_store: IPropsUserStore
}

interface userInfo {
	idCompany: string
	idDepartment: string
	totalPages: number
}

export interface ISedimentEvent {
	data: {
		idCompany: string
		idDepartment: string
		totalPages: number
		sediment: ISedimentsApi
	}
}

export interface IDepartmentEvent {
	data: {
		department: IDepartmentApi
		idCompany: string
		totalPages: number
	}
}

export interface IUserEvent {
	data: {
		user: IUserApi
		idCompany: string
		totalPages: number
	}
}

export interface IUserDepartmentEvent {
	data: {
		user: IUserApi[]
		idCompany: string
		totalPages: number
	}
}

export interface IDepartmentUser {
	item: Array<IUsers>
	idCompany: string
}
