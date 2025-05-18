import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";
import { Errors } from "../utils/errors.js";

const getAllAdoptions = async (req, res) => {
  const result = await adoptionsService.getAll();

  res.send({ status: "success", payload: result });
};

const getAdoption = async (req, res) => {
  const adoptionId = req.params.aid;

  const adoption = await adoptionsService.getBy({ _id: adoptionId });

  if (!adoption) {
    return res.status(404).send(Errors.ADOPTION.ADOPTION_NOT_FOUND);
  }
  res.send({ status: "success", payload: adoption });
};

const createAdoption = async (req, res) => {
  const { uid, pid } = req.params;

  const user = await usersService.getUserById(uid);

  if (!user) {
    return res.status(404).send(Errors.USER.USER_NOT_FOUND);
  }

  const pet = await petsService.getBy({ _id: pid });

  if (!pet) {
    return res.status(404).send(Errors.PET.PET_NOT_FOUND);
  }
  if (pet.adopted) {
    return res.status(400).send(Errors.PET.PET_ALREADY_ADOPTED);
  }
  user.pets.push(pet._id);
  await usersService.update(user._id, { pets: user.pets });
  await petsService.update(pet._id, { adopted: true, owner: user._id });
  await adoptionsService.create({ owner: user._id, pet: pet._id });
  res.send({ status: "success", message: "Mascota Adoptada!" });
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
