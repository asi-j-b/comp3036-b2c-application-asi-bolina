# B2C Store Application - Pivot Roadmap & Phase Breakdown

## 📅 VISUAL TIMELINE

```
Current State (Blog)
┌─────────────────────────────────────┐
│ Posts | Likes | Categories | Tags   │
│ Admin: Edit/Delete Posts            │
│ Frontend: View Posts, Like Posts    │
└─────────────────────────────────────┘
           ↓ (PIVOT)
           
Iteration 1: Frontend with Mock Data (4-5 weeks)
┌─────────────────────────────────────────────────────────────┐
│ ✅ Products (mock data)                                     │
│ ✅ Categories (filter by category)                         │
│ ✅ Search (client-side search)                             │
│ ✅ Shopping Cart (localStorage)                            │
│ ✅ Checkout (mock payment)                                 │
│ ✅ Product Details Page                                    │
│ ✅ E2E Tests (Playwright)                                  │
│ ❌ Database (No changes yet)                               │
│ ❌ Real Authentication (Not required)                      │
│ ❌ Payment Integration (Mock only)                         │
└─────────────────────────────────────────────────────────────┘
           ↓ 
           
Iteration 2: Backend & Database (2-3 weeks)
┌─────────────────────────────────────────────────────────────┐
│ ✅ Prisma Models: Product, Cart, Purchase                  │
│ ✅ Real API: GET /api/products                             │
│ ✅ Admin API: POST/PUT/DELETE /api/products                │
│ ✅ User Authentication (JWT)                               │
│ ✅ Cart Persistence (Database)                             │
│ ✅ Purchase History                                         │
│ ✅ Delete Blog Models (if not needed)                      │
│ ❌ Payment Gateway (Still mock)                            │
└─────────────────────────────────────────────────────────────┘
           ↓ 
           
Iteration 3: Enhancement & Deployment (2-3 weeks)
┌─────────────────────────────────────────────────────────────┐
│ ✅ Real Payment (Stripe/PayPal)                            │
│ ✅ Admin Dashboard (Charts, Analytics)                     │
│ ✅ Email Notifications                                     │
│ ✅ Image Upload (Cloud Storage)                            │
│ ✅ Advanced Filters (Price Range, Reviews)                 │
│ ✅ CI/CD Pipeline                                          │
│ ✅ Deploy to Production                                    │
│ ✅ Demo Video                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 PHASE BREAKDOWN: DETAILED WORKFLOW

### PHASE 1: SETUP (Days 1-3)
**Focus:** Prepare the foundation without breaking existing blog

**Tasks:**
1. Create mock product data file (`apps/web/src/data/mockProducts.ts`)
   - Define Product type: id, slug, name, price, category, image, stock, description
   - Add 8-10 sample products across 3 categories
   
2. Prepare Prisma schema (document changes, don't migrate yet)
   - Plan Product, Cart, Purchase models
   - Keep Post/Like models intact
   
3. Create type file (`packages/db/src/data.ts` or new `types.ts`)
   - Export Product type for use across apps
   - Export Cart, CartItem types
   
4. Set up Storybook mock data setup
   - Configure Storybook to use mockProducts.ts

**Deliverable:** Mock data layer ready; schema planned; types defined

**Validation:**
- [ ] No TypeScript errors
- [ ] Mock data imports successfully in components
- [ ] Storybook runs without errors

---

### PHASE 2A: CORE UI COMPONENTS (Days 4-7)
**Focus:** Build the foundational components for product browsing

**Tasks:**
1. ProductCard component
   - Display: image, name, price, stock status, category tag, "Add to Cart" button
   - States: normal, hover, out-of-stock
   - Props: product, onAddToCart callback
   
2. ProductGrid component
   - Map over products array
   - Responsive layout: 1 col (mobile), 2 col (tablet), 3-4 col (desktop)
   - Sort/filter pass-through (prepare for search/filter integration)
   
3. Products listing page (`/products`)
   - Fetch mock products
   - Render ProductGrid
   - Add placeholder loading state (if needed)

**Deliverable:** Product listing page functional with mock data

**Validation:**
- [ ] Page displays 8+ products
- [ ] Grid is responsive
- [ ] "Add to Cart" button visible on each card
- [ ] No console errors

---

### PHASE 2B: CART STATE MANAGEMENT (Days 8-10)
**Focus:** Implement cart state and persistence

**Tasks:**
1. useCart hook or CartContext
   - State: { items: CartItem[], total: number }
   - Functions: addToCart, removeFromCart, updateQuantity, getCart, clearCart
   - localStorage integration for persistence
   
2. CartProvider (if using Context)
   - Wrap app in context provider
   - Initialize cart from localStorage on mount
   
3. Test cart state
   - Add/remove items works
   - Quantity updates work
   - Total recalculates
   - localStorage persists

**Deliverable:** Cart state fully functional and persisted

**Validation:**
- [ ] Add product to cart → state updates
- [ ] Refresh page → cart persists
- [ ] Remove product → state updates
- [ ] Quantity change → total recalculates

---

### PHASE 2C: CART UI COMPONENTS (Days 11-13)
**Focus:** Build UI components that interact with cart state

**Tasks:**
1. CartIcon component (in header)
   - Shows cart count badge
   - Clickable to navigate to `/cart`
   - Updates in real-time with cart state
   
2. CartPage component (`/cart`)
   - Show empty cart message if no items
   - List items: image, name, price, quantity selector, remove button
   - Cart summary: subtotal, tax, shipping, total
   - Buttons: "Continue Shopping", "Proceed to Checkout"
   
3. Cart integration
   - Add CartProvider to layout
   - Update header with CartIcon
   - Create `/cart` route

**Deliverable:** Cart page functional; users can add/remove items

**Validation:**
- [ ] Cart count updates in header
- [ ] Cart page shows all items
- [ ] Quantity can be changed
- [ ] Remove button works
- [ ] Total calculates correctly

---

### PHASE 2D: FILTERING & SEARCH (Days 14-16)
**Focus:** Add discovery features to product listing

**Tasks:**
1. CategoryFilter component
   - Buttons for "All", "Electronics", "Clothing", "Home"
   - State: selected category
   - Callback: onCategoryChange
   
2. SearchInput component
   - Input field for product search
   - Real-time filtering as user types
   - Clear button
   
3. Integrate into ProductsPage
   - Add CategoryFilter above ProductGrid
   - Add SearchInput above ProductGrid
   - Apply filters to products before rendering
   - Combine filters (search AND category)
   
4. Update /products route
   - Import filters
   - Render with filters active

**Deliverable:** Product discovery fully functional (search + filter)

**Validation:**
- [ ] Category filter works
- [ ] Search works
- [ ] Filters combine correctly
- [ ] "All" resets filters

---

### PHASE 2E: PRODUCT DETAIL PAGE (Days 17-19)
**Focus:** Build individual product pages

**Tasks:**
1. ProductDetail component
   - Display: large image, name, price, category, full description, stock level
   - "Add to Cart" with quantity selector (1-10 or stock limit)
   
2. Related Products section
   - Show 3-4 products from same category
   - Exclude current product
   
3. Create route `/product/[slug]/page.tsx`
   - Fetch mock product by slug
   - Render ProductDetail
   - Handle 404 if slug not found
   
4. Link ProductCard → Product Detail
   - ProductCard onclick navigates to product detail

**Deliverable:** Product detail pages working

**Validation:**
- [ ] Product detail page loads
- [ ] Can add product to cart
- [ ] Related products display
- [ ] 404 shows for invalid slug

---

### PHASE 3: CHECKOUT & PAYMENT (Days 20-22)
**Focus:** Implement checkout flow

**Tasks:**
1. CheckoutForm component
   - Sections: Shipping (name, email, address), Payment (card, expiry, CVC)
   - Form validation
   - Submit handler
   
2. CheckoutPage (`/checkout`)
   - Show order summary (items from cart)
   - Render CheckoutForm
   - On submit: show confirmation or navigate to confirmation page
   
3. OrderConfirmation component / page
   - Show: Order number, items, total, thank you message
   - Button: "Continue Shopping" (link to /products)
   
4. Update CartPage
   - "Proceed to Checkout" button → navigates to /checkout

**Deliverable:** Checkout flow complete (mock payment)

**Validation:**
- [ ] CheckoutPage loads
- [ ] Form validation works
- [ ] Submit succeeds with valid data
- [ ] Confirmation page shows
- [ ] Clear on page close or refresh

---

### PHASE 4: TESTING (Days 23-25)
**Focus:** Write comprehensive E2E tests

**Tasks:**
1. Create products.spec.ts
   - Test: products page loads with mock data
   - Test: search filters products
   - Test: category filter works
   - Test: can navigate to product detail
   
2. Create cart.spec.ts
   - Test: add product to cart
   - Test: cart count updates in header
   - Test: cart persists on refresh
   - Test: remove item from cart
   - Test: update quantity
   
3. Create checkout.spec.ts
   - Test: proceed to checkout from cart
   - Test: checkout form validation
   - Test: submit checkout succeeds
   - Test: show order confirmation
   
4. Run tests locally
   - All tests pass
   - No flaky tests

**Deliverable:** E2E test suite complete and passing

**Validation:**
- [ ] All tests pass
- [ ] No console errors
- [ ] Tests are stable (not flaky)

---

### PHASE 5: POLISH & DOCUMENTATION (Days 26-28)
**Focus:** Finalize Iteration 1

**Tasks:**
1. Add Storybook stories
   - ProductCard.stories.tsx
   - CartIcon.stories.tsx
   - CartPage.stories.tsx
   - SearchInput.stories.tsx
   - CategoryFilter.stories.tsx
   
2. API endpoint (stub)
   - Create GET /api/products endpoint
   - Returns mock products (no query params yet)
   
3. Documentation
   - Update README with Iteration 1 features
   - List known limitations (localStorage, mock payment, no auth)
   - Outline Iteration 2 roadmap
   - Add screenshots/demo links
   
4. Code cleanup
   - Fix TypeScript warnings
   - Remove any console.logs
   - Consistent naming conventions
   - Add JSDoc comments

**Deliverable:** Iteration 1 polished and documented

**Validation:**
- [ ] Storybook runs
- [ ] API endpoint works
- [ ] Documentation updated
- [ ] No console errors or warnings

---

## 🏗️ ITERATION 1 ARCHITECTURE

```
apps/web/src/
├── app/
│   ├── page.tsx (home, can link to /products)
│   ├── products/
│   │   └── page.tsx (list with search + filter)
│   ├── product/
│   │   └── [slug]/
│   │       └── page.tsx (detail page)
│   ├── cart/
│   │   └── page.tsx (cart review)
│   ├── checkout/
│   │   ├── page.tsx (checkout form)
│   │   └── confirmation/
│   │       └── page.tsx (order confirmation)
│   ├── layout.tsx (add CartProvider, CartIcon in header)
│   └── api/
│       ├── products/
│       │   └── route.ts (GET /api/products - mock)
│       └── cart/
│           └── route.ts (POST /api/cart - optional stub)
│
├── components/
│   ├── Products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCard.stories.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── RelatedProducts.tsx
│   │   ├── SearchInput.tsx
│   │   └── CategoryFilter.tsx
│   │
│   ├── Cart/
│   │   ├── CartIcon.tsx
│   │   ├── CartIcon.stories.tsx
│   │   ├── CartPage.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   ├── CheckoutForm.tsx
│   │   ├── OrderConfirmation.tsx
│   │   └── *.stories.tsx
│   │
│   └── Layout/
│       └── Header.tsx (updated with CartIcon)
│
├── hooks/
│   └── useCart.ts (cart state management)
│
├── context/
│   └── CartContext.tsx (if using Context instead of hook)
│
└── data/
    └── mockProducts.ts (mock product data)

