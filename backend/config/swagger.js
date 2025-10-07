// config/swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Tienda (Categorías, Productos, Usuarios, Imágenes)",
      version: "1.0.0",
      description: "Documentación generada con Swagger para la API de Express",
    },
    servers: [
      {
        url: "http://localhost:3000", // cambia si usas otro puerto
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
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // 📂 todas tus rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
