# Option 2 B2C Gap Backlog

Generated on 2026-05-14 from codebase audit.

## BLOCKER 1 - Replace blog schema with B2C schema

Title:
B2C: Add Product, User, Cart, Purchase models and migrate from Post/Like schema

Why:
Database is still blog-only (Post, Like), which blocks all purchase workflows and admin product management.

Acceptance Criteria:
- Add Product model (name, description, price, imageUrl, category, stock, active)
- Add User model (email unique, passwordHash, role)
- Add Purchase model (userId, total, purchasedAt)
- Add PurchaseItem model (purchaseId, productId, quantity, unitPrice)
- Add optional Cart and CartItem models or persist cart at checkout only
- Add migration and seed for products and users

## BLOCKER 2 - Build product and purchase APIs

Title:
B2C: Implement REST/tRPC endpoints for products and purchases

Why:
Current APIs are blog endpoints (posts, likes) and do not satisfy Option 2 backend requirements.

Acceptance Criteria:
- Public products listing endpoint with filter/search/sort
- Product detail endpoint
- Admin product CRUD endpoints (create/update/delete/toggle active)
- Purchase creation endpoint (mock payment flow)
- Purchase history endpoint per user
- Admin purchase listing endpoint
- Input validation and proper status codes

## BLOCKER 3 - Fix auth architecture and security

Title:
Auth: Replace env-based plaintext checks with DB-backed hashed credentials and role-safe JWT

Why:
Current auth compares plaintext env values and allows admin login via password-only branch.

Acceptance Criteria:
- Store users/admins in DB with bcrypt/argon2 hashes
- Login verifies hash against stored user
- Registration endpoint for normal users
- Admin authentication requires explicit admin account role
- JWT contains subject and role, validated on protected routes
- Logout endpoint for web and admin
- Basic rate limiting and lockout policy

## HIGH 4 - Protect checkout and complete mock payment

Title:
Checkout: Enforce auth + add mock payment confirmation flow

Why:
Checkout page is currently a static prompt and does not perform payment or order creation.

Acceptance Criteria:
- Redirect unauthenticated users from checkout to login/register
- On successful auth, return to checkout
- Mock payment form with validation
- On success, create Purchase + PurchaseItem records
- Clear cart and show confirmation page

## HIGH 5 - Implement purchase history pages

Title:
Purchases: Add user purchase history page and admin purchase records page

Why:
No purchase history UI exists for users or admins.

Acceptance Criteria:
- User page to view own purchases (date, items, totals)
- Admin page to view all purchases and filter by date/user
- Backed by purchase history APIs

## HIGH 6 - Convert admin dashboard from posts to products/purchases

Title:
Admin: Replace blog admin screens with Product Management and Purchase Records

Why:
Admin currently manages blog posts, not B2C products/purchases.

Acceptance Criteria:
- Product list screen with filters
- Product create/update/delete
- Stock and visibility controls
- Purchase record screen in admin area

## HIGH 7 - Fix admin login redirect bug

Title:
Admin auth: Redirect to existing admin route after login

Why:
Admin login form redirects to /dashboard, but no dashboard route exists.

Acceptance Criteria:
- Redirect to existing admin page (for example /)
- Add test coverage for login success navigation

## HIGH 8 - Make tests and CI align with B2C scope

Title:
Testing: Add B2C E2E suites and CI jobs for Option 2 flows

Why:
Playwright suites are currently blog-oriented and do not cover checkout/purchase/auth B2C behavior.

Acceptance Criteria:
- E2E for user login/register, cart, checkout, purchase history
- E2E for admin product CRUD and purchase records
- CI workflow runs B2C suites and fails on regressions
- Keep legacy tests passing where required

## MEDIUM 9 - Stabilize shared UI package for auth components

Title:
UI package: Export auth components and remove Next.js coupling from shared package

Why:
@repo/ui type-check currently fails because auth components import next/navigation.

Acceptance Criteria:
- Move Next.js specific logic to app layer, keep UI package framework-agnostic
- Export auth components through package exports map if retained in package
- Pass pnpm -r check-types

## MEDIUM 10 - Update project documentation for Option 2 deliverables

Title:
Docs: Add Option 2 setup, API documentation, deployment URL, demo instructions

Why:
Current README is blog-focused and does not document full Option 2 deliverables.

Acceptance Criteria:
- README includes B2C architecture and run instructions
- API docs for product/auth/purchase endpoints
- Deployment URL and environment setup
- CI/test instructions for B2C suites
- Demo video checklist

