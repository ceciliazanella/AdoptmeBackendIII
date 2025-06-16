import supertest from "supertest";
import mongoose from "mongoose";
import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import app from "../src/app.js";
import userModel from "../src/dao/models/User.js";
import petModel from "../src/dao/models/Pet.js";
import adoptionModel from "../src/dao/models/Adoption.js";

const requester = supertest(app);

describe("😻​❤️‍🩹​​ ADOPTIONS ​〰️ TEST Funcional para el Endpoint /api/adoptions !", function () {
  this.timeout(10000);

  let testUserId;

  let testPetId;

  let testAdoptionId;

  const testUser = {
    first_name: "Adoptante",
    last_name: "Test",
    email: "adoptante@test.com",
    password: "Adoptante123",
  };

  const testPet = {
    name: "Pumba",
    specie: "Canino",
    age: 9,
    adopted: false,
  };
  before(async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://corazon_de_chocolate:1455@cluster0.mulyi.mongodb.net/adoptme_test"
      );

      const newUser = await userModel.create(testUser);

      testUserId = newUser._id.toString();

      const newPet = await petModel.create(testPet);

      testPetId = newPet._id.toString();
    } catch (error) {
      console.error(
        "❌ Hubo un Error al querer Conectarse a la Base de Datos...",
        error
      );
      throw error;
    }
  });
  after(async () => {
    await adoptionModel.deleteMany({});
    await petModel.deleteMany({ name: testPet.name });
    await userModel.deleteMany({ email: testUser.email });
    await mongoose.disconnect();
  });

  // 🟢 POST
  it("POST /api/adoptions/:uid/:pid 🟢 Tiene que Registrar una Adopción de forma Correcta!", async () => {
    const res = await requester.post(
      `/api/adoptions/${testUserId}/${testPetId}`
    );
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body.message).to.equal("Mascota Adoptada!");

    const adoption = await adoptionModel.findOne({
      owner: testUserId,
      pet: testPetId,
    });
    expect(adoption).to.exist;
    testAdoptionId = adoption._id.toString();
  });

  // 🟢 GET
  it("GET /api/adoptions 🟢 Tiene que Mostrar la Lista de las Adopciones!", async () => {
    const res = await requester.get("/api/adoptions");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body.payload).to.be.an("array");

    const found = res.body.payload.find((a) => a._id === testAdoptionId);

    expect(found).to.exist;
  });

  // 🟢 GET
  it("GET /api/adoptions/:aid 🟢 Tiene que Mostrar una Adopción en particular...", async () => {
    const res = await requester.get(`/api/adoptions/${testAdoptionId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body.payload).to.have.property("pet");
    expect(res.body.payload).to.have.property("owner");
  });

  // 🔴 POST Mascota ya Adoptada
  it("POST /api/adoptions/:uid/:pid 🔴 Si la Mascota ya fue Adoptada tiene que Fallar con un Status 400...", async () => {
    const res = await requester.post(
      `/api/adoptions/${testUserId}/${testPetId}`
    );
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("status", "error");
    expect(res.body.message).to.include("Esta Mascota ya fue Adoptada...");
  });

  // 🔴 POST Usuario Inexistente
  it("POST /api/adoptions/:uid/:pid 🔴 Si el Usuario no está en la Base de Datos tiene que Fallar con un Status 404...", async () => {
    const fakeUserId = "123456789012345678901234";

    const res = await requester.post(
      `/api/adoptions/${fakeUserId}/${testPetId}`
    );
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("status", "error");
    expect(res.body.message).to.include("Usuario");
  });

  // 🔴 POST con Mascota Inexistente
  it("POST /api/adoptions/:uid/:pid 🔴 Si la Mascota no está en la Base de Datos tiene que Fallar con un Status 404...", async () => {
    const fakePetId = "123456789012345678901234";

    const res = await requester.post(
      `/api/adoptions/${testUserId}/${fakePetId}`
    );
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("status", "error");
    expect(res.body.message).to.include("Mascota");
  });

  // 🔴 GET con ID Inválido
  it("GET /api/adoptions/:aid 🔴 Si el ID es Inválido tiene que Retornar un 400...", async () => {
    const res = await requester.get("/api/adoptions/invalidID");

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("status", "error");
    expect(res.body.message).to.include("Inválido");
  });

  // 🟢 PUT
  it("PUT /api/adoptions/:aid 🟢 Tiene que Modificar / Actualizar Correctamente una Adopción!", async () => {
    const nuevoUsuario = await userModel.create({
      first_name: "Nuevo",
      last_name: "Dueño",
      email: `nuevo${Date.now()}@adoptante.com`,
      password: "Nuevo123",
    });

    const res = await requester

      .put(`/api/adoptions/${testAdoptionId}`)
      .send({ owner: nuevoUsuario._id.toString() });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body.message).to.equal("Adopción Actualizada!");

    const adopActualizada = await adoptionModel.findById(testAdoptionId);

    expect(adopActualizada.owner.toString()).to.equal(
      nuevoUsuario._id.toString()
    );
    await userModel.findByIdAndDelete(nuevoUsuario._id);
  });

  // 🟢 DELETE
  it("DELETE /api/adoptions/:aid 🟢 Tiene que Eliminar Correctamente una Adopción!", async () => {
    const res = await requester.delete(`/api/adoptions/${testAdoptionId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body.message).to.equal("Adopción Eliminada!");

    const adopBorrada = await adoptionModel.findById(testAdoptionId);

    expect(adopBorrada).to.be.null;
  });
});
