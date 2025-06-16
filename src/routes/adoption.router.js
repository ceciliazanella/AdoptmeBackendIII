import { Router } from "express";
import adoptionsController from "../controllers/adoptions.controller.js";
import logger from "../utils/logger.js";
import { validateMongoId } from "../middlewares/validateMongoId.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Adoptions
 *   description: Gestión de las Adopciones de Mascotas.
 */

/**
 * @swagger
 * /adoptions:
 *   get:
 *     summary: Obtención de Todas las Adopciones Generadas.
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista Completa de las Adopciones Generadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Adoption'
 *       500:
 *         description: Error Interno del Servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/", (req, res, next) => {
  logger.info("GET /api/adoptions - Obteniendo a Todas las Adopciones...");
  adoptionsController.getAllAdoptions(req, res, next);
});

/**
 * @swagger
 * /adoptions/{aid}:
 *   get:
 *     summary: Obtención de una Adopción Específica.
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: aid
 *         in: path
 *         required: true
 *         description: ID de la Adopción.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adopción Encontrada con Éxito!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Adoption'
 *       400:
 *         description: ID Inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Adopción no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error Interno del Servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID del Usuario Adoptante.
 *         schema:
 *           type: string
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID de la Mascota.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Adopción Registrada Éxitosamente!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Adopción Registrada Éxitosamente!
 *       400:
 *         description: La Mascota ya está Adoptada o Hubo un Error de Validación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Usuario o Mascota no encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error Interno del Servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
 *     summary: Actualiza / Modifica a una Adopción Existente.
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: ID de la Adopción a Actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               petId:
 *                 type: string
 *             example:
 *               userId: "62d13f9e1a3a7c0012345678"
 *               petId: "62d1401e1a3a7c0012345679"
 *     responses:
 *       200:
 *         description: Adopción Actualizada Éxitosamente!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: La Adopción no fue encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error Interno del Servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put("/:aid", validateMongoId("aid"), (req, res, next) => {
  logger.info(
    `PUT /api/adoptions/${req.params.aid} - Actualizando a una Adopción...`
  );
  adoptionsController.updateAdoption(req, res, next);
});

/**
 * @swagger
 * /adoptions/{aid}:
 *   delete:
 *     summary: Elimina una Adopción por su ID.
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: ID de la Adopción a Eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Adopción Eliminada Correctamente!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Adopción Eliminada Correctamente!
 *       404:
 *         description: La Adopción no fue encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error Interno del Servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/:aid", validateMongoId("aid"), (req, res, next) => {
  logger.info(
    `DELETE /api/adoptions/${req.params.aid} - Eliminando a una Adopción...`
  );
  adoptionsController.deleteAdoption(req, res, next);
});

export default router;
