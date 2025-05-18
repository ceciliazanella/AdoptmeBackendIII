import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import { Errors } from "../utils/errors.js";
import __dirname from "../utils/index.js";
// Obtener Mascotas
const getAllPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();

    res.send({ status: "success", payload: pets });
  } catch (error) {
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};
// Crear Mascota
const createPet = async (req, res) => {
  const { name, specie, birthDate } = req.body;

  if (!name || !specie || !birthDate) {
    return res.status(400).send(Errors.PET.INCOMPLETE_FIELDS);
  }
  try {
    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });

    const result = await petsService.create(pet);

    res.send({
      status: "success",
      message: "La Mascota fue Creada con Éxito!",
      payload: result,
    });
  } catch (error) {
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};
// Actualizar Mascota
const updatePet = async (req, res) => {
  const petUpdateBody = req.body;

  const petId = req.params.pid;

  try {
    const result = await petsService.update(petId, petUpdateBody);

    if (!result) {
      return res.status(404).send(Errors.PET.PET_NOT_FOUND);
    }
    res.send({
      status: "success",
      message: "Los Datos de esta Mascota fueron Actualizados...",
      payload: result,
    });
  } catch (error) {
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};
// Eliminar una Mascota
const deletePet = async (req, res) => {
  const petId = req.params.pid;

  try {
    const result = await petsService.delete(petId);

    if (!result) {
      return res.status(404).send(Errors.PET.PET_NOT_FOUND);
    }
    res.send({
      status: "success",
      message: "Esta Mascota fue Eliminada Correctamente...",
      payload: result,
    });
  } catch (error) {
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};
// Crear Mascota con Imagen
const createPetWithImage = async (req, res) => {
  const file = req.file;

  const { name, specie, birthDate } = req.body;

  if (!name || !specie || !birthDate) {
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

    res.send({
      status: "success",
      message: "Se Creó Mascota con su Imagen con Éxito!",
      payload: result,
    });
  } catch (error) {
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
