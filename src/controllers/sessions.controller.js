import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import { handleUserError } from "../utils/errorHandler.js";

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return next(
        new CustomError(400, "Los Datos están Incompletos...", {
          field: "all fields",
        })
      );
    }

    const exists = await usersService.getUserByEmail(email);

    if (exists) {
      return next(handleUserError({ code: 11000 }));
    }

    const hashedPassword = await createHash(password);

    const user = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };

    const result = await usersService.create(user);

    console.log(result);
    res.send({ status: "success", payload: result._id });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new CustomError(400, "Datos Incompletos...", {
          field: "email and password",
        })
      );
    }

    const user = await usersService.getUserByEmail(email);

    if (!user) {
      return next(
        new CustomError(404, "El Usuario no existe...", { field: "email" })
      );
    }

    const isValidPassword = await passwordValidation(user, password);

    if (!isValidPassword) {
      return next(
        new CustomError(400, "Contraseña Incorrecta...", { field: "password" })
      );
    }

    const userDto = UserDTO.getUserTokenFrom(user);

    const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });

    res
      .cookie("coderCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Usuario Logueado!" });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res) => {
  const cookie = req.cookies["coderCookie"];

  try {
    const user = jwt.verify(cookie, "tokenSecretJWT");

    if (user) {
      return res.send({ status: "success", payload: user });
    }
  } catch (error) {
    return res.status(401).send({ status: "error", error: "Unauthorized..." });
  }
};

const unprotectedLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new CustomError(400, "Datos Incompletos...", {
          field: "email and password",
        })
      );
    }

    const user = await usersService.getUserByEmail(email);

    if (!user) {
      return next(
        new CustomError(404, "El Usuario no existe...", { field: "email" })
      );
    }

    const isValidPassword = await passwordValidation(user, password);

    if (!isValidPassword) {
      return next(
        new CustomError(400, "Contraseña Incorrecta...", { field: "password" })
      );
    }

    const token = jwt.sign(user, "tokenSecretJWT", { expiresIn: "1h" });

    res
      .cookie("unprotectedCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Unprotected Logged in..." });
  } catch (error) {
    next(error);
  }
};

const unprotectedCurrent = async (req, res) => {
  const cookie = req.cookies["unprotectedCookie"];

  try {
    const user = jwt.verify(cookie, "tokenSecretJWT");

    if (user) {
      return res.send({ status: "success", payload: user });
    }
  } catch (error) {
    return res.status(401).send({ status: "error", error: "Unauthorized..." });
  }
};

export default {
  current,
  login,
  register,
  unprotectedLogin,
  unprotectedCurrent,
};
