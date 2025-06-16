import supertest from "supertest";
import mongoose from "mongoose";
import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import app from "../src/app.js";
import petModel from "../src/dao/models/Pet.js";

const requester = supertest(app);

function expectValidPet(pet) {
  expect(pet).to.have.property("_id");
  expect(mongoose.isValidObjectId(pet._id)).to.be.true;
  expect(pet).to.have.property("name");
  expect(pet).to.have.property("specie");
  expect(pet).to.have.property("birthDate");
}

describe("🐶🐾​🐱​ PETS ​〰️ Test Funcional para el Endpoint /api/pets !", function () {
  this.timeout(10000);

  let testPetId;

  const testPet = {
    name: "Mascota",
    specie: "Test",
    birthDate: "2014-04-13",
  };
  before(async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://corazon_de_chocolate:1455@cluster0.mulyi.mongodb.net/adoptme_test"
      );

      const petCreated = await petModel.create(testPet);

      testPetId = petCreated._id.toString();
    } catch (error) {
      console.error(
        "❌ Hubo un Error al querer Conectar con la Base de Datos...",
        error
      );
      throw error;
    }
  });
  after(async () => {
    await petModel.deleteMany({ specie: /Test/ });
    await mongoose.disconnect();
  });

  // 🟢 GET
  it("GET /api/pets 🟢 Tiene que Mostrar a Todas las Mascotas!", async () => {
    const res = await requester.get("/api/pets");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("payload");
    expect(Array.isArray(res.body.payload)).to.be.true;
    if (res.body.payload.length > 0) {
      expectValidPet(res.body.payload[0]);
    }
  });

  // 🟢 POST
  it("POST /api/pets 🟢 Tiene que Crear una Nueva Mascota!", async () => {
    const newPet = {
      name: "NuevaMascota",
      specie: "NuevoTest",
      birthDate: "2016-04-10",
    };

    const res = await requester

      .post("/api/pets")
      .send(newPet)
      .set("Content-Type", "application/json");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("payload");
    expectValidPet(res.body.payload);
    expect(res.body.payload.name).to.equal(newPet.name);
  });

  // 🔴 POST Campo / Dato Incompleto
  it("POST /api/pets 🔴 Tiene que Fallar si Falta un Campo Requerido...", async () => {
    const res = await requester.post("/api/pets").send({ name: "SinSpecie" });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("status", "error");
  });

  // 🟢 PUT
  it("PUT /api/pets/:pid 🟢 Tiene que Actualizar a una Mascota ya Existente!", async () => {
    const updateData = { name: "TestPetUpdated" };

    const res = await requester.put(`/api/pets/${testPetId}`).send(updateData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("payload");
    expect(res.body.payload.name).to.equal(updateData.name);
  });

  // 🔴 PUT con ID Inválido
  it("PUT /api/pets/:pid 🔴 Tiene que Fallar si el ID no es Válido...", async () => {
    const res = await requester
      .put(`/api/pets/invalidID`)
      .send({ name: "Test" });

    expect(res.status).to.be.oneOf([400, 404]);
    expect(res.body).to.have.property("status", "error");
  });

  // 🔴 PUT Mascota Inexistente
  it("PUT /api/pets/:pid 🔴 Tiene que Fallar si la Mascota no Existe...", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await requester
      .put(`/api/pets/${nonExistentId}`)
      .send({ name: "Ghost" });

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("status", "error");
  });

  // 🟢 DELETE
  it("DELETE /api/pets/:pid 🟢 Tiene que Eliminar a una Mascota de la Base de Datos!", async () => {
    const petToDelete = await petModel.create({
      name: "BorrarMascota",
      specie: "TestEliminar",
      birthDate: "2025-01-22",
    });

    const res = await requester.delete(`/api/pets/${petToDelete._id}`);

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
  });

  // 🔴 DELETE con ID Inválido
  it("DELETE /api/pets/:pid 🔴 Tiene que Fallar si el ID es Inválido...", async () => {
    const res = await requester.delete("/api/pets/invalid-id");

    expect(res.status).to.be.oneOf([400, 404]);
    expect(res.body).to.have.property("status", "error");
  });

  // 🔴 DELETE Mascota Inexistente
  it("DELETE /api/pets/:pid 🔴 Tiene que Fallar si la Mascota no existe...", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await requester.delete(`/api/pets/${nonExistentId}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("status", "error");
  });
});
