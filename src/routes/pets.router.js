import { Router } from "express";
import petsController from "../controllers/pets.controller.js";
import uploader from "../utils/uploader.js";
import { generateMockPets } from "../utils/mockingPets.js";

const router = Router();
// Obtener Todas las Mascotas
router.get("/", petsController.getAllPets);
// Crear Nueva Mascota
router.post("/", petsController.createPet);
// Crear Nueva Mascota con Imagen
router.post(
  "/withimage",
  uploader.single("image"),
  petsController.createPetWithImage
);
// Actualizar Mascota
router.put("/:pid", petsController.updatePet);
// Eliminar Mascota
router.delete("/:pid", petsController.deletePet);
// Endpoint para generar 100 Mascotas Aleatoriamente
router.get("/mockingpets", (req, res) => {
  try {
    const mockPets = generateMockPets(100);

    res.status(200).json(mockPets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Hubo un Error al Generar Mascotas Tipo Mock..." });
  }
});

export default router;