packages/db/src/
├── data.ts (or new types.ts)
│   ├── export type Product
│   ├── export type CartItem
│   ├── export type Cart
│   └── export const products: Product[]
```

---

## ✅ ITERATION 1 ACCEPTANCE CRITERIA

### Functional
- [ ] Users can browse all products
- [ ] Users can search products by name
- [ ] Users can filter products by category
- [ ] Users can add products to cart
- [ ] Users can view cart and modify quantities
- [ ] Users can remove items from cart
- [ ] Users can proceed to checkout
- [ ] Users can enter shipping and payment info
- [ ] Users see order confirmation
- [ ] Cart persists across page refreshes

### Technical
- [ ] All code is TypeScript with strict mode
- [ ] All components have Storybook stories
- [ ] E2E test coverage for all user flows
- [ ] No console errors or warnings
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Fast loading (< 2s for products page)

### Documentation
- [ ] README updated with features list
- [ ] Known limitations documented
- [ ] API endpoint documented
- [ ] Test coverage documented
- [ ] Iteration 2 roadmap outlined

---

## 📋 ITERATION 2 PREVIEW (Planning Only)

```
Database Integration
├── Create Prisma models: Product, Cart, Purchase
├── Run migration
├── Create real API endpoints
├── Add user authentication
└── Persist cart to database

