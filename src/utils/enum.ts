export enum Routes {
	LOGIN = "/login",
	PAYLOAD = "/payload",
}

export enum TypeErrors {
	INCORRECT_PASSWORD = "Senha incorreta",
	USER_NOT_FOUND = "Usuário não encontrado",
	UNEXPECTED_ERROR = "Tivemos um erro inesperado",
}

export enum AuthorizationUser {
	ADMIN = "ADMIN",
	MANAGER = "MANAGER",
	COLLABORATOR = "COLLABORATOR",
}
