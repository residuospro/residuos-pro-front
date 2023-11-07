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
	ramal: number
	id: string
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
