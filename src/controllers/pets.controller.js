import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import { Errors } from "../utils/errors.js";
import __dirname from "../utils/index.js";

const getAllPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();

    req.logger.info("✅ Se Obtuvieron Todas las Mascotas!");
    res.send({
      status: "success",
      message: "Se Obtuvieron Todas las Mascotas!",
      payload: pets,
    });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Obtener a Todas las Mascotas...: " +
        error.message
    );
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

const createPet = async (req, res) => {
  const { name, specie, birthDate } = req.body;

  if (!name || !specie || !birthDate) {
    req.logger.warning(
      "⚠️ Los Datos están Incompletos para poder Crear una Nueva Mascota..."
    );
    return res.status(400).send(Errors.PET.INCOMPLETE_FIELDS);
  }

  try {
    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });

    const result = await petsService.create(pet);

    req.logger.info(`✅ La Mascota '${name}' fue Creada Correctamente!`);
    res.send({
      status: "success",
      message: "La Mascota fue Creada con Éxito!",
      payload: result,
    });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Crear la Mascota...: " + error.message
    );
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

const updatePet = async (req, res) => {
  const petUpdateBody = req.body;

  const petId = req.params.pid;

  try {
    const result = await petsService.update(petId, petUpdateBody);

    if (!result) {
      req.logger.warning(
        `⚠️ No se encontró la Mascota con el ID ${petId} en la Base de Datos...`
      );
      return res.status(404).send(Errors.PET.PET_NOT_FOUND);
    }

    req.logger.info(
      `✅ Los Datos de la Mascota ${petId} fueron Actualizados con Éxito!`
    );
    res.send({
      status: "success",
      message: "Los Datos de esta Mascota fueron Actualizados!",
      payload: result,
    });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Actualizar los Datos de esta Mascota...: " +
        error.message
    );
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

const deletePet = async (req, res) => {
  const petId = req.params.pid;

  try {
    const result = await petsService.delete(petId);

    if (!result) {
      req.logger.warning(
        `⚠️ No se encontró la Mascota con el ID ${petId} en la Base de Datos para poder Eliminarla...`
      );
      return res.status(404).send(Errors.PET.PET_NOT_FOUND);
    }

    req.logger.info(`✅ La Mascota ${petId} fue Eliminada Correctamente!`);
    res.send({
      status: "success",
      message: "Esta Mascota fue Eliminada Correctamente!",
      payload: result,
    });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Eliminar esta Mascota...: " + error.message
    );
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

const createPetWithImage = async (req, res) => {
  const file = req.file;

  const { name, specie, birthDate } = req.body;

  if (!name || !specie || !birthDate) {
    req.logger.warning(
      "⚠️ Los Datos están Incompletos para poder Crear esta Mascota con una Imagen..."
    );
    return res.status(400).send(Errors.PET.INCOMPLETE_FIELDS);
  }

  try {
    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`,
    });

    const result = await petsService.create(pet);

    req.logger.info(
      `✅ La Mascota '${name}' fue Creada con su Imagen Correctamente!`
    );
    res.send({
      status: "success",
      message: "Se Creó una Mascota con Imagen con Éxito!",
      payload: result,
    });
  } catch (error) {
    req.logger.error(
      "❌ Hubo un Error al querer Crear esta Mascota con su Imagen...: " +
        error.message
    );
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
