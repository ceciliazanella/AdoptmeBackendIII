import dotenv from "dotenv";

dotenv.config();

import supertest from "supertest";
import mongoose from "mongoose";
import { describe, it, before, after, afterEach } from "mocha";
import { expect } from "chai";
import app from "../src/app.js";
import userModel from "../src/dao/models/User.js";

const requester = supertest(app);

describe("👩‍🦰👨‍🦰 USERS - Test Funcional para el Endpoint /api/users", function () {
  this.timeout(15000);

  let testUserId = null;

  const testUser = {
    first_name: "User",
    last_name: "Test",
    email: "testuser@example.com",
    password: "123456",
  };
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await userModel.deleteMany({});
    const newUser = await userModel.create(testUser);
    testUserId = newUser._id.toString();
  });
  after(async () => {
    await userModel.deleteMany({});
    await mongoose.disconnect();
  });
  afterEach(async () => {
    await userModel.deleteMany({
      email: { $nin: [testUser.email] },
    });
  });

  // 🟢 GET
  it("GET /api/users 🟢 Tiene que Mostrar a Todos los Usuarios!", async () => {
    const res = await requester.get("/api/users");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("payload").that.is.an("array");

    const found = res.body.payload.find((u) => u.email === testUser.email);

    expect(found).to.exist;
    expect(found).to.have.property("email", testUser.email);
  });

  // 🟢 GET
  it("GET /api/users/:uid 🟢 Tiene que Mostrar a un Usuario Específico!", async () => {
    const res = await requester.get(`/api/users/${testUserId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("payload");
    expect(res.body.payload).to.have.property("email", testUser.email);
    expect(res.body.payload).to.not.have.property("_id");
  });

  // 🟢 PUT
  it("PUT /api/users/:uid 🟢 Tiene que Actualizar / Modificar a un Usuario!", async () => {
    const updatedData = { first_name: "Actualizado", last_name: "Actualizado" };

    const res = await requester
      .put(`/api/users/${testUserId}`)
      .send(updatedData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property(
      "message",
      "Usuario Actualizado Correctamente!"
    );

    const updatedUser = await userModel.findById(testUserId);

    expect(updatedUser.first_name).to.equal("Actualizado");
  });

  //🟢 DELETE
  it("DELETE /api/users/:uid 🟢 Tiene que Eliminar a un Usuario!", async () => {
    const userToDelete = await userModel.create({
      first_name: "Delete",
      last_name: "User",
      email: `deleteuser_${Date.now()}@example.com`,
      password: "123456",
    });

    const res = await requester.delete(
      `/api/users/${userToDelete._id.toString()}`
    );

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property(
      "message",
      "Usuario Eliminado Correctamente!"
    );

    const userInDb = await userModel.findById(userToDelete._id);

    expect(userInDb).to.be.null;
  });

  // 🔴 GET ID Inválido
  it("GET /api/users/:uid 🔴 Con ID Inválido Tiene que Devolver un 400...", async () => {
    const res = await requester.get("/api/users/invalidID");

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("status", "error");
    expect(res.body).to.have.property("message").that.includes("Inválido");
  });

  // 🔴 PUT Datos Incompletos
  it("PUT /api/users/:uid 🔴 Con Datos Incompletos tiene que Devolver un 400...", async () => {
    const newUser = await userModel.create({
      first_name: "Temp",
      last_name: "User",
      email: `tempuser_${Date.now()}@example.com`,
      password: "123456",
    });

    const res = await requester
      .put(`/api/users/${newUser._id.toString()}`)
      .send({});

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("status", "error");
    expect(res.body).to.have.property("message").that.includes("Faltan");
  });

  // 🟢 POST
  it("POST /api/users/:uid/documents 🟢 Tiene que Subir Documentos e Imágenes!", async () => {
    const newUser = await userModel.create({
      first_name: "Doc",
      last_name: "Uploader",
      email: `docuploader_${Date.now()}@example.com`,
      password: "123456",
    });

    const res = await requester

      .post(`/api/users/${newUser._id.toString()}/documents`)
      .attach("documents", Buffer.from("test document"), "doc1.pdf")
      .attach("petImage", Buffer.from("test image"), "pet1.jpg");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body)
      .to.have.property("message")
      .that.includes("Documentos y Fotos");
    expect(res.body).to.have.property("payload");
    expect(res.body.payload).to.have.property("documents").that.is.an("array");
    expect(res.body.payload).to.have.property("pets").that.is.an("array");
  });

  // 🔴 POST Sin Archivos para Subir
  it("POST /api/users/:uid/documents 🔴 Sin Archivos tiene que Devolver un 400...", async () => {
    const newUser = await userModel.create({
      first_name: "Doc",
      last_name: "Uploader",
      email: `docuploader2_${Date.now()}@example.com`,
      password: "123456",
    });

    const res = await requester.post(
      `/api/users/${newUser._id.toString()}/documents`
    );

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("status", "error");
    expect(res.body)
      .to.have.property("message")
      .that.includes("No se Recibieron Archivos para Subir...");
  });
});
