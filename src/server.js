import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import logger from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info("✔️ Estás Conectado a la Base de Datos de MongoDB!");
    app.listen(PORT, () => {
      logger.info(
        `🚀 El Servidor se está Escuchando en http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    logger.fatal("❌ Hubo un Error de Conexión con MongoDB..." + err.message);
  });
