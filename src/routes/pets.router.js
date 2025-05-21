import { Router } from "express";
import petsController from "../controllers/pets.controller.js";
import uploader from "../utils/uploader.js";
import { generateMockPets } from "../utils/mockingPets.js";
import logger from "../utils/logger.js";

const router = Router();

router.get("/", (req, res, next) => {
  logger.info("GET /api/pets - Obteniendo a Todas las Mascotas...");
  petsController.getAllPets(req, res, next);
});

router.post("/", (req, res, next) => {
  logger.info("POST /api/pets - Creando una Nueva Mascota...");
  petsController.createPet(req, res, next);
});

router.post("/withimage", uploader.single("image"), (req, res, next) => {
  logger.info(
    "POST /api/pets/withimage - Creando una Mascota con su Imagen..."
  );
  petsController.createPetWithImage(req, res, next);
});

router.put("/:pid", (req, res, next) => {
  logger.info(
    `PUT /api/pets/${req.params.pid} - Actualizando Datos de Mascota...`
  );
  petsController.updatePet(req, res, next);
});

router.delete("/:pid", (req, res, next) => {
  logger.info(`DELETE /api/pets/${req.params.pid} - Eliminando Mascota...`);
  petsController.deletePet(req, res, next);
});

router.get("/mockingpets", (req, res) => {
  try {
    logger.info(
      "GET /api/pets/mockingpets - Para Generar 100 Mascotas Tipo Mock..."
    );
    const mockPets = generateMockPets(100);

    res.status(200).json(mockPets);
  } catch (error) {
    logger.error("❌ Error al querer Generar Mscotas Mock...", error.message);
    res.status(500).json({
      message: "Hubo un Error al querer Generar Mascotas Tipo Mock...",
    });
  }
});

export default router;
