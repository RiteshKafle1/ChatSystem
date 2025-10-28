import expressListEndpoints from "express-list-endpoints";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import {
  Collection,
  Item,
  Request,
  RequestBody,
  Event,
} from "postman-collection";


export function generateDocs(app) {
  const endpoints = expressListEndpoints(app);
  const swaggerPaths = {};
  const postmanItems = [];

  endpoints.forEach((ep) => {
    ep.methods.forEach((method) => {
      const lowerMethod = method.toLowerCase();
      const tagName = ep.path.split("/")[2] || "general";

      // Swagger Paths
      swaggerPaths[ep.path] = swaggerPaths[ep.path] || {};
      swaggerPaths[ep.path][lowerMethod] = {
        tags: [tagName],
        summary: `${method} ${ep.path}`,
        description: `Auto-generated route for ${ep.path}`,
        requestBody: ["post", "put", "patch"].includes(lowerMethod)
          ? {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    example: { exampleKey: "exampleValue" },
                  },
                },
              },
            }
          : undefined,
        responses: {
          200: { description: "OK" },
          400: { description: "Bad Request" },
          500: { description: "Server Error" },
        },
      };

      // Postman Item
      const sampleBody = ["POST", "PUT", "PATCH"].includes(method)
        ? JSON.stringify({ exampleKey: "exampleValue" }, null, 2)
        : "";

      const request = new Request({
        url: `{{base_url}}${ep.path}`,
        method,
        header: [{ key: "Content-Type", value: "application/json" }],
        body: new RequestBody({ mode: "raw", raw: sampleBody }),
      });

      const tests = `
        pm.test("Status code is 200", function () {
          pm.response.to.have.status(200);
        });
        pm.test("Response is valid JSON", function () {
          pm.expect(() => JSON.parse(pm.response.text())).not.to.throw();
        });
      `;

      const item = new Item({
        name: `${method} ${ep.path}`,
        request,
        event: [
          new Event({
            listen: "test",
            script: { type: "text/javascript", exec: tests.split("\n") },
          }),
        ],
      });

      postmanItems.push(item);
    });
  });

  const swaggerDoc = {
    openapi: "3.0.0",
    info: {
      title: "MERN API Docs (Auto)",
      version: "1.0.0",
      description: "Auto-generated Swagger + Postman setup with test scripts",
    },
    servers: [{ url: "http://localhost:5000" }],
    paths: swaggerPaths,
  };

  const postmanCollection = new Collection({
    info: {
      name: "MERN API (Auto Generated)",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: postmanItems,
  });

  fs.writeFileSync("docs/swagger.json", JSON.stringify(swaggerDoc, null, 2));
  fs.writeFileSync(
    "docs/postman_collection.json",
    JSON.stringify(postmanCollection, null, 2)
  );

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  console.log("✅ Swagger + Postman files regenerated.");
  return swaggerDoc;
}
