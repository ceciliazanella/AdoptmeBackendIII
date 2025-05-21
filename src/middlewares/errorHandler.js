import { Errors } from "../utils/errors.js";

class CustomError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Middleware para el Manejo de Errores
const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.status).json({
      message: err.message,
      details: err.details,
    });
  }
  if (err.code && Errors[err.code]) {
    return res.status(400).json(Errors[err.code]);
  }
  return res.status(500).json({
    message: "Mmm... Algo Salió Mal...",
    details: err.message || "Hubo un Error Inesperado...",
  });
};

const handleUserError = (error) => {
  if (error.code === 11000) {
    return new CustomError(400, Errors.USER.USER_ALREADY_EXISTS.error, {
      field: "email",
    });
  }
  return new CustomError(500, Errors.GENERAL.SERVER_ERROR.error, error);
};

export { errorHandler, handleUserError, CustomError };
