import { Router } from "express";
import adoptionsController from "../controllers/adoptions.controller.js";
import logger from "../utils/logger.js";

const router = Router();

router.get("/", (req, res, next) => {
  logger.info("GET /api/adoptions - Mostrando todas las Adopciones...");
  adoptionsController.getAllAdoptions(req, res, next);
});

router.get("/:aid", (req, res, next) => {
  logger.info(
    `GET /api/adoptions/${req.params.aid} - Obteniendo Adopción por ID...`
  );
  adoptionsController.getAdoption(req, res, next);
});

router.post("/:uid/:pid", (req, res, next) => {
  logger.info(
    `POST /api/adoptions/${req.params.uid}/${req.params.pid} - Creando una Nueva Adopción...`
  );
  adoptionsController.createAdoption(req, res, next);
});

export default router;
