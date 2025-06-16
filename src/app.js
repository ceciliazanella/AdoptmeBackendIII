import express from "express";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import addLogger from "./middlewares/addLogger.js";
import mocksRouter from "./routes/mocks.router.js";
import { swaggerDocs } from "./config/swagger.js";

const app = express();

// Logger
app.use(addLogger);

app.use(express.json());

app.use(cookieParser());

// Rutas
app.use("/api/mocks", mocksRouter);
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);

// Para Pruebas con Logger ---> /loggerTest
app.get("/loggerTest", (req, res) => {
  req.logger.debug("👀​ Esto es un Debug...");
  req.logger.http("🏠 Esto es un http...");
  req.logger.info("​📝 Esto es Info...");
  req.logger.warning("⚠️​ Esto es una Advertencia!");
  req.logger.error("❌ Esto es un Error...");
  req.logger.fatal("🔥​ Esto es un Error Fatal!");
  res.send(
    "👋🏻​ Los Logs fueron Generados! 🚀 🔎 Revisá la Consola y/o el Archivo errors.log en /src/logs !"
  );
});

// Documentación Swagger ---> /api/docs
swaggerDocs(app);

app.use(errorHandler);

export default app;
