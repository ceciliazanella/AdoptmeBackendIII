import dotenv from "dotenv";

dotenv.config();

import supertest from "supertest";
import mongoose from "mongoose";
import { after, before, describe, it } from "mocha";
import { expect } from "chai";
import app from "../src/app.js";
import userModel from "../src/dao/models/User.js";

const requester = supertest(app);

describe("💻🔑 SESSIONS 〰️ Test Funcional para el Endpoint /api/sessions", function () {
  this.timeout(10000);

  const userMock = {
    first_name: "Nombre",
    last_name: "Apellido",
    email: "session@test.com",
    password: "Session123",
  };

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    console.log("✔️ Estás Conectado a la Base de Datos para Realizar Pruebas!");
  });
  after(async () => {
    await userModel.deleteMany({ email: userMock.email });
    await mongoose.disconnect();
  });

  // 🟢 POST
  it("POST /api/sessions/register 🟢 Tiene que Registrar al Usuario!", async () => {
    const res = await requester.post("/api/sessions/register").send(userMock);

    expect(res.body).to.have.property("payload");
  });

  // 🔴 POST Datos Incompletos
  it("POST /api/sessions/register 🔴 Tiene que Fallar si Faltan Datos...", async () => {
    const res = await requester.post("/api/sessions/register").send({
      email: "incompleto@test.com",
    });
    expect(res.status).to.equal(400);
  });

  // 🔴 POST Usuario ya Existente
  it("POST /api/sessions/register 🔴 Si el Usuario ya Existe tiene que Fallar con un 400...", async () => {
    const res = await requester.post("/api/sessions/register").send(userMock);

    expect(res.status).to.equal(400);
  });

  // 🟢 POST
  it("POST /api/sessions/login 🟢 Tiene que Realizar el Login y Devolver una Cookie!", async () => {
    const res = await requester.post("/api/sessions/login").send(userMock);

    const cookie = res.headers["set-cookie"]?.[0];

    expect(cookie).to.exist;
    expect(cookie.split("=")[0]).to.equal("coderCookie");
  });

  // 🔴 POST Datos Incompletos
  it("POST /api/sessions/login 🔴 Con Datos Incompletos tiene que Fallar...", async () => {
    const res = await requester
      .post("/api/sessions/login")
      .send({ email: userMock.email });

    expect(res.status).to.equal(400);
  });

  // 🔴 POST Usuario Inexistente
  it("POST /api/sessions/login 🔴 Si el Usuario no existe tiene que Fallar...", async () => {
    const res = await requester.post("/api/sessions/login").send({
      email: "noexiste@test.com",
      password: "123456",
    });
    expect(res.status).to.equal(404);
  });

  // 🔴 POST Contraseña Incorrecta
  it("POST /api/sessions/login 🔴 Si la Contraseña es Incorrecta tiene que Fallar...", async () => {
    const res = await requester.post("/api/sessions/login").send({
      email: userMock.email,
      password: "claveMala",
    });
    expect(res.status).to.equal(400);
  });

  // 🟢 GET
  it("GET /api/sessions/current 🟢 Tiene que Dar Datos si la Sesión está Activa!", async () => {
    const loginRes = await requester.post("/api/sessions/login").send(userMock);

    const cookie = loginRes.headers["set-cookie"];

    const res = await requester
      .get("/api/sessions/current")
      .set("Cookie", cookie);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.nested.property("payload.email", userMock.email);
  });

  // 🔴 GET Sin Cookie
  it("GET /api/sessions/current 🔴 Sin Cookie tiene que Fallar con un 401...", async () => {
    const res = await requester.get("/api/sessions/current");

    expect(res.status).to.equal(401);
  });

  // 🟢 POST
  it("POST /api/sessions/logout 🟢 Tiene que Cerrar la Sesión!", async () => {
    const loginRes = await requester.post("/api/sessions/login").send(userMock);

    const cookie = loginRes.headers["set-cookie"];

    const res = await requester
      .post("/api/sessions/logout")
      .set("Cookie", cookie);

    expect(res.status).to.equal(200);
  });

  // 🟢 POST
  it("POST /api/sessions/unprotectedLogin 🟢 Tiene que Responder con un 200!", async () => {
    const res = await requester.post("/api/sessions/unprotectedLogin").send({
      email: userMock.email,
      password: userMock.password,
    });
    expect(res.status).to.equal(200);
  });

  // 🔴 GET Sin Cookie
  it("GET /api/sessions/unprotectedCurrent 🔴 Sin Cookie tiene que Responder con un 401...", async () => {
    const res = await requester.get("/api/sessions/unprotectedCurrent");

    expect(res.status).to.equal(401);
  });

  // 🟢 GET
  it("GET /api/sessions/unprotectedCurrent 🟢 Con Cookie tiene que Responder con un 200!", async () => {
    const loginRes = await requester.post("/api/sessions/login").send(userMock);

    const cookie = loginRes.headers["set-cookie"];

    const res = await requester
      .get("/api/sessions/unprotectedCurrent")
      .set("Cookie", cookie);

    expect(res.status).to.equal(200);
  });
});
