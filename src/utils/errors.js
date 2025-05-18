export const Errors = {
  USER: {
    INCOMPLETE_FIELDS: {
      status: "error",
      error: "Los Datos del Usuario están Incompletos...",
    },
    USER_ALREADY_EXISTS: {
      status: "error",
      error: "El Usuario ya Existe en la Base de Datos...",
    },
    INVALID_PASSWORD: { status: "error", error: "Contraseña Incorrecta..." },
    AUTHENTICATION_FAILED: {
      status: "error",
      error: "La Autenticación Falló...",
    },
    USER_NOT_FOUND: {
      status: "error",
      error: "Este Usuario no se encuentra en la Base de Datos...",
    },
  },
  PET: {
    INCOMPLETE_FIELDS: {
      status: "error",
      error: "Los Datos de la Mascota están Incompletos...",
    },
    PET_NOT_FOUND: {
      status: "error",
      error: "No se pudo encontrar esta Mascota en la Base de Datos...",
    },
    PET_ALREADY_EXISTS: {
      status: "error",
      error: "Esta Mascota ya Existe en la Base de Datos...",
    },
  },
  ADOPTION: {
    INCOMPLETE_FIELDS: {
      status: "error",
      error: "Los Datos para la Adopción están Incompletos...",
    },
    ADOPTION_NOT_FOUND: {
      status: "error",
      error: "Esta Adopción no se encuentra en la Base de Datos...",
    },
  },
  GENERAL: {
    SERVER_ERROR: {
      status: "error",
      error: "Ocurrió un Error en el Servidor...",
    },
    DATABASE_ERROR: {
      status: "error",
      error: "Hubo un Error de Conexión con la Base de Datos...",
    },
  },
};