Backend APIs
├── GET /api/products (query database)
├── POST /api/cart (create cart record)
├── PUT /api/cart/[id] (update cart)
├── DELETE /api/cart/[id] (remove from cart)
├── GET /api/purchases (user's past orders)
└── POST /api/purchases (create order from cart)

Admin Features
├── GET /api/admin/products (list all)
├── POST /api/admin/products (create)
├── PUT /api/admin/products/[id] (update)
├── DELETE /api/admin/products/[id] (delete)
└── Admin inventory page

User Authentication
├── Sign up endpoint
├── Login endpoint
├── JWT token generation
└── Middleware to verify auth on protected routes
```

---

## 📊 RISK & MITIGATION MATRIX

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| localStorage cart is lost on clear | Medium | High | Add warning toast; improve Iteration 2 with DB |
| Mock data doesn't match real schema | Medium | Medium | Document Product interface early; freeze schema before features |
| Search/filter performance issues | Low | Low | Test with 100+ products early; optimize if needed |
| E2E tests are flaky | High | Medium | Use waitFor; avoid hardcoded waits; test on CI early |
| Components become complex | Medium | Medium | Keep components small; use composition; review PRs early |
| Missed accessibility requirements | Medium | Low | Use axe-core tests; test with keyboard; test with screen reader |

---

## 🎯 SUCCESS METRICS FOR ITERATION 1

- ✅ All user stories completed
- ✅ E2E tests passing (100%)
- ✅ No console errors or warnings
- ✅ Responsive design tested on 3+ devices
- ✅ Accessibility audit passes
- ✅ Performance: products page < 2s load
- ✅ Code review: 2+ approvals per PR
- ✅ Documentation: README, API docs, known limitations
- ✅ Demo: Record 3-5 minute walkthrough

---

## 🚀 LAUNCH READINESS (End of Iteration 1)

**Ready to Merge:** 
- [ ] All features implemented
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Documentation complete
- [ ] Team sign-off

**Handoff to Iteration 2:**
- [ ] Feature branch → main
- [ ] Tag release v1.0.0-alpha
- [ ] Create Iteration 2 planning issue
- [ ] Brief Iteration 2 team on architecture

---

## 📞 COMMUNICATION PLAN

**Weekly Standup Topics:**
- Blockers and dependencies
- Feature completion status
- Test coverage progress
- Demo updates

**PR Review Criteria:**
- Code follows TypeScript strict mode
- Components have Storybook stories
- E2E tests included
- Comments/JSDoc for complex logic
- No console errors

**Definition of Done (per PR):**
- Code changes complete
- Tests passing locally and in CI
- Code reviewed and approved
- Documentation updated
- Demo/screenshot provided
