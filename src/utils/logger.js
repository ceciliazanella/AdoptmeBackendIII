import winston from "winston";
import fs from "fs";
import path from "path";

const logDir = path.resolve("src", "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "redBG",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

winston.addColors(customLevels.colors);

const buildLogger = (env) => {
  const transports = [];

  if (env === "development") {
    transports.push(
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.simple()
        ),
      })
    );
  } else {
    try {
      transports.push(
        new winston.transports.Console({
          level: "info",
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: path.join(logDir, "errors.log"),
          level: "error",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        })
      );
    } catch (err) {
      console.error(
        "Hubo un Error al querer Crear el Transport de Archivo:",
        err
      );
    }
  }
  return winston.createLogger({
    levels: customLevels.levels,
    level: env === "development" ? "debug" : "info",
    transports,
  });
};

const logger = buildLogger(process.env.NODE_ENV || "development");

export default logger;
