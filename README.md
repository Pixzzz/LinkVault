# LinkVault

REST API for securely organizing personal bookmarks.

## Stack

- TypeScript, Node.js and Express
- MongoDB with Mongoose
- JWT authentication
- Joi request validation
- Swagger/OpenAPI documentation
- Node.js built-in test runner

## Project structure

```text
BackEnd/
├── src/
│   ├── config/       # Environment and database configuration
│   ├── controllers/  # HTTP request and response handling
│   ├── docs/         # OpenAPI configuration
│   ├── middlewares/  # Authentication, validation and errors
│   ├── models/       # Mongoose models
│   ├── routes/       # API route definitions
│   ├── services/     # Business logic and data access
│   ├── utils/        # Shared helpers
│   ├── validators/   # Joi schemas
│   ├── types/        # Shared HTTP and Express type declarations
│   ├── app.ts        # Express application
│   └── server.ts     # Database connection and HTTP server
└── test/             # Unit tests
```

The complete migration record is available in [`docs/TYPESCRIPT_MIGRATION.md`](docs/TYPESCRIPT_MIGRATION.md).

## Local setup

1. Use Node.js 24 (the required version is also declared in `BackEnd/.nvmrc`).

2. Enter the backend directory and install dependencies:

   ```bash
   cd BackEnd
   npm ci
   ```

3. Copy `.env.example` to `.env` and set the required values.

4. Start the API:

   ```bash
   npm run dev
   ```

The API runs on `http://localhost:3000` by default. Swagger documentation is available at `/api-docs` and the health endpoint at `/api/v1/health`.

### Existing database migration

The previous version stored the bookmark owner in `userID`. Before using an existing database with this version, create a backup and run:

```bash
npm run migrate:bookmarks
```

This renames `userID` to `owner` only on documents that have not already been migrated.

## Commands

- `npm run dev` — run the TypeScript source in watch mode.
- `npm run typecheck` — validate all static types without generating files.
- `npm test` — execute TypeScript unit tests.
- `npm run build` — compile production JavaScript into `dist/`.
- `npm run check` — run type checking, tests and the production build.
- `npm start` — run the compiled production server from `dist/`.

## Main endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/bookmarks`
- `POST /api/v1/bookmarks`
- `GET /api/v1/bookmarks/:id`
- `PATCH /api/v1/bookmarks/:id`
- `DELETE /api/v1/bookmarks/:id`
- `GET /api/v1/users` — administrators only
- `PATCH /api/v1/users/:id/role` — administrators only
- `DELETE /api/v1/users/:id` — administrators only

Protected endpoints expect `Authorization: Bearer <token>`.

## Security

Never commit `.env` files, database credentials or JWT secrets. If a secret is committed, remove it from the repository and rotate it at the provider; deleting the file alone does not invalidate the exposed credential.
