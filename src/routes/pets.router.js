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
 *   name: PETS
 *   description: Gestión de Mascotas en la Base de Datos.
 */

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Obtención de todas las Mascotas Registradas en la Base de Datos.
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Devuelve una Lista de Mascotas.
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
 *     summary: Registración / Creación de una Nueva Mascota (Sin Imagen).
 *     tags: [Pets]
 *     requestBody:
 *       description: Datos para poder Registrar / Crear una Nueva Mascota.
 *       required: true
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
 *                 example: "Pumba"
 *               specie:
 *                 type: string
 *                 example: "Canino"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "2016-04-10"
 *     responses:
 *       201:
 *         description: La Mascota fue Registrada / Creada con Éxito!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Los Datos Ingresados son Inválidos o están Incompletos...
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */

router.post("/", (req, res, next) => {
  logger.info("POST /api/pets - Creando una Nueva Mascota...");
  petsController.createPet(req, res, next);
});

/**
 * @swagger
 * /pets/withimage:
 *   post:
 *     summary: Creación / Registración de una Nueva Mascota (Con Imagen).
 *     tags: [Pets]
 *     requestBody:
 *       description: Formulario para poder Registrar / Crear una Nueva Mascota con su Imagen.
 *       required: true
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
 *                 example: "Olivia"
 *               specie:
 *                 type: string
 *                 example: "Felino"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "2014-04-13"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: La Mascota fue Registrada / Creada con su Imagen Correctamente!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Los Datos Ingresados son Inválidos o Falta la Imagen de la Mascota...
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */

router.post("/withimage", uploader.single("image"), (req, res, next) => {
  logger.info(
    "POST /api/pets/withimage - Creando una Mascota con su Imagen..."
  );
  petsController.createPetWithImage(req, res, next);
});

/**
 * @swagger
 * /pets/{pid}:
 *   put:
 *     summary: Actualización / Modificación de los Datos de una Mscota ya Existente en la Base de Datos.
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         description: ID de Identificación de la Mascota a Actualizar / Modificar.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f71adf3b1d4c001c8b4567"
 *     requestBody:
 *       description: Campos de Datos a Actualizar / Modificar (Al menos uno).
 *       required: true
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
 *         description: La Mascota fue Actualizada / Modificada Correctamente!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Los Datos son Inválidos...
 *       404:
 *         description: La Mascota no fue Encontrada o no Existe en la Base de Datos...
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
 *     summary: Eliminación de una Mascota por su ID de la Base de Datos.
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: pid
 *         description: ID de la Mascota a Eliminar.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f71adf3b1d4c001c8b4567"
 *     responses:
 *       200:
 *         description: La Mascota fue Eliminada de la Base de Datos con Éxito!
 *       404:
 *         description: La Mascota Búscada no se encuentra en la Base de Datos...
 *       500:
 *         description: Se Produjo un Error Interno del Servidor...
 */

router.delete("/:pid", validateMongoId("pid"), (req, res, next) => {
  logger.info(`DELETE /api/pets/${req.params.pid} - Eliminando Mascota...`);
  petsController.deletePet(req, res, next);
});

/**
 * @swagger
 * /pets/mockingpets:
 *   get:
 *     summary: Generación y Obtención de 100 Mascotas en Modo Prueba (Mock).
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de Mascotas Generadas en Modo Mock.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Se Produjo un Error al querer Generar a las Mascotas en Modo Mock...
 */

router.get("/mockingpets", (req, res) => {
  try {
    logger.info(
      "GET /api/pets/mockingpets - Generando Mascotas en Modo Mock..."
    );

    const mockPets = generateMockPets(100);

    res.status(200).json(mockPets);
  } catch (error) {
    logger.error(
      "Error al querer Generar las Mascotas en Modo Mock...",
      error.message
    );
    res.status(500).json({
      message: "Hubo un Error al querer Generar a las Mascotas en Tipo Mock...",
    });
  }
});

export default router;
