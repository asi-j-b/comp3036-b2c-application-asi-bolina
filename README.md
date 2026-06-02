# Assignment 2 - Blog - Client App

The goal of this assignment is to implement all the client side functionality.
Example implementation is in the image below.

## Success Criteria

- ✅ All of the tests must be passing
- ✅ You must be able to explain any code in the codebase

## Prerequisites

First, make sure that "pnpm" and "turbo" is installed in your computer. If not, please follow installation instructions for pnpm. If turbo is not installed, please install it using pnpm with the following command:

Then, run the following command to install turborepo.

```
pnpm add -g turbo
```

## Installing the project

Once the pnpm is installed, in the root of the project install the packages

```
pnpm i
```

To run end to end tests you need to install headless browsers. Please run the following command in the `tests/playwright-web` directory

```
pnpx playwright install
```

## Environment

In `apps/web`, `apps/admin`, and `packages/db`, copy `.env.example` to `.env` and keep `DATABASE_URL` aligned to the same SQLite file:

```
DATABASE_URL="file:../../packages/db/prisma/dev.db"
```

For the db package Prisma CLI, use the package-local equivalent path in `packages/db/.env`:

```
DATABASE_URL="file:./dev.db"
```

## Running the project

To run the project, run the following command in the root directory of your project:

```
turbo dev
```

This will run:

- Client application at [http://localhost:3001](http://localhost:3001)
- Admin application at [http://localhost:3002](http://localhost:3002)

### Running Tests in Console

If you only wish to visualise the test results in console, please run the following command in the root of your project for the Storefront assignment

```
turbo test-b2c
```

If you want to run all tests, please run

```
turbo all:test
```

This will launch the End to End testing framework Playwright's test UI similar to below, please use the Play buttons to run individual tests:

## 🛍️ Iteration 1: B2C Frontend with Mock Data

This iteration pivots the blog application into a B2C e-commerce store with a focus on frontend-first development using static mock data. The following features have been implemented:

### What's New (Steps 1-4)

#### Step 1: Mock Product Data Layer
- **File**: `packages/db/src/data.ts`
- **Features**:
  - Product type definition with id, name, price, category, stock, imageUrl, rating, and reviews
  - 8 realistic mock products across 6 categories (Electronics, Clothing, Home, Kitchen, Footwear, Accessories)
  - Helper functions: `getCategories()`, `filterByCategory()`, `searchProducts()`, `sortProducts()`
- **Purpose**: Decouples UI from database until backend integration in Iteration 2

#### Step 2: Product Discovery UI
- **Files**: `apps/web/src/components/Products/ProductCard.tsx`, `apps/web/src/components/Products/ProductGrid.tsx`
- **Features**:
  - Responsive grid layout (1 col on mobile → 2 cols on tablet → 3 cols on desktop)
  - Product cards with image, name, category, description, price (AUD format), stock level, and star rating
  - Hero section with category introduction message
  - "Add to Cart" button on each product card
  - "Featured" badge for featured products
- **Purpose**: Provides polished storefront UI for product browsing

#### Step 3: Category & Search Filtering
- **Integrated into**: `apps/web/src/components/Products/ProductGrid.tsx`
- **Features**:
  - Category filter pills (shows all categories + "All" option)
  - Real-time search input (filters by product name and description, case-insensitive)
  - Active filter display showing current selections
  - Empty state message when no products match filters
  - Live product count updates
- **Purpose**: Enables customers to discover products efficiently

#### Step 4: Local Shopping Cart
- **File**: `apps/web/src/hooks/useCart.ts`
- **Features**:
  - React hook managing cart state with `useState`
  - Methods: `addToCart(productId)`, `removeFromCart(productId)`, `clearCart()`
  - Cart summary: `getCartTotal()`, `getCartCount()`, `getCartItems()`
  - Integrated with ProductCard (Add to Cart button triggers cart updates)
- **Purpose**: Provides session-level cart management (persistence to localStorage planned for Iteration 2)

### How to Test Steps 1-4

#### Running B2C Unit Tests

To run only the B2C storefront tests:

```
turbo test-b2c
```

This runs the following test suites:

- **mockProducts.test.ts** (4 tests):
  - ✅ getCategories() returns unique categories
  - ✅ filterByCategory() filters products correctly
  - ✅ searchProducts() matches by name and description
  - ✅ sortProducts() sorts by name, price, and rating

- **ProductCard.test.tsx** (1 browser test):
  - ✅ Renders product card with all details and triggers add-to-cart callback

- **ProductGrid.test.tsx** (2 browser tests):
  - ✅ Renders all products and category filters
  - ✅ Filters products by category when pill is clicked

- **useCart.test.tsx** (1 browser test):
  - ✅ Adds/removes items, calculates total and count correctly

#### Running B2C Tests with UI

To see the tests in the Vitest UI:

```
turbo dev:test-b2c
```

This launches the Vitest and Playwright test interfaces where you can run individual tests with play buttons.

#### Manual Testing in Browser

1. Start the development server:
   ```
   turbo dev
   ```

2. Visit [http://localhost:3001](http://localhost:3001) to see the B2C storefront

3. Test the following scenarios:
   - Browse products in the grid
   - Click category filter pills to filter by category
   - Type in the search box to filter by product name/description
   - Click "Add to Cart" on products (cart count will update)
   - Remove items from cart using the remove button
   - Verify "Featured" badge appears on featured products
   - Check responsive layout on mobile, tablet, and desktop

### New Project Files

```
apps/web/src/
├── data/
│   └── mockProducts.ts                 # Mock product data + helpers
├── components/
│   └── Products/
│       ├── ProductCard.tsx             # Reusable product card component
│       ├── ProductGrid.tsx             # Main discovery UI with filters
│       ├── ProductCard.test.tsx        # Browser tests for ProductCard
│       └── ProductGrid.test.tsx        # Browser tests for ProductGrid
└── hooks/
    ├── useCart.ts                      # Cart state management hook
    └── useCart.test.tsx                # Browser tests for useCart
```

Additionally, `mockProducts.test.ts` provides unit tests for the data layer.

### Next Steps (Iteration 2+)

- Add E2E tests for complete user workflows (browse → filter → add to cart → checkout)
- Persist cart to localStorage for session recovery
- Integrate with backend API for real product data
- Implement checkout flow and payment integration
- Clean up blog components (deferred, doesn't block Iteration 1)

## Project structure

The project is monorepo with the following packages split into three categories:

**Applications**

Contains the following web applications:

- **apps/admin** - Admin Website
- **apps/web** - Client website

**Packages**

Contains the following packages with shared code and configurations:

- **packages/ui** - Library of UI elements shared between admin and client
- **packages/utils** - Library of utility functions shared between other projects
- **packages/db** - Library handling the database connection
- **packages/eslint-config**, **packages/tailwind-config** and **packages/typescript-config** contain configuration files for build pipelines for this project

**Tests**

Contains the following test applications:

- **tests/playwright-admin** - End to End tests for the admin application
- **tests/playwright-web** - End to End tests for the client application
- **tests/storybook** - Configured storybook instance for development and testing of React components in isolation

## Application Structure

The client application comes with pre-defined router (only one route is missing for your learning).
The client application also comes with pre defined structure of components and utilities for you to complete.
Tha admin application is much more bare with most functionality AND structure needed to be completed by you.
