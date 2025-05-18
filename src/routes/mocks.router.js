import { Router } from "express";
import { generateMockUsers } from "../utils/mocking.utils.js";
import UserModel from "../dao/models/User.js";
import PetModel from "../dao/models/Pet.js";
import { generateMockPets } from "../utils/mocking.utils.js";

const router = Router();

// GET /api/mocks/mockingusers - Genera 50 Usuarios Falsos
router.get("/mockingusers", (req, res) => {
  const users = generateMockUsers(50);

  res.json({ status: "success", payload: users });
});

router.get("/mockingpets", (req, res) => {
  const pets = generateMockPets(100);

  res.json({ status: "success", payload: pets });
});

// POST /api/mocks/generateData?users=10&pets=20 - Guarda a los Usuarios y a las Mascotas
router.post("/generateData", async (req, res) => {
  const { users = 0, pets = 0 } = req.query;

  try {
    const mockUsers = generateMockUsers(Number(users));

    const createdUsers = await UserModel.insertMany(mockUsers);

    const mockPets = generateMockPets(Number(pets));

    const createdPets = await PetModel.insertMany(mockPets);

    res.json({
      status: "success",
      inserted: {
        users: createdUsers.length,
        pets: createdPets.length,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/generateData/test", async (req, res) => {
  try {
    const mockUsers = generateMockUsers(5);

    const mockPets = generateMockPets(5);

    res.json({ users: mockUsers, pets: mockPets });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Hubo un Error al Generar Datos de Prueba..." });
  }
});

export default router;
