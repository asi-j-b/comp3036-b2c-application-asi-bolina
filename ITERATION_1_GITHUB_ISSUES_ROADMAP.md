# B2C Store Application - Iteration 1 GitHub Issues Roadmap

## Overview
This document outlines the GitHub issues needed to track Iteration 1 development: Frontend-first B2C Store with static mock data.

**Iteration 1 Goal:** Deliver a fully functional product browsing and shopping cart UI using mock data.

---

## SYSTEM REQUIREMENTS (To Add to GitHub Issues)

### Requirement Categories:

#### **FUNCTIONAL REQUIREMENTS**
- Products must be displayed with: name, description, price, category, image, stock status
- Users must be able to filter products by category
- Users must be able to search products by name
- Users must be able to add/remove products from shopping cart
- Shopping cart must persist across page refreshes (localStorage)
- Checkout page must display order summary with total
- Mock payment confirmation must succeed

#### **NON-FUNCTIONAL REQUIREMENTS**
- All pages must be responsive (mobile, tablet, desktop)
- Product pages must load in under 2 seconds
- Shopping cart operations must be instant (no loading states initially)
- Code must be 80%+ test coverage for new components
- All new components must have Storybook stories
- No console errors or warnings

#### **TECHNICAL REQUIREMENTS**
- Use React hooks for state management (useState, useContext)
- Use Tailwind CSS for styling
- Use TypeScript for all new code
- Use Playwright for E2E tests
- Follow existing monorepo patterns (component structure, naming)

#### **ACCESSIBILITY REQUIREMENTS**
- All buttons must have proper ARIA labels
- All form inputs must have associated labels
- Keyboard navigation must work on all pages
- Color contrast must meet WCAG AA standards
- Product cards must be announced to screen readers

---

## ISSUE TEMPLATE & BREAKDOWN

### Issue: [SETUP] Create Mock Product Data Structure

**Epic:** Frontend Iteration 1  
**Priority:** P0 - Blocker  
**Effort:** 1-2 hours  

**Description:**
Create the mock data layer that will serve product information for Iteration 1. This establishes the Product interface that the frontend will use and eventually maps to Prisma in Iteration 2.

**Acceptance Criteria:**
- [ ] File `apps/web/src/data/mockProducts.ts` created
- [ ] Exported `Product` interface with fields: id, slug, name, description, price, category, imageUrl, stock, sku
- [ ] Minimum 8 mock products across 3 categories: Electronics, Clothing, Home
- [ ] Each product has a unique slug (URL-friendly ID)
- [ ] Mock data includes realistic prices ($10-$500 range)
- [ ] Mock data includes varied stock levels (0, 5, 50, 100+)
- [ ] All products have valid image URLs (Unsplash or similar)
- [ ] Product type exported from `packages/db/src/data.ts` for import across apps
- [ ] No console warnings when importing

**Definition of Done:**
- Code is TypeScript with no `any` types
- Product type is documented with JSDoc comments
- All mock data passes type checking

---

### Issue: [FEAT] Product Listing & Grid Layout

**Epic:** Frontend Iteration 1  
**Priority:** P0 - Blocker  
**Depends On:** [SETUP] Create Mock Product Data Structure  
**Effort:** 3-4 hours  

**Description:**
Build the main product browsing experience. Users should see a grid of products with key details (image, name, price, stock status) and be able to see an "Add to Cart" button on each product.

**Acceptance Criteria:**
- [ ] New route `/products` displays all mock products
- [ ] Products rendered in responsive grid (1 col mobile, 2 col tablet, 3-4 col desktop)
- [ ] ProductCard component displays: image, name, description preview, price, stock status, "Add to Cart" button
- [ ] ProductCard has hover effect (shadow or scale) on desktop
- [ ] ProductCard shows badge when stock is 0 (disabled state)
- [ ] "Add to Cart" button is keyboard accessible and labeled
- [ ] Page has title "Products" and optional description
- [ ] Mock data loads without API call (direct import from mockProducts.ts)
- [ ] Storybook stories created for ProductCard with various states (in stock, out of stock)

**Definition of Done:**
- Component passes TypeScript strict mode
- E2E test: "should display all products on listing page"
- E2E test: "should show out-of-stock badge for products with 0 stock"
- No console errors

---

### Issue: [FEAT] Product Search Functionality

