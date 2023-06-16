export enum Routes {
	LOGIN = "/login",
	PAYLOAD = "/payload",
	CREATE_DEPARTMENT = "/department/save",
	GET_ALL_DEPARTMENT = "/department",
	GET_DEPARTMENT_BY_PAGE = "/department/pagineted",
	GET_DEPARTMENT_BY_NAME = "/department/by-name",
	DELETE_DEPARTMENT = "/department/",
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

export enum Actions {
	SAVE = "Cadastrar",
	UPDATE = "Atualizar",
}

export enum Messages {
	TITLE_REGISTER = "Cadastrado",
	SUBTITLE_REGISTER = "Cadastro realizado com sucesso",
	TITLE_ERROR_REGISTER = "Erro ao cadastrar",
	SUBTITLE_ERROR_REGISTER = "Houve um erro inesperado no cadastro",
	TITLE_ERROR = "Houve um erro inesperado",
	SUBTITLE_ERROR = "Tivemos um erro em nosso servidor, por favor tente novamente",
	TITLE_DELETE_REGISTER = "Deletado",
	SUBTITLE_DELETE_REGISTER = "Registro deletado com sucesso",
	TITLE_ERROR_DELETE_REGISTER = "Erro ao deletar",
	SUBTITLE_ERROR_DELETE_REGISTER = "Houve um erro inesperado ao deletar",
}
