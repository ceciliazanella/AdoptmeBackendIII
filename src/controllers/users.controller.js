import { usersService } from "../services/index.js";
import UserDTO from "../dto/User.dto.js";
import { CustomError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";
import { Errors } from "../utils/errors.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAll();

    const result = users.map((user) => UserDTO.getUserTokenFrom(user));

    logger.info("✅ Los Usuarios se Obtuvieron Correctamente!");
    res.send({ status: "success", payload: result });
  } catch (error) {
    logger.error("❌ Hubo un Error al querer Obtener a los Usuarios...", error);
    next(new CustomError(500, Errors.GENERAL.SERVER_ERROR.message));
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    const user = await usersService.getUserById(userId);

    if (!user) {
      logger.warning(
        `❌ El Usuario con ID ${userId} no se encontró en la Base de Datos...`
      );
      return next(new CustomError(404, Errors.USER.NOT_FOUND.message));
    }

    const userDTO = UserDTO.getUserTokenFrom(user);

    logger.info(`✅ El Usuario con ID ${userId} se Obtuvo con Éxito!`);
    res.send({ status: "success", payload: userDTO });
  } catch (error) {
    logger.error("❌ Hubo un Error al querer Obtener al Usuario...", error);
    next(new CustomError(500, Errors.GENERAL.SERVER_ERROR.message));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    const updateBody = req.body;

    const user = await usersService.getUserById(userId);

    if (!user) {
      logger.warning(
        `❌ No se encontró al Usuario con ID ${userId} para poder Actualizar sus Datos...`
      );
      return next(new CustomError(404, Errors.USER.NOT_FOUND.message));
    }

    await usersService.update(userId, updateBody);

    logger.info(
      `✅ El Usuario con ID ${userId} fue Actualizado Correctamente!`
    );
    res.send({
      status: "success",
      message: "Usuario Actualizado Correctamente!",
    });
  } catch (error) {
    logger.error(
      "❌ Hubo un Error al querer Actualizar los Datos del Usuario...",
      error
    );
    next(new CustomError(500, Errors.GENERAL.SERVER_ERROR.message));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    const user = await usersService.getUserById(userId);

    if (!user) {
      logger.warning(
        `❌ No se encontró al Usuario con ID ${userId} en la Base de Datos para poder Eliminarlo...`
      );
      return next(new CustomError(404, Errors.USER.NOT_FOUND.message));
    }

    await usersService.delete(userId);

    logger.info(`✅ El Usuario con ID ${userId} fue Eliminado Correctamente!`);
    res.send({
      status: "success",
      message: "Usuario Eliminado Correctamente.",
    });
  } catch (error) {
    logger.error("❌ Hubo un Error al querer Eliminar al Usuario...", error);
    next(new CustomError(500, Errors.GENERAL.SERVER_ERROR.message));
  }
};

export default {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
