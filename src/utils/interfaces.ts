export interface Credential {
	username: string
	password: string
}

export interface IUseProps {
	setTableBackground: (index: number) => string
	parseDepartment: (data: any[]) => Array<IDepartment>
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
	feature: string | undefined
	composition: string | undefined
	packaging: string
}
