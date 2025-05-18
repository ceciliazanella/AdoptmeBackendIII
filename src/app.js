import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import { errorHandler } from "./utils/errorHandler.js";
import addLogger from "./middlewares/addLogger.js";
import logger from "./utils/logger.js";
import mocksRouter from "./routes/mocks.router.js";

dotenv.config();
/*
Para activar el Modo Producción -Y que se genere Archivo errors.log en la Carpeta logs-, 
la App se ejecuta con:
$env:NODE_ENV="production"; node src/app.js

Para Modo Desarrollo -Sólo en Consola con Colores-:
$env:NODE_ENV="development"; node src/app.js
*/
const app = express();

const PORT = process.env.PORT || 8080;

const MONGO_URI = process.env.MONGO_URI;
// Middleware de Logger
app.use(addLogger);
// Conexión a Mongo con Logger
mongoose
  .connect(MONGO_URI)
  .then(() => logger.info("✅ La Conexión con MongoDB es todo un Éxito!"))
  .catch((err) =>
    logger.fatal("❌ Hubo un Error de Conexión con MongoDB: " + err.message)
  );

app.use(express.json());
app.use(cookieParser());

app.use("/api/mocks", mocksRouter);

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);

app.get("/loggerTest", (req, res) => {
  req.logger.debug("Esto es un Debug...");
  req.logger.http("Esto es un http...");
  req.logger.info("Esto es Info...");
  req.logger.warning("Esto es una Advertencia!");
  req.logger.error("Esto es un Error...");
  req.logger.fatal("Esto es un Error Fatal!");

  res.send(
    "Los Logs fueron Generados! 🚀 Ver en Consola y logs/errors.log si el Entorno es de Producción..."
  );
});
// Middleware para Errores
app.use(errorHandler);

app.listen(PORT, () =>
  logger.info(`🚀 El Servidor se está Escuchando en el Puerto ${PORT}`)
);
