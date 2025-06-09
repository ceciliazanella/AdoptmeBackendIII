export const Errors = {
  USER: {
    INCOMPLETE_FIELDS: {
      code: "USER_001",
      status: "error",
      message: "Los Datos del Usuario Faltan o están Incompletos...",
    },
    USER_ALREADY_EXISTS: {
      code: "USER_002",
      status: "error",
      message: "El Usuario ya Existe en la Base de Datos...",
    },
    INVALID_PASSWORD: {
      code: "USER_003",
      status: "error",
      message: "Contraseña Incorrecta...",
    },
    AUTHENTICATION_FAILED: {
      code: "USER_004",
      status: "error",
      message: "La Autenticación Falló...",
    },
    USER_NOT_FOUND: {
      code: "USER_005",
      status: "error",
      message: "Este Usuario no se encuentra en la Base de Datos...",
    },
  },
  PET: {
    INCOMPLETE_FIELDS: {
      code: "PET_001",
      status: "error",
      message: "Los Datos de la Mascota Faltan o están Incompletos...",
    },
    PET_NOT_FOUND: {
      code: "PET_002",
      status: "error",
      message:
        "No se pudo encontrar o no existe esta Mascota en la Base de Datos...",
    },
    PET_ALREADY_EXISTS: {
      code: "PET_003",
      status: "error",
      message: "Esta Mascota ya Existe en la Base de Datos...",
    },
    PET_ALREADY_ADOPTED: {
      code: "PET_004",
      status: "error",
      message: "Esta Mascota ya fue Adoptada...",
    },
    PET_ALREADY_EXISTS_BY_NAME: {
      code: "PET_005",
      status: "error",
      message:
        "Ya Existe una Mascota con ese Nombre y Especie en la Base de Datos...",
    },
  },
  ADOPTION: {
    INCOMPLETE_FIELDS: {
      code: "ADOPT_001",
      status: "error",
      message: "Los Datos para la Adopción Faltan o están Incompletos...",
    },
    ADOPTION_NOT_FOUND: {
      code: "ADOPT_002",
      status: "error",
      message: "Esta Adopción no se encuentra en la Base de Datos...",
    },
    ADOPTION_CREATION_FAILED: {
      code: "ADOPT_003",
      status: "error",
      message: "No se pudo Crear la Adopción...",
    },
    ADOPTION_UPDATE_FAILED: {
      code: "ADOPT_004",
      status: "error",
      message: "No se pudo Actualizar / Modificar la Adopción...",
    },
    ADOPTION_DELETE_FAILED: {
      code: "ADOPT_005",
      status: "error",
      message: "No se pudo Eliminar la Adopción...",
    },
  },
  GENERAL: {
    SERVER_ERROR: {
      code: "GEN_001",
      status: "error",
      message: "Ocurrió un Error en el Servidor...",
    },
    DATABASE_ERROR: {
      code: "GEN_002",
      status: "error",
      message: "Hubo un Error de Conexión con la Base de Datos...",
    },
    UNEXPECTED_ERROR: {
      code: "GEN_999",
      status: "error",
      message: "Mmm... Algo Salió Mal...",
    },
  },
};
