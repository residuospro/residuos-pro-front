import { Ref } from "vue"
import { NavigationFailure } from "vue-router"

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
	parseCollections: (data: any[]) => Array<Partial<ICollectionData>>
	handleUrl: (url: string) => string
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

export interface IUserInfo {
	userId: string
	name: string
	email: string
	ramal: string
	department: string
}

export interface IUsersState {
	users: IUsers[]
	totalPages: Array<number>
	userId: string
	user: IUserInfo
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
	sedimentName: null | string
	department: null | string
	status: null | string
	date: string
	idDepartment?: string
}

export interface IReports {
	sedimentName: null | string
	department: null | string
	status: null | string
	initialDate: string
	finalDate: string
	idDepartment?: string
}

export interface IFilterCollection extends IFilterSelected {
	idCompany: string
	page: string
	itemsPerPage: string
}

export interface ISedimentsData {
	name: string
	id: string
}

interface ISelectSediment {
	sediments_name: string[]
	sediment_data: ISedimentsApi[]
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
	getDepartmentNames(): Promise<string[]>
}

export interface IPropsSedimentStore {
	getSediments: ISediments[]
	setSediments(sediments: ISediments[]): void
	setTotalPages(details: number[]): void
	resetSedimentsState(): void
	getSedimentsData(): Promise<ISelectSediment>
}

interface IPropsUserStore {
	getUserId: string
	getUsers: IUsers[]
	getUser: IUserInfo
	setUsers(users: IUsers[]): void
	setTotalPages(details: number[]): void
	resetUserState(): void
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

export interface ICollectionEvent {
	data: {
		idCompany: string
		collection: ICollectionApi
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

export interface ICollectionForm {
	sediments?: string
	measure?: string
	packaging: string
	amount: number
	observation: string
}

export interface ICollection {
	orderNumber: string
	sediments: string
	packaging: string
	amount: number
	department: string
	status: string
	id: string
	measure: string
}

export interface ICollectionDetails extends ICollection {
	name: string
	email: string
	ramal: string
	classification: string
	risk: string
	state: string
	observation?: string
}

export interface ISediments {
	name?: string
	classification: string | undefined
	risk: string | undefined
	state: string | undefined
	idDepartment?: string | undefined
	idCompany?: string | undefined
	id?: string | undefined
	totalItems?: string
}

export interface ISedimentsApi extends ISediments {
	_id: string | undefined
}

export interface ICollectionData {
	userId: string
	idCompany: string
	idDepartment?: string
	sedimentsId?: string
	observation?: string
	reason?: string
	packaging: string
	amount: number
	measure: string
	status?: string
	name: string
	department: string
	email: string
	ramal: string
	sedimentName?: string
	classification?: string
	risk?: string
	state?: string
	totalItems: number
	id?: string
	orderNumber?: string
	date?: string
}

export interface ISedimentsInfo {
	total: number
	measure: string
	sedimentName: string
	state?: string
	month?: string
}

export interface ICollectionApi extends ICollectionData {
	_id: string
	reasonRefusal?: string
	createdAt: string
}

export interface ICollectionStatus {
	"Aguardando aprovação": string
	"Aguardando coleta": string
	"Saiu para coleta": string
	Finalizado: string
	Recusado: string
}

export interface IStatusStyle {
	background: string
	marginTop: string
	marginBottom: string
	borderRadius: string
	color: string
	fontWeight: string
	borderColor: string
	borderWidth: string
	width: string
	padding: string
	display: string
	flexDirection: string
	justifyContent: string
	height: string
	alignItems: string
}

export interface Fn {
	getCollectionById: () => Promise<void>
	notifyCollectionCancellation: () => void
	notifyCollectionUpdate: () => void
}

export interface ICollectionState {
	collectionDataForFilter: IFilterSelected
	showClearFilterButton: boolean
}

export interface IStates {
	Sólido: string
	Líquido: string
	Gasoso: string
}

export interface IBgColor {
	background?: string
	color?: string
}

export interface ISedimentsColor {
	Sólido: IBgColor
	Líquido: IBgColor
	Gasoso: IBgColor
}

export interface MonthTotals {
	solid: number[]
	liquid: number[]
	gaseous: number[]
}

export interface DayStateTotal {
	name: string
	total: number
	lastEntry: number
	measure: string
}

export interface IStateCondition {
	[key: string]: number
}

export interface IResponseHandler {
	[key: number]: () => Promise<void | NavigationFailure | undefined> | void
}
