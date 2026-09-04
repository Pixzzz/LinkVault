const swaggerJsdoc = require("swagger-jsdoc");
const config = require("../config/env");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "LinkVault API",
      version: "1.0.0",
      description: "API for securely managing personal bookmarks.",
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: "Local development",
      },
    ],
    tags: [
      { name: "Authentication" },
      { name: "Bookmarks" },
      { name: "Users" },
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
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            username: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["user", "admin"] },
          },
        },
        Bookmark: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            url: { type: "string", format: "uri" },
            tags: { type: "array", items: { type: "string" }, maxItems: 7 },
            owner: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                message: { type: "string" },
                requestId: { type: "string" },
                details: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
      },
    },
    paths: {
      "/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Create an account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["username", "email", "password"],
                  properties: {
                    username: { type: "string" },
                    email: { type: "string", format: "email" },
                    password: { type: "string", format: "password" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Account created" } },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Sign in",
          responses: {
            200: { description: "Authentication successful" },
            401: { description: "Invalid credentials" },
          },
        },
      },
      "/auth/me": {
        get: {
          tags: ["Authentication"],
          summary: "Get the authenticated user",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Current user" } },
        },
      },
      "/bookmarks": {
        get: {
          tags: ["Bookmarks"],
          summary: "List the authenticated user's bookmarks",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", maximum: 100 } },
            { name: "tag", in: "query", schema: { type: "string" } },
            { name: "search", in: "query", schema: { type: "string" } },
          ],
          responses: { 200: { description: "Paginated bookmarks" } },
        },
        post: {
          tags: ["Bookmarks"],
          summary: "Create a bookmark",
          security: [{ bearerAuth: [] }],
          responses: { 201: { description: "Bookmark created" } },
        },
      },
      "/bookmarks/{id}": {
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        get: {
          tags: ["Bookmarks"],
          summary: "Get an owned bookmark",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Bookmark" }, 404: { description: "Not found" } },
        },
        patch: {
          tags: ["Bookmarks"],
          summary: "Update an owned bookmark",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Bookmark updated" } },
        },
        delete: {
          tags: ["Bookmarks"],
          summary: "Delete an owned bookmark",
          security: [{ bearerAuth: [] }],
          responses: { 204: { description: "Bookmark deleted" } },
        },
      },
      "/users": {
        get: {
          tags: ["Users"],
          summary: "List users (admin only)",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Paginated users" }, 403: { description: "Forbidden" } },
        },
      },
      "/users/{id}/role": {
        patch: {
          tags: ["Users"],
          summary: "Update a user's role (admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { 200: { description: "Role updated" }, 403: { description: "Forbidden" } },
        },
      },
      "/users/{id}": {
        delete: {
          tags: ["Users"],
          summary: "Delete a user (admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { 204: { description: "User deleted" }, 403: { description: "Forbidden" } },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);

