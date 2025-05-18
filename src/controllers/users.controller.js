import { usersService } from "../services/index.js";
import { Errors } from "../utils/errors.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();

    res.send({ status: "success", payload: users });
  } catch (error) {
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;

    const user = await usersService.getUserById(userId);

    if (!user) return res.status(404).send(Errors.USER.AUTHENTICATION_FAILED);
    res.send({ status: "success", payload: user });
  } catch (error) {
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

const updateUser = async (req, res) => {
  try {
    const updateBody = req.body;

    const userId = req.params.uid;

    const user = await usersService.getUserById(userId);

    if (!user) return res.status(404).send(Errors.USER.AUTHENTICATION_FAILED);
    await usersService.update(userId, updateBody);
    res.send({
      status: "success",
      message: "Datos de Usuario Actualizados...",
    });
  } catch (error) {
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uid;

    const user = await usersService.getUserById(userId);

    if (!user) return res.status(404).send(Errors.USER.AUTHENTICATION_FAILED);
    await usersService.delete(userId);
    res.send({ status: "success", message: "Usuario Eliminado..." });
  } catch (error) {
    res.status(500).send(Errors.GENERAL.SERVER_ERROR);
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
};