**Epic:** Frontend Iteration 1  
**Priority:** P1  
**Depends On:** [FEAT] Product Listing & Grid Layout  
**Effort:** 2-3 hours  

**Description:**
Add search capability to filter products by name and description. Users type in a search box and results update in real-time (client-side filtering for Iteration 1).

**Acceptance Criteria:**
- [ ] Search input field added to `/products` page (sticky header or top of grid)
- [ ] Real-time filtering as user types (no debounce needed for mock data)
- [ ] Search is case-insensitive
- [ ] Search matches against product name and description fields
- [ ] Empty search or cleared input shows all products
- [ ] "No results found" message when search returns 0 products
- [ ] Search input clears when user clicks X button or manually deletes
- [ ] Search state survives component re-renders
- [ ] Search input has label "Search products"

**Definition of Done:**
- E2E test: "should filter products by search query"
- E2E test: "should show no results message when search has no matches"
- E2E test: "should clear search and show all products"

---

### Issue: [FEAT] Product Category Filtering

**Epic:** Frontend Iteration 1  
**Priority:** P1  
**Depends On:** [FEAT] Product Listing & Grid Layout  
**Effort:** 2-3 hours  

**Description:**
Add category filter to allow users to browse products by category (Electronics, Clothing, Home, etc.). Users can select one category or view all.

**Acceptance Criteria:**
- [ ] Category filter buttons displayed above product grid
- [ ] Filter options: "All", "Electronics", "Clothing", "Home"
- [ ] Selected category is visually highlighted (bold, underline, or button state)
- [ ] Clicking category filters products in real-time
- [ ] "All" button shows all products regardless of category
- [ ] Category filter state persists during page session
- [ ] Filter works in combination with search (search narrows filtered results)
- [ ] Mobile: Category filter is a dropdown or horizontal scroll (not stacking vertically)
- [ ] Filter buttons are keyboard accessible (Tab, Enter/Space to select)

**Definition of Done:**
- E2E test: "should filter products by category"
- E2E test: "should combine search and category filters"
- Storybook story: CategoryFilter component with all states

---

### Issue: [FEAT] Shopping Cart State Management

**Epic:** Frontend Iteration 1  
**Priority:** P0 - Blocker  
**Depends On:** [SETUP] Create Mock Product Data Structure  
**Effort:** 3-4 hours  

**Description:**
Implement cart state management using React Context or custom hook. Cart persists to localStorage so items survive page refreshes.

**Acceptance Criteria:**
- [ ] Custom hook `useCart` or Context `CartProvider` created in `apps/web/src/hooks/useCart.ts` or `apps/web/src/context/CartContext.tsx`
- [ ] Cart state includes: items (productId, quantity, price), total (calculated on change)
- [ ] AddToCart function adds product or increments quantity if already in cart
- [ ] RemoveFromCart function removes product entirely
- [ ] UpdateQuantity function allows changing quantity (min 1, max stock)
- [ ] GetCart function returns current cart state
- [ ] Cart persists to localStorage on every change
- [ ] Cart loads from localStorage on app initialization
- [ ] Cart total is calculated correctly (sum of price * quantity)
- [ ] Type: CartItem = { productId: number; quantity: number; price: number }
- [ ] Type: Cart = { items: CartItem[]; total: number }

**Definition of Done:**
- No console warnings on add/remove from cart
- E2E test: "should add product to cart"
- E2E test: "should persist cart after page refresh"
- Storybook mock provided for testing

---

### Issue: [FEAT] Cart Counter in Header

**Epic:** Frontend Iteration 1  
**Priority:** P1  
**Depends On:** [FEAT] Shopping Cart State Management  
**Effort:** 1-2 hours  

**Description:**
Add a cart icon/button to the main header that displays the number of items in the cart. Should update in real-time as products are added/removed.

**Acceptance Criteria:**
- [ ] Cart icon added to main layout header (e.g., Layout.tsx or similar)
- [ ] Badge displays total quantity of items in cart (e.g., "3")
- [ ] Badge updates immediately when product is added or removed
- [ ] Cart icon is clickable and navigates to `/cart` page
- [ ] Cart count is 0 when no items in cart
- [ ] Badge has distinct styling (circle, color) for visibility
- [ ] Cart icon has aria-label: "Shopping cart with X items"
- [ ] Badge updates persist through page navigation

