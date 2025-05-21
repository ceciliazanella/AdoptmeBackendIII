import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import logger from "../utils/logger.js";

const router = Router();

router.get("/", (req, res, next) => {
  logger.info("GET /api/users - Para Obtener Todos los Usuarios");
  usersController.getAllUsers(req, res, next);
});

router.get("/:uid", (req, res, next) => {
  logger.info(
    `GET /api/users/${req.params.uid} - Para Obtener un Usuario por ID...`
  );
  usersController.getUser(req, res, next);
});

router.put("/:uid", (req, res, next) => {
  logger.info(
    `PUT /api/users/${req.params.uid} - Para Actualizar un Usuario...`
  );
  usersController.updateUser(req, res, next);
});

router.delete("/:uid", (req, res, next) => {
  logger.info(
    `DELETE /api/users/${req.params.uid} - Para Eliminar un Usuario...`
  );
  usersController.deleteUser(req, res, next);
});

export default router;
