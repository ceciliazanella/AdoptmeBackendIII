import { Router } from "express";
import petsController from "../controllers/pets.controller.js";
import uploader from "../utils/uploader.js";
import { generateMockPets } from "../utils/mockingPets.js";
import logger from "../utils/logger.js";
import { validateMongoId } from "../middlewares/validateMongoId.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gestión de Mascotas en la Base de Datos.
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Obtener a Todas las Mascotas Registradas.
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de Mascotas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.get("/", (req, res, next) => {
  logger.info("GET /api/pets - Obteniendo a Todas las Mascotas...");
  petsController.getAllPets(req, res, next);
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Registrar a una Nueva Mascota (Sin Imagen).
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Datos de la Nueva Mascota.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specie
 *               - birthDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pumba
 *               specie:
 *                 type: string
 *                 example: Canino
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2016-04-10
 *     responses:
 *       201:
 *         description: Mascota Registrada Éxitosamente!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Datos Inválidos o Incompletos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.post("/", (req, res, next) => {
  logger.info("POST /api/pets - Creando a una Nueva Mascota...");
  petsController.createPet(req, res, next);
});

/**
 * @swagger
 * /pets/withimage:
 *   post:
 *     summary: Registrar a una Nueva Mascota con Imagen.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Datos de la Mascota y Archivo de la Imagen.
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - specie
 *               - birthDate
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Olivia
 *               specie:
 *                 type: string
 *                 example: Felino
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2014-04-13
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Mascota Registrada con Imagen.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Datos Inválidos o Imagen Faltante.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.post("/withimage", uploader.single("image"), (req, res, next) => {
  logger.info("POST /api/pets/withimage - Creando a una Mascota con Imagen...");
  petsController.createPetWithImage(req, res, next);
});

/**
 * @swagger
 * /pets/{pid}:
 *   put:
 *     summary: Actualizar / Modificar a una Mascota por su ID.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID de la Mascota.
 *         schema:
 *           type: string
 *           example: 60f71adf3b1d4c001c8b4567
 *     requestBody:
 *       required: true
 *       description: Campos a Modificar.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specie:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Mascota Actualizada Correctamente!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Datos Inválidos.
 *       404:
 *         description: Mascota no encontrada.
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.put("/:pid", validateMongoId("pid"), (req, res, next) => {
  logger.info(
    `PUT /api/pets/${req.params.pid} - Actualizando / Modificando Mascota...`
  );
  petsController.updatePet(req, res, next);
});

/**
 * @swagger
 * /pets/{pid}:
 *   delete:
 *     summary: Eliminar a una Mascota por su ID.
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: ID de la Mascota.
 *         schema:
 *           type: string
 *           example: 60f71adf3b1d4c001c8b4567
 *     responses:
 *       200:
 *         description: Mascota Eliminada Éxitosamente!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mascota Eliminada Éxitosamente!
 *       404:
 *         description: Mascota no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */
router.delete("/:pid", validateMongoId("pid"), (req, res, next) => {
  logger.info(
    `DELETE /api/pets/${req.params.pid} - Eliminando a la Mascota...`
  );
  petsController.deletePet(req, res, next);
});

/**
 * @swagger
 * /pets/mockingpets:
 *   get:
 *     summary: Obtener 100 Mascotas Generadas en Modo Mock.
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de Mscotas Generadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Se Produjo un Error al querer Generar Mascotas Mock.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Se Produjo un Error al querer Generar Mascotas Mock.
 */
router.get("/mockingpets", (req, res) => {
  try {
    logger.info(
      "GET /api/pets/mockingpets - Generando a Mascotas en Modo Mock..."
    );

    const mockPets = generateMockPets(100);

    res.status(200).json(mockPets);
  } catch (error) {
    logger.error(
      "Se Produjo un Error al querer Generar Mascotas Mock...",
      error.message
    );
    res.status(500).json({
      message: "Error al querer Generar Mascotas en Modo Mock.",
    });
  }
});

export default router;
