import { Router } from "express";
import adoptionsController from "../controllers/adoptions.controller.js";
import logger from "../utils/logger.js";
import { validateMongoId } from "../middlewares/validateMongoId.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ADOPTIONS
 *   description: Gestión de las Adopciones de Mascotas.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Adoption:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID de la Adopción.
 *         userId:
 *           type: string
 *           description: ID del Usuario Adoptante.
 *         petId:
 *           type: string
 *           description: ID de la Mascota Adoptada.
 *         adoptionDate:
 *           type: string
 *           format: date-time
 *           description: Fecha y Hora de la Adopción.
 *       example:
 *         id: "644b1a7f12cd4567ef890123"
 *         userId: "62d13f9e1a3a7c0012345678"
 *         petId: "62d1401e1a3a7c0012345679"
 *         adoptionDate: "2024-05-15T10:30:00Z"
 */

/**
 * @swagger
 * /adoptions:
 *   get:
 *     summary: Obtención de Todas las Adopciones Generadas.
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Lista Completa de Adopciones Generadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Adoption'
 */

router.get("/", (req, res, next) => {
  logger.info("GET /api/adoptions - Obteniendo Todas las Adopciones...");
  adoptionsController.getAllAdoptions(req, res, next);
});

/**
 * @swagger
 * /adoptions/{aid}:
 *   get:
 *     summary: Obtención de una Adopción Específica.
 *     tags: [Adoptions]
 *     parameters:
 *       - name: aid
 *         in: path
 *         required: true
 *         description: ID de la Adopción.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adopción Encontrada con Éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Adoption'
 *       400:
 *         description: El ID es Inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: El ID proporcionado es Inválido.
 *       404:
 *         description: Adopción Inexistente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: La Adopción no fue encontrada.
 *       500:
 *         description: Error Interno del Servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Hubo un Error al querer Obtener la Adopción.
 */

router.get("/:aid", validateMongoId("aid"), (req, res, next) => {
  logger.info(
    `GET /api/adoptions/${req.params.aid} - Obteniendo una Adopción Específica...`
  );
  adoptionsController.getAdoption(req, res, next);
});

/**
 * @swagger
 * /adoptions/{uid}/{pid}:
 *   post:
 *     summary: Registración / Creación de una Nueva Adopción.
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del Usuario Adoptante.
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la Mascota.
 *     responses:
 *       200:
 *         description: Mascota Adoptada Éxitosamente.
 *       400:
 *         description: Mascota ya Adoptada o Error de Validación.
 *       404:
 *         description: Usuario o Mascota no encontrados.
 *       500:
 *         description: Error Interno del Servidor.
 */

router.post("/:uid/:pid", (req, res, next) => {
  logger.info(
    `POST /api/adoptions/${req.params.uid}/${req.params.pid} - Creando una Adopción...`
  );
  adoptionsController.createAdoption(req, res, next);
});

/**
 * @swagger
 * /adoptions/{aid}:
 *   put:
 *     summary: Actualiza / Modifica una Adopción Existente.
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: aid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la Adopción a Actualizar / Modificar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *               pet:
 *                 type: string
 *     responses:
 *       200:
 *         description: Adopción Actualizada / Modificada Éxitosamente.
 *       404:
 *         description: La Adopción no fue encontrada.
 *       500:
 *         description: Error Interno del Servidor.
 */

router.put("/:aid", validateMongoId("aid"), (req, res, next) => {
  logger.info(
    `PUT /api/adoptions/${req.params.aid} - Actualizando / Modificando una Adopción...`
  );
  adoptionsController.updateAdoption(req, res, next);
});

/**
 * @swagger
 * /adoptions/{aid}:
 *   delete:
 *     summary: Elimina una Adopción por su ID.
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: aid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la Adopción a Eliminar.
 *     responses:
 *       200:
 *         description: Adopción Eliminada Correctamente.
 *       404:
 *         description: La Adopción no se encontró.
 *       500:
 *         description: Error Interno del Servidor.
 */

router.delete("/:aid", validateMongoId("aid"), (req, res, next) => {
  logger.info(
    `DELETE /api/adoptions/${req.params.aid} - Eliminando una Adopción...`
  );
  adoptionsController.deleteAdoption(req, res, next);
});

export default router;
