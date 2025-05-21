import { Router } from "express";
import { generateMockUsers } from "../utils/mockingUsers.js";
import { generateMockPets } from "../utils/mockingPets.js";
import UserModel from "../dao/models/User.js";
import PetModel from "../dao/models/Pet.js";
import logger from "../utils/logger.js";

const router = Router();

// GET /api/mocks/mockingusers - Genera 50 Usuarios Falsos...
router.get("/mockingusers", (req, res, next) => {
  try {
    const users = generateMockUsers(50);

    logger.info("✅ Se Generaron 50 Usuarios Falsos a Modo de Prueba!");
    res.json({ status: "success", payload: users });
  } catch (error) {
    logger.error(
      "❌ Hubo un Error al querer Generar Usuarios en Modo Mock...",
      error
    );
    next(error);
  }
});

// GET /api/mocks/mockingpets - Genera 100 Mascotas Falsas (o la Cantidad que se Indique...)
router.get("/mockingpets", (req, res, next) => {
  try {
    const qty = parseInt(req.query.qty) || 100;

    const pets = generateMockPets(qty);

    logger.info(`✅ Se Generaron ${qty} Mascotas Falsas para Prueba...`);
    res.json({ status: "success", payload: pets });
  } catch (error) {
    logger.error(
      "❌ Hubo un Error al querer Generar Las Mascotas Mock...",
      error
    );
    next(error);
  }
});

// POST /api/mocks/generateData?users=10&pets=20 - Guarda a los Usuarios y a las Mascotas en la Base de Datos / Mongo...
router.post("/generateData", async (req, res, next) => {
  const { users = 0, pets = 0 } = req.query;

  try {
    logger.info(
      `Generando e Insertando ${users} Usuarios y ${pets} Mascotas...`
    );

    const mockUsers = generateMockUsers(Number(users));

    const createdUsers = await UserModel.insertMany(mockUsers);

    const mockPets = generateMockPets(Number(pets));

    const createdPets = await PetModel.insertMany(mockPets);

    logger.info(
      `✅ Se Incertaron ${createdUsers.length} Usuarios y ${createdPets.length} Mascotas...`
    );

    res.json({
      status: "success",
      inserted: {
        users: createdUsers.length,
        pets: createdPets.length,
      },
    });
  } catch (error) {
    logger.error(
      "❌ Hubo un Error al querer Insertar los Datos de Prueba...",
      error.message
    );
    next(error);
  }
});

// GET /api/mocks/generateData/test - Revisión de Datos (No los guarda...)
router.get("/generateData/test", async (req, res, next) => {
  try {
    const mockUsers = generateMockUsers(5);

    const mockPets = generateMockPets(5);

    logger.info(
      "✅ Se Generaron 5 Usuarios y 5 Mascotas para Prueba sin Guardar..."
    );

    res.json({ users: mockUsers, pets: mockPets });
  } catch (error) {
    logger.error(
      "❌ Error al querer Generar Datos de Prueba...",
      error.message
    );
    next(error);
  }
});

export default router;
