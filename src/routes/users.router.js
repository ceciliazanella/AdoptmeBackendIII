import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import logger from "../utils/logger.js";
import uploader from "../utils/uploader.js";
import { validateMongoId } from "../middlewares/validateMongoId.js";
import validateFiles from "../middlewares/validateFiles.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de Usuarios en la Base de Datos.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene a Todos los Usuarios Registrados.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de Usuarios Obtenida Correctamente!
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.get("/", (req, res, next) => {
  logger.info("GET /api/users - Cargando a Todos los Usuarios...");
  usersController.getAllUsers(req, res, next);
});

/**
 * @swagger
 * /users/{uid}:
 *   get:
 *     summary: Obtiene a un Usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de Mongo del Usuario.
 *     responses:
 *       200:
 *         description: Usuario Encontrado!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID Inválido.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.get("/:uid", validateMongoId("uid"), (req, res, next) => {
  logger.info(
    `GET /api/users/${req.params.uid} - Obteniendo a un Usuario por su ID...`
  );
  usersController.getUser(req, res, next);
});

/**
 * @swagger
 * /users/{uid}:
 *   put:
 *     summary: Actualiza / Modifica a los Datos de un Usuario.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de Mongo del Usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Usuario Actualizado / Modificado Correctamente!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos Inválidos.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.put("/:uid", validateMongoId("uid"), (req, res, next) => {
  logger.info(
    `PUT /api/users/${req.params.uid} - Actualizando / Modificando a un Usuario...`
  );
  usersController.updateUser(req, res, next);
});

/**
 * @swagger
 * /users/{uid}:
 *   delete:
 *     summary: Elimina a un Usuario.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de Mongo del Usuario.
 *     responses:
 *       200:
 *         description: Usuario Eliminado Correctamente!
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.delete("/:uid", validateMongoId("uid"), (req, res, next) => {
  logger.info(
    `DELETE /api/users/${req.params.uid} - Eliminando a un Usuario...`
  );
  usersController.deleteUser(req, res, next);
});

/**
 * @swagger
 * /users/{uid}/documents:
 *   post:
 *     summary: Sube Documentos y Fotos de las Mascotas del Usuario.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de Mongo del Usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               petImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Archivos Subidos Correctamente!
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
 *                   example: Documentos y Fotos Agregados Correctamente!
 *                 payload:
 *                   type: object
 *                   properties:
 *                     documents:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: documento1.pdf
 *                           path:
 *                             type: string
 *                             example: /img/documents/documento1.pdf
 *                     pets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: mascota1.jpg
 *                           path:
 *                             type: string
 *                             example: /img/pets/mascota1.jpg
 *       400:
 *         description: No se Recibieron Archivos para Subir...
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.post(
  "/:uid/documents",
  validateMongoId("uid"),
  (req, res, next) => {
    uploader.fields([
      { name: "documents", maxCount: 5 },
      { name: "petImage", maxCount: 3 },
    ])(req, res, (err) => {
      if (err) {
        logger.warning(`Error Multer: ${err.message}`);
        return res.status(400).json({
          status: "error",
          message: err.message,
        });
      }
      next();
    });
  },
  validateFiles,
  async (req, res, next) => {
    try {
      logger.info(`Archivos Recibidos: ${Object.keys(req.files).join(", ")}`);
      req.uploadedDocs = Array.isArray(req.files?.documents)
        ? req.files.documents.map((file) => ({
            name: file.filename,
            path: `/img/documents/${file.filename}`,
          }))
        : [];
      req.uploadedPets = Array.isArray(req.files?.petImage)
        ? req.files.petImage.map((file) => ({
            name: file.filename,
            path: `/img/pets/${file.filename}`,
          }))
        : [];
      await usersController.addDocumentsToUser(req, res, next);
    } catch (error) {
      logger.error(`Error en POST /:uid/documents: ${error.message}`);
      next(error);
    }
  }
);

export default router;
