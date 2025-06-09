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
  const statusCode = err.status || 500;

  const statusText = statusCode >= 500 ? "fail" : "error";

  if (err instanceof CustomError) {
    return res.status(statusCode).json({
      status: statusText,
      message: err.message,
      details: err.details,
    });
  }
  if (err.code && Errors[err.code]) {
    return res.status(400).json({
      status: "error",
      ...Errors[err.code],
    });
  }
  return res.status(500).json({
    status: "fail",
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
