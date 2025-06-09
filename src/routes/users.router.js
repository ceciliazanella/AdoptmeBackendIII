import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import logger from "../utils/logger.js";
import uploader from "../utils/uploader.js";
import { validateMongoId } from "../middlewares/validateMongoId.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: UUSERS
 *   description: Gestión de Usuarios en la Base de Datos.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene a Todos los Usuarios Registrados en la Base de Datos.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de Usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error Interno del Servidor...
 */

router.get("/", (req, res, next) => {
  logger.info("GET /api/users - Cargando a Todos los Usuarios...");
  usersController.getAllUsers(req, res, next);
});

/**
 * @swagger
 * /users/{uid}:
 *   get:
 *     summary: Obtiene un Usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de Mongo del Usuario a Obtener.
 *     responses:
 *       200:
 *         description: Usuario Encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID Inválido.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error Interno del Servidor.
 */

router.get("/:uid", validateMongoId("uid"), (req, res, next) => {
  logger.info(
    `GET /api/users/${req.params.uid} - Obteniendo Usuario por ID...`
  );
  usersController.getUser(req, res, next);
});

/**
 * @swagger
 * /users/{uid}:
 *   put:
 *     summary: Actualiza / Modifica los Datos de un Usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de Mongo del Usuario a Actualizar.
 *     requestBody:
 *       description: Campos / Datos del Usuario a Actualizar / Modificar (Al menos uno...).
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Lili Artusa"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "lili@example.com"
 *               age:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Usuario Actualizado / Modificado Correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos Inválidos.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error Interno del Servidor.
 */

router.put("/:uid", validateMongoId("uid"), (req, res, next) => {
  logger.info(
    `PUT /api/users/${req.params.uid} - Actualizando / Modificando los Datos del Usuario...`
  );
  usersController.updateUser(req, res, next);
});

/**
 * @swagger
 * /users/{uid}:
 *   delete:
 *     summary: Elimina a un Usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de Mongo del Usuario a Eliminar.
 *     responses:
 *       200:
 *         description: Usuario Eliminado Correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error Interno del Servidor.
 */

router.delete("/:uid", validateMongoId("uid"), (req, res, next) => {
  logger.info(`DELETE /api/users/${req.params.uid} - Eliminando Usuario...`);
  usersController.deleteUser(req, res, next);
});

/**
 * @swagger
 * /users/{uid}/documents:
 *   post:
 *     summary: Sube Documentos y Fotos de Mascotas para un Usuario Específico.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
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
 *                 description: Archivos de Documentos del Usuario.
 *               petImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Imágenes de Mascotas del Usuario.
 *     responses:
 *       200:
 *         description: Documentos y Fotos Subidos Correctamente.
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
 *                   example: Documentos y Fotos Agregados Correctamente al Usuario!
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
 *         description: No se Recibieron Archivos para Subir o el UID es Inválido.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error Interno del Servidor.
 */

router.post(
  "/:uid/documents",
  validateMongoId("uid"),
  uploader.fields([
    { name: "documents", maxCount: 5 },
    { name: "petImage", maxCount: 3 },
  ]),
  async (req, res, next) => {
    try {
      if (!req.files) {
        console.log("❌ No se Recibieron Archivos...");
        return res
          .status(400)
          .send({ status: "error", message: "No se Recibieron Archivos..." });
      }

      console.log("✅ Archivos Recibidos:", req.files);

      const uploadedDocs = Array.isArray(req.files?.documents)
        ? req.files.documents.map((file) => ({
            name: file.filename,
            path: `/img/documents/${file.filename}`,
          }))
        : [];

      const uploadedPets = Array.isArray(req.files?.petImage)
        ? req.files.petImage.map((file) => ({
            name: file.filename,
            path: `/img/pets/${file.filename}`,
          }))
        : [];

      req.uploadedDocs = uploadedDocs;
      req.uploadedPets = uploadedPets;

      return usersController.addDocumentsToUser(req, res, next);
    } catch (error) {
      console.error(
        "❌ Hubo un Error en la Ruta POST /:uid/documents...",
        error
      );
      next(error);
    }
  }
);

export default router;
