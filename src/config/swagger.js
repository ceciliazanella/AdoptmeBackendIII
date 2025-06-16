import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Adoptme",
      description:
        "API para Gestionar Usuarios, Sesiones, Mascotas y Adopciones.",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
        description: "Servidor Local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        UserSession: {
          type: "object",
          properties: {
            first_name: { type: "string" },
            last_name: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
            cartId: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID de Mongo" },
            first_name: { type: "string" },
            last_name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            role: { type: "string", default: "user" },
            pets: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", description: "ID de la Mascota" },
                },
              },
            },
            documents: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  reference: { type: "string" },
                },
                required: ["name", "reference"],
              },
            },
            last_connection: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
          },
          required: ["first_name", "last_name", "email", "password"],
        },
        Pet: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            specie: { type: "string" },
            birthDate: { type: "string", format: "date" },
            adopted: { type: "boolean", default: false },
            owner: { type: "string", description: "ID del Usuario / Dueño" },
            image: { type: "string" },
          },
          required: ["name", "specie"],
        },
        Adoption: {
          type: "object",
          properties: {
            _id: { type: "string" },
            owner: { type: "string", description: "ID del Usuario" },
            pet: { type: "string", description: "ID de la Mascota" },
          },
        },
        UserCredentials: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "usuario@ejemplo.com",
            },
            password: {
              type: "string",
              example: "123456",
            },
          },
        },
        SessionResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            message: {
              type: "string",
              example: "Usuario Registrado Correctamente!",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            message: {
              type: "string",
              example: "Sesión Iniciada Correctamente!",
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
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
