import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import { handleUserError } from "../middlewares/errorHandler.js";
import { CustomError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      logger.warning("❌ Falló el Registro: Los Datos están Icompletos...");
      return next(
        new CustomError(400, "Los Datos están Incompletos...", {
          field: "all fields",
        })
      );
    }

    const exists = await usersService.getUserByEmail(email);

    if (exists) {
      logger.warning(
        `❌ Falló el Registro: El Usuario con el Email ${email} ya Existe en la Base de Datos...`
      );
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

    logger.info(`✅ Usuario Registrado Éxitosamente! ${email}`);

    res.send({ status: "success", payload: result._id });
  } catch (error) {
    logger.error("❌ Hubo un Error en el Registro del Usuario...:", error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warning("❌ Falta Email o Password para poder Ingresar...");
      return next(
        new CustomError(400, "Los Datos están Incompletos...", {
          field: "email and password",
        })
      );
    }

    const user = await usersService.getUserByEmail(email);

    if (!user) {
      logger.warning(
        `❌ No se encontró el Usuario con Email ${email} en la Base de Datos...`
      );
      return next(
        new CustomError(404, "El Usuario no existe...", { field: "email" })
      );
    }

    const isValidPassword = await passwordValidation(user, password);

    if (!isValidPassword) {
      logger.warning(`❌ Contraseña Incorrecta para ${email}...`);
      return next(
        new CustomError(400, "Contraseña Incorrecta...", { field: "password" })
      );
    }

    const userDto = UserDTO.getUserTokenFrom(user);

    const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });

    logger.info(`✅ Usuario ${email} Logueado Éxitosamente!`);

    res
      .cookie("coderCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Usuario Logueado!" });
  } catch (error) {
    logger.error("Error", error);
    next(error);
  }
};

const current = async (req, res) => {
  const cookie = req.cookies["coderCookie"];

  try {
    const user = jwt.verify(cookie, "tokenSecretJWT");

    if (user) {
      logger.info(`✅ Token Válido para el Usuario ${user.email}`);
      return res.send({ status: "success", payload: user });
    }
  } catch (error) {
    logger.warning("❌ Token Inválido o Expirado en la Ruta /current...");
    return res.status(401).send({ status: "error", error: "Unauthorized..." });
  }
};

const unprotectedLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warning("❌ Unprotected Login: Faltan Credenciales...");
      return next(
        new CustomError(400, "Datos Incompletos...", {
          field: "email and password",
        })
      );
    }

    const user = await usersService.getUserByEmail(email);

    if (!user) {
      logger.warning(`❌ Unprotected Login: Usuario no encontrado... ${email}`);
      return next(
        new CustomError(404, "El Usuario no existe...", { field: "email" })
      );
    }

    const isValidPassword = await passwordValidation(user, password);

    if (!isValidPassword) {
      logger.warning(`❌ Unprotected Login: Contraseña Incorrecta... ${email}`);
      return next(
        new CustomError(400, "Contraseña Incorrecta...", { field: "password" })
      );
    }

    const token = jwt.sign(user, "tokenSecretJWT", { expiresIn: "1h" });

    logger.info(`✅ Unprotected Login Éxitoso ${email}!`);

    res
      .cookie("unprotectedCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Unprotected Logged in..." });
  } catch (error) {
    logger.error("❌ Error en unprotectedLogin...", error);
    next(error);
  }
};

const unprotectedCurrent = async (req, res) => {
  const cookie = req.cookies["unprotectedCookie"];

  try {
    const user = jwt.verify(cookie, "tokenSecretJWT");

    if (user) {
      logger.info(`✅ Token Válido en UnprotectedCurrent para ${user.email}!`);
      return res.send({ status: "success", payload: user });
    }
  } catch (error) {
    logger.warning("❌ Token Inválido en unprotectedCurrent...");
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
