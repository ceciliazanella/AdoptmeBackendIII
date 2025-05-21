import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";
import logger from "../utils/logger.js";

const router = Router();

router.post("/register", (req, res, next) => {
  logger.info("POST /api/sessions/register - Para Registro de un Usuario...");
  sessionsController.register(req, res, next);
});

router.post("/login", (req, res, next) => {
  logger.info("POST /api/sessions/login - Para Inicio de Sesión...");
  sessionsController.login(req, res, next);
});

router.get("/current", (req, res, next) => {
  logger.info("GET /api/sessions/current - Usuario Actual...");
  sessionsController.current(req, res, next);
});

router.get("/unprotectedLogin", (req, res, next) => {
  logger.info("GET /api/sessions/unprotectedLogin - Login No Protegido...");
  sessionsController.unprotectedLogin(req, res, next);
});

router.get("/unprotectedCurrent", (req, res, next) => {
  logger.info(
    "GET /api/sessions/unprotectedCurrent - Usuario Actual No Protegido..."
  );
  sessionsController.unprotectedCurrent(req, res, next);
});

export default router;
