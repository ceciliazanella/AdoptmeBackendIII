import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";
import logger from "../utils/logger.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Manejo de la Autenticación y las Sesiones de Usuarios.
 */

/**
 * @swagger
 * /sessions/register:
 *   post:
 *     summary: Registro para un Usuario Nuevo en la Base de Datos.
 *     tags: [Sessions]
 *     requestBody:
 *       description: Información para Registrar a un Nuevo Usuario.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       201:
 *         description: Registro Éxitoso!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
 *       400:
 *         description: Datos Inválidos o Faltantes.
 *       409:
 *         description: Usuario ya Registrado con ese Email.
 *       500:
 *         description: Error Interno del Servidor.
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
 *     summary: Login / Inicio de Sesión para Usuarios Existentes.
 *     tags: [Sessions]
 *     requestBody:
 *       description: Credenciales para Iniciar Sesión.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: Login Éxitoso!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Datos Inválidos o Faltantes.
 *       401:
 *         description: Credenciales Incorrectas.
 *       500:
 *         description: Error Interno del Servidor.
 */
router.post("/login", (req, res, next) => {
  logger.info("POST /api/sessions/login - Intentando Login...");
  sessionsController.login(req, res, next);
});

/**
 * @swagger
 * /sessions/current:
 *   get:
 *     summary: Obtiene la Información del Usuario Logueado (Sesión Activa).
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del Usuario en Sesión.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSession'
 *       401:
 *         description: Token Inválido o Expirado.
 *       500:
 *         description: Error Interno del Servidor.
 */
router.get("/current", (req, res, next) => {
  logger.info(
    "GET /api/sessions/current - Obteniendo a un Usuario Logueado..."
  );
  sessionsController.current(req, res, next);
});

/**
 * @swagger
 * /sessions/unprotectedLogin:
 *   post:
 *     summary: Login NO protegido (Para Pruebas. Sin Validación de JWT).
 *     tags: [Sessions]
 *     requestBody:
 *       description: Credenciales para Iniciar Sesión.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: Login Éxitoso (Sin Protección).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Sesión Iniciada Sin Protección.
 *       400:
 *         description: Datos Inválidos o Faltantes.
 *       401:
 *         description: Credenciales Incorrectas.
 *       500:
 *         description: Error Interno del Servidor.
 */
router.post("/unprotectedLogin", (req, res, next) => {
  logger.info("POST /api/sessions/unprotectedLogin - Login Sin Protección...");
  sessionsController.unprotectedLogin(req, res, next);
});

/**
 * @swagger
 * /sessions/unprotectedCurrent:
 *   get:
 *     summary: Obtiene al Usuario Actual Sin Protección (Sin Validación JWT).
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Datos del Usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSession'
 *       500:
 *         description: Error Interno del Servidor.
 */
router.get("/unprotectedCurrent", (req, res, next) => {
  logger.info(
    "GET /api/sessions/unprotectedCurrent - Usuario Sin Protección..."
  );
  sessionsController.unprotectedCurrent(req, res, next);
});

/**
 * @swagger
 * /sessions/logout:
 *   post:
 *     summary: Cierra la Sesión del Usuario Actual.
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Sesión Cerrada Correctamente!
 *       500:
 *         description: Error Interno del Servidor.
 */
router.post("/logout", (req, res, next) => {
  logger.info("POST /api/sessions/logout - Cerrando Sesión...");
  sessionsController.logout(req, res, next);
});

export default router;
