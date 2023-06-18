export interface Credential {
	username: string
	password: string
}

export interface IDepartment {
	name: string
	responsible: string
	ramal: string
	email: string
}

export interface IUsers {
	name: string
	username: string
	email: string
	department: string | null
	ramal: string
	id?: string
}
