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
    res.send({
      status: "success",
      message: "Los Usuarios se Obtuvieron Correctamente!",
      payload: result,
    });
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
        `❌ El Usuario con el ID ${userId} no fue encontrado en la Base de Datos...`
      );
      return next(new CustomError(404, Errors.USER.USER_NOT_FOUND.message));
    }

    const userDTO = UserDTO.getUserTokenFrom(user);

    logger.info(`✅ El Usuario con el ID ${userId} se Obtuvo con Éxito!`);
    res.send({
      status: "success",
      message: "Usuario Obtenido Correctamente!",
      payload: userDTO,
    });
  } catch (error) {
    logger.error("❌ Hubo un Error al querer Obtener al Usuario...", error);
    next(new CustomError(500, Errors.GENERAL.SERVER_ERROR.message));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    const updateBody = req.body;

    if (!Object.keys(updateBody).length) {
      logger.warning(
        `⚠️ Faltan Campos / Datos para poder Actualizar / Modificar al Usuario con el ID ${userId}...`
      );
      return next(new CustomError(400, Errors.USER.INCOMPLETE_FIELDS.message));
    }

    const user = await usersService.getUserById(userId);

    if (!user) {
      logger.warning(
        `❌ El Usuario con el ID ${userId} no fue encontrado para Actualizar / Modificar...`
      );
      return next(new CustomError(404, Errors.USER.USER_NOT_FOUND.message));
    }

    await usersService.update(userId, updateBody);

    logger.info(
      `✅ El Usuario con el ID ${userId} fue Actualizado Correctamente!`
    );
    res.send({
      status: "success",
      message: "Usuario Actualizado Correctamente!",
    });
  } catch (error) {
    logger.error(
      "❌ Hubo un Error al querer Actualizar / Modificar los Datos del Usuario...",
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
        `❌ El Usuario con el ID ${userId} no existe o no se encuentra en la Base de Datos para poder Eliminarlo...`
      );
      return next(new CustomError(404, Errors.USER.USER_NOT_FOUND.message));
    }

    await usersService.delete(userId);

    logger.info(
      `✅ El Usuario con el ID ${userId} fue Eliminado Correctamente!`
    );
    res.send({
      status: "success",
      message: "Usuario Eliminado Correctamente.",
    });
  } catch (error) {
    logger.error("❌ Hubo un Error al querer Eliminar al Usuario...", error);
    next(new CustomError(500, Errors.GENERAL.SERVER_ERROR.message));
  }
};

const addDocumentsToUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    const documents = req.uploadedDocs || [];

    const pets = req.uploadedPets || [];

    const user = await usersService.getUserById(userId);

    if (!user) {
      logger.warning(
        `❌ El Usuario con el ID ${userId} no fue encontrado o no existe en la Base de Datos para Adjuntarle Documentos...`
      );
      return next(new CustomError(404, Errors.USER.USER_NOT_FOUND.message));
    }

    const updatedDocs = user.documents
      ? [...user.documents, ...documents]
      : [...documents];

    const updatedPets = user.pets ? [...user.pets, ...pets] : [...pets];

    await usersService.update(userId, {
      documents: updatedDocs,
      pets: updatedPets,
    });
    logger.info(
      `✅ Documentos y Mascotas Agregados Correctamente al Usuario ${userId}!`
    );
    res.send({
      status: "success",
      message: "Documentos y Mascotas Agregados Correctamente al Usuario!",
      payload: {
        documents: updatedDocs,
        pets: updatedPets,
      },
    });
  } catch (error) {
    logger.error(
      "❌ Hubo un Error al querer Agregar los Documentos o Mascotas al Usuario...",
      error
    );
    next(new CustomError(500, Errors.GENERAL.SERVER_ERROR.message));
  }
};

export default {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  addDocumentsToUser,
};
