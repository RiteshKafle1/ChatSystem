import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chat Application",
      version: "1.0.0",
      description: "API documentation for Chat Application",
    },
    servers: [
      {
        url: "http://localhost:2500/",
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app, port) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // console.log(`📘 Swagger Docs running at http://localhost:${port}/api-docs`);
};
