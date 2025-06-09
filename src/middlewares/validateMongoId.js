import { isValidObjectId } from "mongoose";

export const validateMongoId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!isValidObjectId(id)) {
      return res.status(400).send({
        status: "error",
        message: `El ID proporcionado en "${paramName}" es Inválido...`,
      });
    }
    next();
  };
};
