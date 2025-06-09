import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";
import logger from "../utils/logger.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SESSIONS
 *   description: Manejo de la Autenticación y las Sesiones de Usuarios.
 */

/**
 * @swagger
 * /sessions/register:
 *   post:
 *     summary: Registro para un Usuario Nuevo en la Base de Datos.
 *     tags: [Sessions]
 *     requestBody:
 *       description: Información / Datos para poder Registrar a un Nuevo Usuario.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 example: "pass123"
 *     responses:
 *       201:
 *         description: El Usuario se Registró con Éxito!
 *       400:
 *         description: Los Datos están Incompletos o son Inválidos...
 *       409:
 *         description: Este Usuario ya Existe en la Base de Datos...
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */

router.post("/register", (req, res, next) => {
  logger.info(
    "POST /api/sessions/register - Registrando a un Nuevo Usuario..."
  );
  sessionsController.register(req, res, next);
});

/**
 * @swagger
 * /sessions/login:
 *   post:
 *     summary: Inicio de la Sesión con Email y Contraseña.
 *     tags: [Sessions]
 *     requestBody:
 *       description: Credenciales / Datos para poder Iniciar Sesión / Login.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 example: "pass123"
 *     responses:
 *       200:
 *         description: El Usuario Inició Sesión Correctamente!
 *       401:
 *         description: Los Datos Ingresados son Inválidos...
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */

router.post("/login", (req, res, next) => {
  logger.info("POST /api/sessions/login - Iniciando Sesión...");
  sessionsController.login(req, res, next);
});

/**
 * @swagger
 * /sessions/current:
 *   get:
 *     summary: Obtención de los Datos de la Sesión del Usuario Logueado.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión Activa con la Información del Usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSession'
 *       401:
 *         description: El Usuario no está Logueado con su Sesión...
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */

router.get("/current", (req, res, next) => {
  logger.info(
    "GET /api/sessions/current - Obteniendo la Sesión Actual del Usuario..."
  );
  sessionsController.current(req, res, next);
});

/**
 * @swagger
 * /sessions/unprotectedLogin:
 *   get:
 *     summary: Endpoint para Login del Usuario sin Protección (Sólo para realizar Pruebas).
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Se Efectuó el Login del Usuario sin Protección.
 */

router.get("/unprotectedLogin", (req, res, next) => {
  logger.info("GET /api/sessions/unprotectedLogin - Login no protegido...");
  sessionsController.unprotectedLogin(req, res, next);
});

/**
 * @swagger
 * /sessions/unprotectedCurrent:
 *   get:
 *     summary: Obtención de la Sesión del Usuario sin Validación (Sólo para realizar Pruebas).
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Se Generó la Sesión Actual sin Protección.
 */

router.get("/unprotectedCurrent", (req, res, next) => {
  logger.info("GET /api/sessions/unprotectedCurrent - Sesión no protegida...");
  sessionsController.unprotectedCurrent(req, res, next);
});

/**
 * @swagger
 * /sessions/logout:
 *   post:
 *     summary: Cerrar la Sesión del Usuario y Limpiar la Cookie de Autenticación.
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: El Logout fue Exitoso!
 *       400:
 *         description: No hay Sesión Activa para Cerrar...
 *       500:
 *         description: Hubo un Error Interno del Servidor...
 */

router.post("/logout", (req, res, next) => {
  logger.info("POST /api/sessions/logout - Cerrando la Sesión...");
  sessionsController.logout(req, res, next);
});

export default router;
