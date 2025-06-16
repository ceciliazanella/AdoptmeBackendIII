import logger from "../utils/logger.js";

const addLogger = (req, res, next) => {
  req.logger = logger;
  logger.http(`[${req.method}] ${req.url}`);
  next();
};

export default addLogger;
