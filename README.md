# hono-drizzle-openapi

A small REST API built with [Hono](https://hono.dev/), [Drizzle ORM](https://orm.drizzle.team/) (PostgreSQL), and [OpenAPI](https://www.openapis.org/) schemas via [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi). Interactive docs are served with [Scalar](https://scalar.com/).

## Prerequisites

- Node.js (see `package.json` engines if present)
- PostgreSQL
- bun (or compatible package manager)

## Environment

Create a `.env` file in the project root. Variables are validated at startup with Zod (`src/env.ts`).

| Variable       | Required | Description                                            |
| -------------- | -------- | ------------------------------------------------------ |
| `DATABASE_URL` | Yes      | PostgreSQL connection string                           |
| `PORT`         | No       | HTTP port (default: `3000`)                            |
| `NODE_ENV`     | No       | `development` or `production` (default: `development`) |

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
PORT=3000
NODE_ENV=development
```

## Setup

```bash
bun install
```

Apply database migrations (after configuring `DATABASE_URL`):

```bash
bun run db:migrate
```

Alternatively, for local development you can push the schema without migration files:

```bash
bun run db:push
```

## Scripts

| Script                            | Description                                   |
| --------------------------------- | --------------------------------------------- |
| `bun run dev`                     | Run the API with hot reload (`tsx watch`)     |
| `bun run build`                   | Compile TypeScript to `dist/`                 |
| `bun run start`                   | Run compiled output (`node dist/index.js`)    |
| `bun run db:generate`             | Generate Drizzle migrations from schema       |
| `bun run db:migrate`              | Run migrations against the database           |
| `bun run db:push`                 | Push schema (dev-friendly)                    |
| `bun run db:studio`               | Open Drizzle Studio                           |
| `bun run db:gen-fresh`            | Remove migrations and regenerate (uses `bun`) |
| `bun run lint` / `bun run format` | Check lint and formatting                     |
| `bun run quality`                 | Lint and format checks together               |
| `bun run quality:fix`             | Auto-fix lint issues and format code          |

## Running locally

```bash
bun run dev
```

The server listens on `http://localhost:<PORT>` (default port `3000`).

## API

### OpenAPI and docs

- **OpenAPI JSON:** `GET /doc`
- **Scalar UI:** `GET /reference`

### Todos (example CRUD)

Base paths are mounted at `/` (see `src/app.ts`).

| Method   | Path         | Description   |
| -------- | ------------ | ------------- |
| `GET`    | `/todos`     | List todos    |
| `POST`   | `/todos`     | Create a todo |
| `GET`    | `/todos/:id` | Get one todo  |
| `PATCH`  | `/todos/:id` | Update a todo |
| `DELETE` | `/todos/:id` | Delete a todo |

Todo IDs use UUIDv7.

## Project layout

- `src/index.ts` — HTTP server entry (`@hono/node-server`)
- `src/app.ts` — App assembly and route registration
- `src/libs/` — App factory, OpenAPI wiring, shared types
- `src/routers/` — Route modules (handlers + OpenAPI route definitions)
- `src/db/` — Drizzle schema and migrations
- `src/middleware/` — Logging, errors, 404 handling
- `src/openapi/` — Shared OpenAPI helpers and schemas

## License

[MIT](LICENSE)
