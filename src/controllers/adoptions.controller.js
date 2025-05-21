import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";
import { Errors } from "../utils/errors.js";

const getAllAdoptions = async (req, res) => {
  try {
    const result = await adoptionsService.getAll();

    req.logger.info("✅ Se Obtuvieron todas las Adopciones!");
    res.send({ status: "success", payload: result });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Obtener las Adopciones...: " + error.message
    );
    res.status(500).send({ status: "error", message: error.message });
  }
};

const getAdoption = async (req, res) => {
  const adoptionId = req.params.aid;

  try {
    const adoption = await adoptionsService.getBy({ _id: adoptionId });

    if (!adoption) {
      req.logger.warning(
        `⚠️ La Adopción con el ID ${adoptionId} no fue encontrada en la Base de Datos...`
      );
      return res.status(404).send(Errors.ADOPTION.ADOPTION_NOT_FOUND);
    }

    req.logger.info(`✅ Adopción Encontrada con el ID ${adoptionId}!`);
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Obtener esta Adopción...: " + error.message
    );
    res.status(500).send({ status: "error", message: error.message });
  }
};

const createAdoption = async (req, res) => {
  const { uid, pid } = req.params;

  try {
    const user = await usersService.getUserById(uid);

    if (!user) {
      req.logger.warning(
        `⚠️ El Usuario con ID ${uid} no se encontró en la Base de Datos...`
      );
      return res.status(404).send(Errors.USER.USER_NOT_FOUND);
    }

    const pet = await petsService.getBy({ _id: pid });

    if (!pet) {
      req.logger.warning(
        `⚠️ La Mascota con ID ${pid} no se encontró en la Base de Datos...`
      );
      return res.status(404).send(Errors.PET.PET_NOT_FOUND);
    }

    if (pet.adopted) {
      req.logger.warning(`⚠️ La Mascota con ID ${pid} ya fue Adoptada...`);
      return res.status(400).send(Errors.PET.PET_ALREADY_ADOPTED);
    }

    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    await adoptionsService.create({ owner: user._id, pet: pet._id });

    req.logger.info(
      `✅ La Mascota ${pid} fue Adoptada por el Usuario ${uid} Correctamente!`
    );
    res.send({ status: "success", message: "Mascota Adoptada!" });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer realizar la Adopción...: " + error.message
    );
    res.status(500).send({ status: "error", message: error.message });
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
