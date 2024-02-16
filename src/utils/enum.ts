export enum Routes {
	LOGIN = "/api/login",
	PAYLOAD = "/api/payload",
	CREATE_DEPARTMENT = "/department/save",
	GET_ALL_DEPARTMENT = "/department",
	GET_DEPARTMENT_BY_PAGE = "/department/pagineted",
	GET_DEPARTMENT_BY_NAME = "/department/by-name",
	GET_DEPARTMENT_NAMES = "/api/department/names",
	DELETE_DEPARTMENT = "/department/",
	UPDATE_DEPARTMENT = "/department/update/",
	GET_ALL_USERS = "/users",
	SAVE_USER = "/api/user/save",
	GET_ALL_USERNAMES = "/user/all",
	GET_USER_BY_USERNAME = "/user/by-username",
	UPDATE_USER = "/user/update/",
	DELETE_USER = "/user/",
	REFRESH_TOKEN = "/refresh_token",
	SAVE_SEDIMENTS = "/api/sediments/save",
	GET_SEDIMENTS_BY_PAGE = "/api/sediments/pagineted",
	GET_NAME_OF_SEDIMENTS = "/api/sediments/by-name",
	GET_SEDIMENTS_BY_NAME = "/api/sediments/get-name",
	UPDATE_SEDIMENTS = "/sediments/update/",
	DELETE_SEDIMENT = "/sediment/",
	SAVE_COLLECTION = "/api/collection/save",
	GET_COLLECTION_BY_PAGE = "/api/collection/pagineted",
	GET_COLLECTION_BY_ID = "/api/collection/",
	GET_COLLECTION_BY_FILTER = "/api/collection_filter",
	UPDATE_COLLECTION_STATUS = "/api/update_collection_status/",
	UPDATE_COLLECTION = "/api/update_collection/",
	DELETE_COLLECTION = "/api/delete_collection/",
	GENERATE_COLLECTION_ORDER_DOWNLOAD = "/api/generate_collection_order_download",
	GET_ALL_COLLECTIONS = "/api/all_collections",
	RESET_PASSWORD = "/api/user/reset_password",
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

export enum Service {
	SAVEMONEY = "SaveMoney",
	RESIDUOSPRO = "Residuos-Pro",
}

export enum RangeType {
	MONTH = "month",
	YEAR = "year",
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

	TITLE_THERE_ARE_NO_RECORDS = "Não há registros",
	SUBTITLE_THERE_ARE_NO_RECORDS = "Não foram encontrados registros para essa busca",

	TITLE_EXISTING_USER = "Username inválido",
	SUBTITLE_EXISTING_USER = "O nome de usuário fornecido já existe em nosso banco",
}

export enum SocketEvent {
	CHANNEL = "residuos-pro",

	DEPARTMENT_CREATED = "department_created",
	UPDATED_DEPARTMENT = "updated_department",
	DELETED_DEPARTMENT = "deleted_department",

	SEDIMENT_CREATED = "sediment_created",
	UPDATED_SEDIMENT = "updated_sediment",
	DELETED_SEDIMENT = "deleted_sediment",

	USER_CREATED = "user_created",
	UPDATED_USER = "updated_user",
	DELETED_USER = "deleted_user",
	UPDATED_USER_AFTER_DEPARTMENT = "updated_user_after_department",
	DELETED_USER_AFTER_DEPARTMENT = "deleted_user_after_department",

	COLLECTION_CREATED = "collection_created",
	COLLECTION = "collection",
	UPDATE_COLLECTION_STATUS = "update_collection_status",

	UPDATE_STATUS_IN_THE_DETAILS_SCREEN = "update_status_in_the_details_screen",
	NOTIFY_CANCELLATION_ON_DETAILS_SCREEN = "notify cancellation on details screen",
	DELETE_COLLECTION = "delete_collection",
	UPDATE_COLLECTION = "update_collection",
}

export enum Status {
	WAITING_FOR_APPROVAL = "Aguardando aprovação",
	AWAITING_COLLECTION = "Aguardando coleta",
	WENT_OUT_FOR_COLLECTION = "Saiu para coleta",
	FINISHED = "Finalizado",
	REFUSED = "Recusado",
}
