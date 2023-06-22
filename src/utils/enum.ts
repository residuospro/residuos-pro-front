export enum Routes {
	LOGIN = "/login",
	PAYLOAD = "/payload",
	CREATE_DEPARTMENT = "/department/save",
	GET_ALL_DEPARTMENT = "/department",
	GET_DEPARTMENT_BY_PAGE = "/department/pagineted",
	GET_DEPARTMENT_BY_NAME = "/department/by-name",
	DELETE_DEPARTMENT = "/department/",
	UPDATE_DEPARTMENT = "/department/update/",
	GET_ALL_USERS = "/users",
	SAVE_USER = "/user/save",
	GET_ALL_USERNAMES = "/user/all",
	GET_USER_BY_USERNAME = "/user/by-username",
	UPDATE_USER = "/user/update/",
	DELETE_USER = "/user/",
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

	TITLE_UPDATE_REGISTER = "Atualizado",
	SUBTITLE_UPDATE_REGISTER = "Registro atualizazdo com sucesso",

	TITLE_ERROR_UPDATE_REGISTER = "Erro ao atualizar",
	SUBTITLE_ERROR_UPDATE_REGISTER = "Houve um erro inesperado ao atualizar",

	SUBTITLE_EXISTENT_DEPARTMENT = "O departamento que você está tentando criar já existe em nosso banco",
	SUBTITLE_ERROR_UPDATE_DEPARTMENT = "Esse nome de departamento já existe em nosso banco",
}
