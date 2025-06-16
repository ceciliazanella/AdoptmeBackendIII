import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";
import { Errors } from "../utils/errors.js";

const getAllAdoptions = async (req, res) => {
  try {
    const result = await adoptionsService.getAll();

    req.logger.info("✅ Se Obtuvieron Todas las Adopciones!");
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Obtener Todas las Adopciones... " +
        error.message
    );
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

const getAdoption = async (req, res) => {
  const adoptionId = req.params.aid;

  try {
    const adoption = await adoptionsService.getBy({ _id: adoptionId });

    if (!adoption) {
      req.logger.warning(
        `⚠️ La Adopción con el ID ${adoptionId} no se encontró o no existe...`
      );
      return res.status(404).send(Errors.ADOPTION.ADOPTION_NOT_FOUND);
    }
    req.logger.info(`✅ Adopción ${adoptionId} Encontrada!`);
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Obtener la Adopción..." + error.message
    );
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

const createAdoption = async (req, res) => {
  const { uid, pid } = req.params;

  try {
    const user = await usersService.getUserById(uid);

    if (!user) {
      req.logger.warning(
        `⚠️ El Usuario con el ID ${uid} no se encontró o no existe...`
      );
      return res.status(404).send(Errors.USER.USER_NOT_FOUND);
    }

    const pet = await petsService.getBy({ _id: pid });

    if (!pet) {
      req.logger.warning(
        `⚠️ La Mascota con el ID ${pid} no se encontró o no existe...`
      );
      return res.status(404).send(Errors.PET.PET_NOT_FOUND);
    }
    if (pet.adopted) {
      req.logger.warning(`⚠️ La Mascota ${pid} ya fue Adoptada!`);
      return res.status(400).send(Errors.PET.PET_ALREADY_ADOPTED);
    }
    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    await adoptionsService.create({ owner: user._id, pet: pet._id });
    req.logger.info(`✅ La Mascota ${pid} fue Adoptada por el Usuario ${uid}!`);
    res.send({ status: "success", message: "Mascota Adoptada!" });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Crear la Adopción..." + error.message
    );
    res.status(500).send(Errors.ADOPTION.ADOPTION_CREATION_FAILED);
  }
};

const updateAdoption = async (req, res) => {
  const { aid } = req.params;

  const updateData = req.body;

  try {
    const existingAdoption = await adoptionsService.getBy({ _id: aid });

    if (!existingAdoption) {
      req.logger.warning(
        `⚠️ La Adopción con el ID ${aid} no se encontró o no existe...`
      );
      return res.status(404).send(Errors.ADOPTION.ADOPTION_NOT_FOUND);
    }

    const updatedAdoption = await adoptionsService.update(aid, updateData);

    req.logger.info(
      `✅ La Adopción ${aid} fue Actualizada / Modificada Correctamente!`
    );
    res.status(200).send({
      status: "success",
      message: "Adopción Actualizada!",
      payload: updatedAdoption,
    });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Actualizar / Modificar la Adopción..." +
        error.message
    );
    res.status(500).send(Errors.ADOPTION.ADOPTION_UPDATE_FAILED);
  }
};

const deleteAdoption = async (req, res) => {
  const { aid } = req.params;

  try {
    const adoption = await adoptionsService.getBy({ _id: aid });

    if (!adoption) {
      req.logger.warning(
        `⚠️ La Adopción con el ID ${aid} no se encontró en la Base de Datos...`
      );
      return res.status(404).send(Errors.ADOPTION.ADOPTION_NOT_FOUND);
    }
    await adoptionsService.delete(aid);
    req.logger.info(`✅ La Adopción ${aid} fue Eliminada Correctamente!`);
    res.send({ status: "success", message: "Adopción Eliminada!" });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Eliminar la Adopción..." + error.message
    );
    res.status(500).send(Errors.ADOPTION.ADOPTION_DELETE_FAILED);
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
  updateAdoption,
  deleteAdoption,
};
