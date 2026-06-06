# COMP3036 B2C Store Application

A full-stack Business-to-Consumer store built as a continuation of the COMP3036 blog assignment. Customers browse products, manage a cart, complete mock payments, and view purchase history. Administrators manage products, inventory, and purchase records.

## Architecture

Monorepo managed with **pnpm** and **Turborepo**:

| App / Package | Port | Purpose |
|---|---|---|
| `apps/web` | 3001 | Customer storefront |
| `apps/admin` | 3002 | Admin dashboard |
| `packages/db` | — | Prisma schema, seed data, database client |
| `tests/playwright` | — | B2C and legacy E2E tests |

**Stack:** Next.js (App Router), TypeScript, Prisma, SQLite (local) / PostgreSQL (deploy), JWT cookies (`web_auth_token`, `admin_auth_token`), Tailwind CSS, Vitest, Playwright.

## Prerequisites

- Node.js 20+
- pnpm 10+
- Turborepo (`pnpm add -g turbo`)

## Setup

1. Install dependencies from the repository root:

```bash
pnpm i
```

2. Copy environment files and align the database path:

```bash
# apps/web/.env
DATABASE_URL="file:../../packages/db/prisma/dev.db"
JWT_SECRET=secret

# apps/admin/.env
DATABASE_URL="file:../../packages/db/prisma/dev.db"
JWT_SECRET=secret

# packages/db/.env
DATABASE_URL="file:./dev.db"
JWT_SECRET=secret
```

3. Create and seed the database:

```bash
pnpm --filter @repo/db db:push
pnpm --filter @repo/db db:seed
```

4. Install Playwright browsers for E2E tests:

```bash
cd tests/playwright
pnpm exec playwright install chromium
```

## Running the Application

Start both apps:

```bash
turbo dev
```

- Storefront: [http://localhost:3001](http://localhost:3001)
- Admin: [http://localhost:3002](http://localhost:3002)

## Seed Users

| Role | Email | Password |
|---|---|---|
| Customer | `alicekingsley@gmail.com` | `P@ssword123!` |
| Customer | `marcuschen@yahoo.com` | `Secure#2026` |
| Admin | `johnathanbradley@admin.com` | `AdminPortal#1` |
| Admin | `elenarostova@admin.com` | `M@sterKey99!` |

## Testing

### B2C submission tests (primary gate)

With both apps running (`turbo dev`), from the repository root:

```bash
turbo test-b2c
```

This runs:

- **Vitest** unit/browser tests in `apps/web`
- **Playwright** B2C E2E tests in `tests/playwright` (storefront, mock payment, admin flows)

Run only Playwright B2C tests:

```bash
cd tests/playwright
pnpm test-b2c
```

### Other test commands

```bash
turbo all:test    # All unit + legacy + B2C tests
turbo test        # Package unit tests
turbo test-1      # Legacy blog client E2E (@a1)
turbo test-2      # Legacy blog admin E2E (@a2)
turbo test-3      # Legacy auth E2E (@a3)
```

Vitest UI for storefront component tests:

```bash
turbo dev:test-b2c
```

## Features

### Customer (storefront)

- Product catalogue with search and category filtering
- Product detail pages
- Local-storage shopping cart
- Registration and JWT login
- Checkout with mock payment gateway
- Purchase history on the account page
- `GET /api/orders` for authenticated order retrieval

### Admin

- JWT staff login
- Product create, update, delete, and active toggle
- Inventory overview
- Purchase records dashboard

## API Documentation

See [API.md](./API.md) for request/response details.

## Deployment

1. Set `DATABASE_URL` to your hosted database (e.g. Neon PostgreSQL).
2. Set `JWT_SECRET` in both `apps/web` and `apps/admin`.
3. Run migrations and seed:

```bash
pnpm --filter @repo/db db:push
pnpm --filter @repo/db db:seed
```

4. Build and start:

```bash
turbo build
pnpm --filter web start
pnpm --filter admin start
```

Deploy each Next.js app to your platform of choice (e.g. Vercel). Use separate deployments or ports for storefront and admin.

## CI

GitHub Actions workflow `.github/workflows/grading.yml` builds the project, seeds the database, runs unit tests, and executes B2C E2E tests via `pnpm test-b2c` in `tests/playwright`.

## Project Structure

```
apps/
  web/          Storefront Next.js app
  admin/        Admin Next.js app
packages/
  db/           Prisma schema, seed, shared data types
  ui/           Shared UI components
  utils/        Shared utilities
tests/
  playwright/   Playwright E2E tests (B2C + legacy assignments)
```
