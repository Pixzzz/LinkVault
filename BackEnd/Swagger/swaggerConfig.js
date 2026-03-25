const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { required } = require("joi");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "linkVault",
      version: "1.0.0",
      description: "Api for saving your favorites and personal BookMarks",
      contact: {
        name: "Eleazar Moreta",
        email: "eleazar1225@hotmail.com",
      },
    },
    server: [
      {
        url: "http://localhost:3000/",
        description: "development",
      },
      {
        url: "",
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "https",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authentication",
        },
      },
      schemas: {
        user: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            username: {
              type: "string",
              example: "Juan",
            },
            email: {
              type: "string",
              example: "Juan@gmail.com",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              default: "user",
            },
          },
        },
        BookMark: {
          type: "object",
          required: ["title", "description", "url"],
          properties: {
            _id: {
              type: "string",
            },
            title: {
              type: "string",
              example: "learn mongoDb",
            },
            description: {
              type: "string",
              example: "web to learn mongoDb",
            },
            url: {
              type: "string",
              example: "http://w3schools.com/mongodb/",
            },
            userID: {
              type: "string",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "string",
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
    },
  },
  apis: ["./endpoints/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = { swaggerUI, swaggerSpec };
