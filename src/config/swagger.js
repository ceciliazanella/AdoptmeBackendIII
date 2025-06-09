import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Adoptme",
      description: "API para Gestionar Usuarios, Mascotas y Adopciones.",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app) => {
  app.use(
    "/api/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(swaggerSpecs)
  );
};
