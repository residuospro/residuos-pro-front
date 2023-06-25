export interface Credential {
	username: string
	password: string
}

export interface IDepartment {
	name: string
	responsible: string
	ramal: string
	email: string
	idCompany: string
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