**Definition of Done:**
- E2E test: "should display cart count in header"
- E2E test: "should update cart count when product added"
- Storybook story: CartIcon with different count values

---

### Issue: [FEAT] Shopping Cart Page

**Epic:** Frontend Iteration 1  
**Priority:** P0 - Blocker  
**Depends On:** [FEAT] Shopping Cart State Management  
**Effort:** 4-5 hours  

**Description:**
Build the cart page (`/cart`) where users review items before checkout. Users can adjust quantities, remove items, and see the total.

**Acceptance Criteria:**
- [ ] Route `/cart` displays all items in shopping cart
- [ ] Empty cart shows message: "Your cart is empty" with link to products
- [ ] Each cart item shows: product image, name, price, quantity, line total (price × quantity)
- [ ] Quantity can be changed with +/- buttons or input field
- [ ] Quantity is constrained by stock level (can't exceed available stock)
- [ ] Remove button removes item from cart
- [ ] Cart summary displays: subtotal, tax (0% or mock), shipping (0% or mock), total
- [ ] "Continue Shopping" button links to `/products`
- [ ] "Proceed to Checkout" button is disabled if cart is empty
- [ ] Clicking "Proceed to Checkout" navigates to `/checkout`
- [ ] Cart updates in real-time as user changes quantities

**Definition of Done:**
- E2E test: "should display cart items on cart page"
- E2E test: "should update quantity and recalculate total"
- E2E test: "should remove item from cart"
- E2E test: "should show empty cart message when no items"

---

### Issue: [FEAT] Product Detail Page

**Epic:** Frontend Iteration 1  
**Priority:** P1  
**Depends On:** [FEAT] Product Listing & Grid Layout, [FEAT] Shopping Cart State Management  
**Effort:** 3-4 hours  

**Description:**
Build individual product detail pages (`/product/[slug]`) where users see full product information and can add to cart.

**Acceptance Criteria:**
- [ ] Route `/product/[slug]` fetches and displays mock product data by slug
- [ ] Page shows: large image, name, price, category, description, full details, stock level
- [ ] "Add to Cart" button is prominent and includes quantity selector (default 1)
- [ ] Quantity selector allows 1-10 items (or stock limit, whichever is lower)
- [ ] "Add to Cart" shows success toast/notification
- [ ] Related products section shows 3-4 products from same category (excluding current)
- [ ] Back button or breadcrumb to return to products page
- [ ] 404 page if product slug not found
- [ ] Page title and meta description are set (for SEO)
- [ ] Mobile: Full-width image, stacked layout

**Definition of Done:**
- E2E test: "should display product details"
- E2E test: "should add product to cart from detail page"
- E2E test: "should show 404 for invalid product slug"

---

### Issue: [FEAT] Checkout & Mock Payment

**Epic:** Frontend Iteration 1  
**Priority:** P0 - Blocker  
**Depends On:** [FEAT] Shopping Cart Page  
**Effort:** 4-5 hours  

**Description:**
Build the checkout flow where users review cart, enter shipping/billing info (mocked), and complete mock payment.

**Acceptance Criteria:**
- [ ] Route `/checkout` displays checkout form with three sections: Order Summary, Shipping, Payment
- [ ] Order Summary shows items from cart (read-only) with total
- [ ] Shipping section has fields: Full Name, Email, Address, City, State, ZIP
- [ ] Payment section has fields: Card Number (mock, accepts any 16 digits), Expiry (MM/YY), CVC (3 digits)
- [ ] All fields are required and show validation errors on blur/submit if empty
- [ ] "Confirm Order" button is disabled until form is valid
- [ ] Clicking "Confirm Order" shows success message or navigates to confirmation page
- [ ] Confirmation page shows: Order Number (mock: #ORD-12345), items ordered, total, "Thank You" message
- [ ] Confirmation page has "Continue Shopping" button (links to `/products`)
- [ ] Back button available to return to cart
- [ ] Form input data is not persisted (cleared on page close)
- [ ] Mobile: Form is full-width and easily tappable

**Definition of Done:**
- E2E test: "should submit checkout form with valid data"
- E2E test: "should show validation errors for empty fields"
- E2E test: "should show order confirmation page after submit"
- E2E test: "should disable confirm button until form is valid"

---

### Issue: [TEST] E2E Test Suite - Product Browsing Flow

**Epic:** Frontend Iteration 1  
**Priority:** P1  
**Depends On:** [FEAT] Product Listing & Grid Layout, [FEAT] Product Search, [FEAT] Product Category Filtering  
**Effort:** 2-3 hours  

**Description:**
Write comprehensive E2E tests for the product browsing experience (search, filter, browse detail).

**Acceptance Criteria:**
- [ ] Test file: `tests/playwright/tests/web/products.spec.ts`
- [ ] Test: "should load products page and display all products"
- [ ] Test: "should search for product by name"
- [ ] Test: "should filter products by category"
- [ ] Test: "should combine search and category filters"
- [ ] Test: "should navigate to product detail page"
- [ ] Test: "should show 404 for invalid product slug"
- [ ] Test: "should show out-of-stock badge"
- [ ] Test: "should add product to cart from product detail page"
- [ ] All tests pass locally and in CI (setup later)

**Definition of Done:**
- All tests pass with mock data
- Tests use meaningful selectors (data-testid or accessible names)
- No hardcoded waits (use waitFor instead)
- Tests document the user journey

---

### Issue: [TEST] E2E Test Suite - Shopping Cart Flow

**Epic:** Frontend Iteration 1  
**Priority:** P1  
**Depends On:** [FEAT] Shopping Cart Page, [FEAT] Checkout & Mock Payment  
**Effort:** 2-3 hours  

**Description:**
Write comprehensive E2E tests for shopping cart and checkout experience.

**Acceptance Criteria:**
- [ ] Test file: `tests/playwright/tests/web/cart.spec.ts`
- [ ] Test: "should add product to cart and update header count"
- [ ] Test: "should remove product from cart"
- [ ] Test: "should update quantity in cart"
- [ ] Test: "should persist cart after page refresh"
- [ ] Test: "should show empty cart message when cart is empty"
- [ ] Test: "should calculate correct total with multiple items"
- [ ] Test: "should proceed to checkout from cart page"
- [ ] Test: "should complete checkout with valid data"
- [ ] Test: "should show validation errors on checkout form"
- [ ] Test: "should show order confirmation after successful checkout"
- [ ] All tests pass locally and in CI

**Definition of Done:**
- All tests pass with mock data
- Tests verify cart persistence (localStorage)
- Tests verify calculations (total, line items)
- No hardcoded waits

---

### Issue: [FEAT] Product Data Endpoint

**Epic:** Frontend Iteration 1  
**Priority:** P2  
**Depends On:** [SETUP] Create Mock Product Data Structure  
**Effort:** 1-2 hours  

**Description:**
Create a mock API endpoint `/api/products` that returns product data. This prepares for database integration in Iteration 2.

**Acceptance Criteria:**
- [ ] Endpoint: `apps/web/src/app/api/products/route.ts`
- [ ] GET /api/products returns all mock products as JSON
- [ ] Response includes optional query params: ?category=Electronics, ?search=laptop
- [ ] Filtering works on the mock data (category, search)
- [ ] Returns proper JSON with Content-Type header
- [ ] Returns 200 status on success
- [ ] Endpoint is documented in README or comment

**Definition of Done:**
- Endpoint can be tested in Postman or browser
- Response matches Product interface
- Code is DRY (reuses mockProducts.ts)

---

### Issue: [SETUP] Storybook Stories for New Components

**Epic:** Frontend Iteration 1  
**Priority:** P2  
**Depends On:** [FEAT] Product Listing & Grid Layout, [FEAT] Shopping Cart Page  
**Effort:** 2-3 hours  

**Description:**
Create Storybook stories for all new components to enable design review and isolated testing.

**Acceptance Criteria:**
- [ ] Stories file: `apps/web/src/components/Products/ProductCard.stories.tsx`
- [ ] Stories file: `apps/web/src/components/Cart/CartIcon.stories.tsx`
- [ ] Stories file: `apps/web/src/components/Cart/CartPage.stories.tsx`
- [ ] ProductCard stories show: in-stock, out-of-stock, different prices
- [ ] CartIcon stories show: empty cart (0), multiple items (3, 10+)
- [ ] CartPage stories show: empty cart, single item, multiple items
- [ ] All stories render without errors
- [ ] Stories are documented with descriptions

**Definition of Done:**
- Storybook runs without errors
- All stories are visually accurate
- Stories use mock data

---

### Issue: [SETUP] Update TypeScript Types for B2C

**Epic:** Frontend Iteration 1  
**Priority:** P2  
**Depends On:** [SETUP] Create Mock Product Data Structure  
**Effort:** 1 hour  

**Description:**
Centralize and document all new B2C types (Product, Cart, CartItem, etc.) for consistency.

**Acceptance Criteria:**
- [ ] File: `packages/db/src/types.ts` (or update `data.ts`)
- [ ] Export: Product interface
- [ ] Export: Cart interface (items + total)
- [ ] Export: CartItem interface (productId, quantity, price)
- [ ] All types have JSDoc comments
- [ ] Types are imported into `apps/web/src/data/mockProducts.ts`
- [ ] No circular dependencies

**Definition of Done:**
- TypeScript compiles without errors
- Types are reused across components

---

### Issue: [DOCS] Iteration 1 Frontend Completion Checklist

**Epic:** Frontend Iteration 1  
**Priority:** P3  
**Effort:** 1 hour  

**Description:**
Document all Iteration 1 deliverables and mark completion as features ship.

**Acceptance Criteria:**
- [ ] README or PROGRESS.md created
- [ ] Lists all Iteration 1 features with completion status
- [ ] Iteration 1 acceptance criteria documented
- [ ] Known limitations documented (localStorage persistence, mock payment, no auth required)
- [ ] Iteration 2 roadmap outlined
- [ ] Screenshots or demo links included

**Definition of Done:**
- Documentation is clear and up-to-date
- Team can reference progress easily

---

## ISSUE DEPENDENCIES GRAPH

```
[SETUP] Create Mock Product Data
  ├── [FEAT] Product Listing & Grid
  │   ├── [FEAT] Product Search
  │   ├── [FEAT] Category Filtering
  │   └── [FEAT] Product Detail Page
  │
  ├── [FEAT] Shopping Cart State
  │   ├── [FEAT] Cart Counter in Header
  │   ├── [FEAT] Cart Page
  │   │   └── [FEAT] Checkout & Payment
  │   │       └── [TEST] Cart E2E Tests
  │
  ├── [FEAT] Products API Endpoint
  │
  └── [SETUP] Update TypeScript Types
      └── [SETUP] Storybook Stories

[TEST] Product Browsing Tests
  └── All Product/Search/Filter features

[DOCS] Completion Checklist
  └── All features complete
```

---

## PRIORITY & EFFORT SUMMARY

| Priority | Feature | Effort | Blockers |
|----------|---------|--------|----------|
| P0 | Product Listing | 3-4h | Mock data |
| P0 | Cart State Mgmt | 3-4h | Mock data |
| P0 | Cart Page | 4-5h | Cart state |
| P0 | Checkout | 4-5h | Cart page |
| P1 | Search | 2-3h | Product listing |
| P1 | Category Filter | 2-3h | Product listing |
| P1 | Product Detail | 3-4h | Product listing |
| P1 | Cart Counter | 1-2h | Cart state |
| P1 | E2E Tests | 4-6h | All features |
| P2 | API Endpoint | 1-2h | Mock data |
| P2 | Storybook | 2-3h | All components |
| P2 | Types | 1h | Mock data |
| P3 | Documentation | 1h | All done |
| **Total** | **Iteration 1** | **30-42h** | **None** |

---

## NEXT STEPS (After Iteration 1)

1. **Iteration 2:** Database integration (Prisma models, real API)
2. **Iteration 2:** User authentication (login/register)
3. **Iteration 2:** Purchase history and order tracking
4. **Iteration 3:** Payment gateway (Stripe/PayPal)
5. **Iteration 3:** Admin inventory management
6. **Iteration 3:** Email notifications

---

## GITHUB ISSUE LABELS

Suggested labels for organizing issues:

```
Type: Setup
Type: Feature
Type: Test
Type: Documentation
Type: Bug

Priority: P0-Blocker
Priority: P1-High
Priority: P2-Medium
Priority: P3-Low

Iteration: Iteration-1
Iteration: Iteration-2

Team: Frontend
Team: Backend
Team: DevOps
```

---

## ESTIMATED TIMELINE

- **Sprint 1:** [SETUP] + P0 Features (1-2 weeks)
- **Sprint 2:** P1 Features + Testing (1-2 weeks)
- **Sprint 3:** P2 Features + Polish (1 week)
- **Iteration 1 Complete:** ~4-5 weeks with 1 person

Adjust based on available hours per week.
