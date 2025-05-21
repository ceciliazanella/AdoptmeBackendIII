export const Errors = {
  USER: {
    INCOMPLETE_FIELDS: {
      code: "USER_001",
      status: "error",
      error: "Los Datos del Usuario están Incompletos...",
    },
    USER_ALREADY_EXISTS: {
      code: "USER_002",
      status: "error",
      error: "El Usuario ya Existe en la Base de Datos...",
    },
    INVALID_PASSWORD: {
      code: "USER_003",
      status: "error",
      error: "Contraseña Incorrecta...",
    },
    AUTHENTICATION_FAILED: {
      code: "USER_004",
      status: "error",
      error: "La Autenticación Falló...",
    },
    USER_NOT_FOUND: {
      code: "USER_005",
      status: "error",
      error: "Este Usuario no se encuentra en la Base de Datos...",
    },
  },
  PET: {
    INCOMPLETE_FIELDS: {
      code: "PET_001",
      status: "error",
      error: "Los Datos de la Mascota están Incompletos...",
    },
    PET_NOT_FOUND: {
      code: "PET_002",
      status: "error",
      error: "No se pudo encontrar esta Mascota en la Base de Datos...",
    },
    PET_ALREADY_EXISTS: {
      code: "PET_003",
      status: "error",
      error: "Esta Mascota ya Existe en la Base de Datos...",
    },
  },
  ADOPTION: {
    INCOMPLETE_FIELDS: {
      code: "ADOPT_001",
      status: "error",
      error: "Los Datos para la Adopción están Incompletos...",
    },
    ADOPTION_NOT_FOUND: {
      code: "ADOPT_002",
      status: "error",
      error: "Esta Adopción no se encuentra en la Base de Datos...",
    },
  },
  GENERAL: {
    SERVER_ERROR: {
      code: "GEN_001",
      status: "error",
      error: "Ocurrió un Error en el Servidor...",
    },
    DATABASE_ERROR: {
      code: "GEN_002",
      status: "error",
      error: "Hubo un Error de Conexión con la Base de Datos...",
    },
    UNEXPECTED_ERROR: {
      code: "GEN_999",
      status: "error",
      error: "Mmm... Algo Salió Mal...",
    },
  },
};
