const swaggerJsdoc = require("swagger-jsdoc");
const constants = require("../constants/constants")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Url shortener API",
      version: "1.0.0",
      description: "Url shortener API documentation",
    },
    servers: [
      {
        url: `http://localhost:${constants.PORT}`,
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
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;